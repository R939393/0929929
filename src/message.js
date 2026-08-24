import '../HAN_SETTINGS.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import crypto from 'crypto';
import { Jimp } from 'jimp';
import chokidar from 'chokidar';
import { fileURLToPath } from 'url';
import { parsePhoneNumber } from 'awesome-phonenumber';
import { fileTypeFromBuffer, fileTypeFromFile } from 'file-type';
import { writeExif } from '../HANZ-DATA/exif.js';
import { getBuffer, fixBytes } from '../HANZ-DATA/function.js';
import { jidNormalizedUser, proto, getBinaryNodeChild, generateWAMessageContent, prepareWAMessageMedia, areJidsSameUser, extractMessageContent, generateMessageID, downloadContentFromMessage, generateWAMessageFromContent, jidDecode, generateWAMessage, getContentType, getDevice } from 'baileys';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RAEHAN2GDPath = fileURLToPath(new URL('../RAEHAN2GD.js', import.meta.url));

let RAEHAN2GDHandler = null;
const groupMetadataTimers = {};

const reloadHandler = async () => {
	try {
		RAEHAN2GDHandler = (await import(`../RAEHAN2GD.js?update=${Date.now()}`)).default;
	} catch (err) {
		console.error(chalk.redBright(`[ERROR] ${err}`));
	}
};

reloadHandler();

async function GroupUpdate(RAEHAN2GD, m, store) {
	function clearParse(parse) {
		try {
			return JSON.parse(parse);
		} catch {
			return parse;
		}
	}
	if (!m.messageStubType || !m.isGroup) return
	if (global.db?.groups?.[m.chat] && store?.groupMetadata?.[m.chat]) {
		const admin = `@${m.sender.split('@')[0]}`
		const metadata = store.groupMetadata[m.chat];
		const type = m.messageStubType;
	}
}

async function GroupParticipantsUpdate(RAEHAN2GD, update, store) {
	try {
		const { id, participants, author, action } = update;
		function updateAdminStatus(participants, metadataParticipants, status) {
			for (const participant of metadataParticipants) {
				if (participants.includes(jidNormalizedUser(participant.id)) || participants.includes(jidNormalizedUser(participant.phoneNumber))) {
					participant.admin = status;
				}
			}
		}
	} catch (e) {
		throw e;
	}
}

async function LoadDataBase(RAEHAN2GD, m) {
	try {
		const botNumber = await RAEHAN2GD.decodeJid(RAEHAN2GD.user.id);
	
		let user = global.db.users[m.sender] || {};
		let setBot = global.db.set[botNumber] || {};
		
		global.db.set[botNumber] = setBot;
		if (!m.sender.endsWith('@g.us')) global.db.users[m.sender] = user;
		
		const defaultSetBot = {
			lang: 'id',
			authorPrefix: '',
			owner: global.owner,
			whitelist: [],
		};
		for (let key in defaultSetBot) {
			if (!(key in setBot)) setBot[key] = defaultSetBot[key];
		}
	} catch (e) {
		throw e
	}
}

async function MessagesUpsert(RAEHAN2GD, message, store) {
	try {
		let botNumber = await RAEHAN2GD.decodeJid(RAEHAN2GD.user.id);
		const msg = message.messages[0];
		const remoteJid = msg.key.remoteJid;
		(store.messages ??= {})[remoteJid] ??= {};
		store.messages[remoteJid].array ??= [];
		store.messages[remoteJid].keyId ??= new Set();
		if (!(store.messages[remoteJid].keyId instanceof Set)) {
			store.messages[remoteJid].keyId = new Set(store.messages[remoteJid].array.map(m => m.key.id));
		}
		if (store.messages[remoteJid].keyId.has(msg.key.id)) return;
		store.messages[remoteJid].array.push(msg);
		store.messages[remoteJid].keyId.add(msg.key.id);
		const type = msg.message ? (getContentType(msg.message) || Object.keys(msg.message)[0]) : '';
		const m = await Serialize(RAEHAN2GD, msg, store);
		
		if (RAEHAN2GDHandler) {
			RAEHAN2GDHandler(RAEHAN2GD, m, msg, store);
		} else {
			await reloadHandler();
			if (RAEHAN2GDHandler) RAEHAN2GDHandler(RAEHAN2GD, m, msg, store);
		}
	} catch (e) {
		console.log(message);
		throw e;
	}
}

async function Solving(RAEHAN2GD, store) {
	RAEHAN2GD.serializeM = (m) => MessagesUpsert(RAEHAN2GD, m, store)
	
	RAEHAN2GD.decodeJid = (jid) => {
		if (!jid) return jid
		if (/:\d+@/gi.test(jid)) {
			let decode = jidDecode(jid) || {}
			return decode.user && decode.server && decode.user + '@' + decode.server || jid
		} else return jid
	}
	
	RAEHAN2GD.findJidByLid = (lid, store, resolve = false) => {
		const groupMeta = store?.groupMetadata
		if (groupMeta) {
			for (const g of Object.values(groupMeta)) {
				if (!g?.participants) continue
				for (const contact of g.participants) {
					if (((contact?.id?.includes(lid)) || (contact?.phoneNumber?.includes(lid))) && contact?.phoneNumber) {
						return contact.phoneNumber
					}
				}
			}
		}
		const contacts = store?.contacts
		if (contacts) {
			for (const contact of Object.values(contacts)) {
				if (((contact?.id?.includes(lid)) || (contact?.phoneNumber?.includes(lid))) && contact?.phoneNumber) {
					return contact.phoneNumber
				}
			}
		}
		if (resolve) return lid
		return null
	}
	
	RAEHAN2GD.getName = async (jid, withoutContact = false) => {
		const id = RAEHAN2GD.decodeJid(jid);
		if (id.endsWith('@g.us')) {
			const groupInfo = store.contacts[id] || (store.groupMetadata[id] ? store.groupMetadata[id] : (store.groupMetadata[id] = await RAEHAN2GD.groupMetadata(id).catch(e => ({ ...store.groupMetadata[id] })))) || {};
			return groupInfo.name || groupInfo.subject || parsePhoneNumber('+' + id.replace('@g.us', '')).number?.international;
		} else {
			if (id === '0@s.whatsapp.net') {
				return 'WhatsApp';
			}
		const contactInfo = store.contacts[id] || {};
		return withoutContact ? '' : contactInfo.name || contactInfo.subject || contactInfo.verifiedName || parsePhoneNumber('+' + id.replace('@s.whatsapp.net', '')).number?.international;
		}
	}
	
	RAEHAN2GD.sendContact = async (jid, kon, quoted = '', opts = {}) => {
		let list = []
		for (let i of kon) {
			list.push({
				displayName: await RAEHAN2GD.getName(i + '@s.whatsapp.net'),
				vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await RAEHAN2GD.getName(i + '@s.whatsapp.net')}\nFN:${await RAEHAN2GD.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.ADR:;;Indonesia;;;;\nitem2.X-ABLabel:Region\nEND:VCARD`
			})
		}
		RAEHAN2GD.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted, ephemeralExpiration: quoted?.expiration || quoted?.metadata?.ephemeralDuration || store?.messages[jid]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0 });
	}
	
	RAEHAN2GD.profilePictureUrl = async (jid, type = 'image', timeoutMs) => {
		const result = await RAEHAN2GD.query({
			tag: 'iq',
			attrs: {
				target: jidNormalizedUser(jid),
				to: '@s.whatsapp.net',
				type: 'get',
				xmlns: 'w:profile:picture'
			},
			content: [{
				tag: 'picture',
				attrs: {
					type, query: 'url'
				},
			}]
		}, timeoutMs);
		const child = getBinaryNodeChild(result, 'picture');
		return child?.attrs?.url;
	}
	
	RAEHAN2GD.setStatus = (status) => {
		RAEHAN2GD.query({
			tag: 'iq',
			attrs: {
				to: '@s.whatsapp.net',
				type: 'set',
				xmlns: 'status',
			},
			content: [{
				tag: 'status',
				attrs: {},
				content: Buffer.from(status, 'utf-8')
			}]
		})
		return status
	}
	
	RAEHAN2GD.relayMessageV2 = async (jid, message, options) => {
		const msg = generateWAMessageFromContent(jid, message, {
			upload: RAEHAN2GD.waUploadToServer,
			messageId: generateMessageID(),
			userJid: RAEHAN2GD.user.id, // DITAMBAHKAN
			...options
		});
		const hasil = await RAEHAN2GD.relayMessage(jid, msg.message, {
			messageId: msg.key.id,
			...options
		});
		return hasil;
	}

	RAEHAN2GD.sendPoll = (jid, name = '', values = [], quoted, selectableCount = 1) => {
		return RAEHAN2GD.sendMessage(jid, { poll: { name, values, selectableCount }}, { quoted, ephemeralExpiration: quoted?.expiration || quoted?.metadata?.ephemeralDuration || store?.messages[jid]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0 })
	}
	
	RAEHAN2GD.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
		const quotedOptions = { quoted, ephemeralExpiration: quoted?.expiration || quoted?.metadata?.ephemeralDuration || store?.messages[jid]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0 }
		try {
			const res = await axios.head(url);
			let mime = res.headers['content-type'];
			if (mime && mime.includes('gif')) {
				return RAEHAN2GD.sendMessage(jid, { video: { url }, caption: caption, gifPlayback: true, ...options }, quotedOptions);
			} else if (mime && mime === 'application/pdf') {
				return RAEHAN2GD.sendMessage(jid, { document: { url }, mimetype: 'application/pdf', caption: caption, ...options }, quotedOptions);
			} else if (mime && mime.includes('image')) {
				return RAEHAN2GD.sendMessage(jid, { image: { url }, caption: caption, ...options }, quotedOptions);
			} else if (mime && mime.includes('video')) {
				return RAEHAN2GD.sendMessage(jid, { video: { url }, caption: caption, mimetype: 'video/mp4', ...options }, quotedOptions);
			} else if (mime && mime.includes('audio')) {
				return RAEHAN2GD.sendMessage(jid, { audio: { url }, mimetype: 'audio/mpeg', ...options }, quotedOptions);
			} else {
				return RAEHAN2GD.sendMessage(jid, { document: { url }, caption: caption, mimetype: mime, ...options }, quotedOptions);
			}
		} catch (e) {
			return RAEHAN2GD.sendMessage(jid, { text: url, ...options }, quotedOptions);
		}
	}
	
	RAEHAN2GD.sendGroupInviteV4 = async (jid, participant, inviteCode, inviteExpiration, groupName = 'Unknown Subject', caption = 'Invitation to join my WhatsApp group', jpegThumbnail = null, options = {}) => {
		const msg = proto.Message.create({
			groupInviteMessage: {
				inviteCode,
				inviteExpiration: parseInt(inviteExpiration) || + new Date(new Date + (3 * 86400000)),
				groupJid: jid,
				groupName,
				jpegThumbnail: Buffer.isBuffer(jpegThumbnail) ? jpegThumbnail : null,
				caption,
				contextInfo: {
					mentionedJid: options.mentions || []
				}
			}
		});
		const message = generateWAMessageFromContent(participant, msg, { userJid: RAEHAN2GD.user.id, ...options }); // DITAMBAHKAN
		const invite = await RAEHAN2GD.relayMessage(participant, message.message, { messageId: message.key.id })
		return invite
	}
	
	RAEHAN2GD.sendFromOwner = async (jids, text, quoted, options = {}) => {
		for (const a of jids) {
			const jid = a.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
			await RAEHAN2GD.sendMessage(jid, { text, ...options }, { quoted, ephemeralExpiration: quoted?.expiration || quoted?.metadata?.ephemeralDuration || store?.messages[jid]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0 })
		}
	}
	
	RAEHAN2GD.sendText = async (jid, text, quoted, options = {}) => RAEHAN2GD.sendMessage(jid, { text: text, mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...options }, { quoted, ephemeralExpiration: quoted?.expiration || quoted?.metadata?.ephemeralDuration || store?.messages[jid]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0 })
	
	RAEHAN2GD.sendAsSticker = async (jid, pathMedia, quoted, options = {}) => {
    // PERBAIKAN: Gunakan fs.readFileSync agar file path dibaca sebagai buffer
    let buff = Buffer.isBuffer(pathMedia) ? pathMedia : /^data:.*?\/.*?;base64,/i.test(pathMedia) ? Buffer.from(pathMedia.split`,`[1], 'base64') : /^https?:\/\//.test(pathMedia) ? await (await getBuffer(pathMedia)) : fs.existsSync(pathMedia) ? fs.readFileSync(pathMedia) : Buffer.alloc(0);
    
    const result = await writeExif(buff, options);
    try {
        let anu = await RAEHAN2GD.sendMessage(jid, { sticker: { url: result }, ...options }, { quoted, ephemeralExpiration: quoted?.expiration || quoted?.metadata?.ephemeralDuration || store?.messages[jid]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0 });
        return anu;
    } finally {
        if (fs.existsSync(pathMedia)) fs.unlinkSync(pathMedia);
        if (fs.existsSync(result)) fs.unlinkSync(result);
    }
}
	
	RAEHAN2GD.downloadMediaMessage = async (message) => {
		const msg = message.msg || message;
		msg.mediaKey = fixBytes(msg.mediaKey);
		msg.fileSha256 = fixBytes(msg.fileSha256);
		msg.fileEncSha256 = fixBytes(msg.fileEncSha256);
		const mime = msg.mimetype || '';
		const messageType = (message.type || mime.split('/')[0]).replace(/Message/gi, '');
		const stream = await downloadContentFromMessage(msg, messageType);
		let buffer = Buffer.from([]);
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk]);
		}
		return buffer
	}
	
	RAEHAN2GD.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    const msg = message.msg || message;
    msg.mediaKey = fixBytes(msg.mediaKey);
    msg.fileSha256 = fixBytes(msg.fileSha256);
    msg.fileEncSha256 = fixBytes(msg.fileEncSha256);
    const mime = msg.mimetype || '';
    const messageType = (message.type || mime.split('/')[0]).replace(/Message/gi, '');
    const ext = mime.split('/')[1]?.split(';')[0] || 'bin';
    
    const dir = path.join(__dirname, '../HANZ-DATA');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const randomName = crypto.randomBytes(6).readUIntLE(0, 6).toString(36);
    const trueFileName = attachExtension ? path.join(dir, `${filename ? filename : randomName}.${ext}`) : path.join(dir, filename || randomName);
    
    const stream = await downloadContentFromMessage(msg, messageType);
    
    // PERBAIKAN: Ganti proses .pipe() dengan iterasi buffer AsyncIterable
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
}
	
	RAEHAN2GD.getFile = async (PATH) => {
		let filename;
		let mime = 'application/octet-stream';
		let ext = 'bin';
		let isTemp = false;
		
		const dir = path.join(__dirname, '../HANZ-DATA');
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
		
		const randomName = crypto.randomBytes(6).readUIntLE(0, 6).toString(36);
		
		if (Buffer.isBuffer(PATH)) {
			let type = await fileTypeFromBuffer(PATH) || { mime, ext };
			mime = type.mime; ext = type.ext;
			filename = path.join(dir, `${randomName}.${ext}`);
			fs.writeFileSync(filename, PATH);
			isTemp = true;
		} else if (/^data:.*?\/.*?;base64,/i.test(PATH)) {
			let buffer = Buffer.from(PATH.split`,`[1], 'base64');
			let type = await fileTypeFromBuffer(buffer) || { mime, ext };
			mime = type.mime; ext = type.ext;
			filename = path.join(dir, `${randomName}.${ext}`);
			fs.writeFileSync(filename, buffer);
			isTemp = true;
		} else if (typeof PATH === 'string' && /^https?:\/\//.test(PATH)) {
			const res = await axios.get(PATH, { responseType: 'stream' });
			mime = res.headers['content-type'] || 'application/octet-stream';
			ext = mime.split('/')[1]?.split(';')[0] || 'tmp';
			if (ext === 'jpeg') ext = 'jpg';
			filename = path.join(dir, `${randomName}.${ext}`);
			const writeStream = fs.createWriteStream(filename);
			res.data.pipe(writeStream);
			await new Promise((resolve, reject) => {
				writeStream.on('finish', resolve);
				writeStream.on('error', reject);
			});
			isTemp = true;
		} else if (typeof PATH === 'string' && fs.existsSync(PATH)) {
			let type = await fileTypeFromFile(PATH) || { mime, ext };
			mime = type.mime; ext = type.ext;
			filename = PATH;
			isTemp = false;
		} else {
			throw new Error("Format media tidak didukung");
		}
		return { filename, mime, ext, isTemp };
	}
	
	RAEHAN2GD.appendResponseMessage = async (m, text) => {
		let apb = await generateWAMessage(m.chat, { text, mentions: m.mentionedJid }, { userJid: RAEHAN2GD.user.id, quoted: m.quoted && m.quoted.fakeObj(), ephemeralExpiration: m.expiration || m?.metadata?.ephemeralDuration || store?.messages[m.chat]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0 });
		apb.key = m.key
		apb.key.id = [...Array(32)].map(() => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('');
		apb.key.fromMe = areJidsSameUser(m.sender, RAEHAN2GD.user.id);
		if (m.isGroup) apb.participant = m.sender;
		return RAEHAN2GD.ev.emit('messages.upsert', {
			...m,
			messages: [proto.WebMessageInfo.create(apb)],
			type: 'append'
		});
	}

	RAEHAN2GD.appendResponseMessageV2 = async (jid, content) => {
		let msg = await generateWAMessage(jid, content, { userJid: RAEHAN2GD.user.id, ephemeralExpiration: store?.messages[jid]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0 });
		msg.key.fromMe = areJidsSameUser(jid, RAEHAN2GD.user.id);
		msg.key.id = [...Array(32)].map(() => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('');
		return RAEHAN2GD.ev.emit('messages.upsert', { type: 'append', messages: [proto.WebMessageInfo.create(msg)] });
	}
	
	RAEHAN2GD.sendMedia = async (jid, pathMedia, fileName = '', caption = '', quoted = '', options = {}) => {
		const { mime, filename, isTemp } = await RAEHAN2GD.getFile(pathMedia);
		const botNumber = RAEHAN2GD.decodeJid(RAEHAN2GD.user.id);
		const isWebpSticker = options.asSticker || /webp/.test(mime);
		let type = 'document', mimetype = mime, pathFile = filename;
		let filesToDelete = [];
		if (isTemp) filesToDelete.push(filename);
		try {
			if (isWebpSticker) {
				pathFile = await writeExif(filename, {
					packname: options.packname || global.db?.set?.[botNumber]?.packname || 'Bot WhatsApp',
					author: options.author || global.db?.set?.[botNumber]?.author || 'RAEHAN2GDdev',
					categories: options.categories || [],
				});
				filesToDelete.push(pathFile);
				type = 'sticker';
				mimetype = 'image/webp';
			} else if (/image|video|audio/.test(mime)) {
				type = mime.split('/')[0];
				mimetype = type == 'video' ? 'video/mp4' : type == 'audio' ? 'audio/mpeg' : mime;
			}
			let anu = await RAEHAN2GD.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ephemeralExpiration: quoted?.expiration || quoted?.metadata?.ephemeralDuration || store?.messages[jid]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0, ...options });
			return anu;
		} finally {
			filesToDelete.forEach(file => {
				if (fs.existsSync(file)) fs.unlinkSync(file);
			});
		}
	}
	
	RAEHAN2GD.sendAlbumMessage = async (jid, content = {}, options = {}) => {
		const { album, mentions, contextInfo, ...others } = content;
		for (const media of album) {
			if (!media.image && !media.video) throw new TypeError(`album[i] must have image or video property`);
		}
		if (album.length < 2) throw new RangeError("Minimum 2 media");
		const medias = await generateWAMessageFromContent(jid, {
			albumMessage: {
				expectedImageCount: album.filter(m => m.image).length,
				expectedVideoCount: album.filter(m => m.video).length,
			}
		}, { quoted: options?.quoted || null, userJid: RAEHAN2GD.user.id }); // DITAMBAHKAN
		await RAEHAN2GD.relayMessage(jid, medias.message, { messageId: medias.key.id });
		for (const media of album) {
			const msg = await generateWAMessage(jid, { ...others, ...media }, { upload: RAEHAN2GD.waUploadToServer });
			msg.message.messageContextInfo = {
				messageAssociation: {
					associationType: 1,
					parentMessageKey: medias.key
				}
			}
			await RAEHAN2GD.relayMessage(jid, msg.message, { messageId: msg.key.id });
		}
		return medias;
	}
	
	RAEHAN2GD.sendListMsg = async (jid, content = {}, options = {}) => {
		const { text, caption, footer = '', title, subtitle, ai, contextInfo = {}, buttons = [], messageParamsJson = {}, mentions = [], ...media } = content;
		// DITAMBAHKAN userJid UNTUK FIX ERROR JADIBOT
		const msg = await generateWAMessageFromContent(jid, {
			viewOnceMessage: {
				message: {
					messageContextInfo: {
						deviceListMetadata: {},
						deviceListMetadataVersion: 2,
					},
					interactiveMessage: proto.Message.InteractiveMessage.create({
						body: proto.Message.InteractiveMessage.Body.create({ text: text || caption || '' }),
						footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }),
						header: proto.Message.InteractiveMessage.Header.create({
							title,
							subtitle,
							hasMediaAttachment: Object.keys(media).length > 0,
							...(media && typeof media === 'object' && Object.keys(media).length > 0 ? await generateWAMessageContent(media, {
								upload: RAEHAN2GD.waUploadToServer
							}) : {})
						}),
						nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
							...(messageParamsJson && typeof messageParamsJson === 'object' && Object.keys(messageParamsJson).length > 0 ? messageParamsJson : {}),
							buttons: buttons.map(a => {
								return {
									name: a.name,
									buttonParamsJson: JSON.stringify(a.buttonParamsJson ? (typeof a.buttonParamsJson === 'string' ? JSON.parse(a.buttonParamsJson) : a.buttonParamsJson) : '')
								}
							})
						}),
						contextInfo: {
							...contextInfo,
							...options.contextInfo,
							mentionedJid: options.mentions || mentions,
							...(options.quoted ? {
								stanzaId: options.quoted.key.id,
								remoteJid: options.quoted.key.remoteJid,
								participant: options.quoted.key.participant || options.quoted.key.remoteJid,
								fromMe: options.quoted.key.fromMe,
								quotedMessage: options.quoted.message
							} : {})
						}
					})
				}
			}
		}, { userJid: RAEHAN2GD.user.id }); // <=== FIX UTAMA DISINI
		const hasil = await RAEHAN2GD.relayMessage(msg.key.remoteJid, msg.message, {
			messageId: msg.key.id,
			additionalNodes: [{
				tag: 'biz',
				attrs: {},
				content: [{
					tag: 'interactive',
					attrs: {
						type: 'native_flow',
						v: '1'
					},
					content: [{
						tag: 'native_flow',
						attrs: {
							v: '9',
							name: 'mixed'
						}
					}]
				}]
			}, ...(ai ? [{ attrs: { biz_bot: '1' }, tag: 'hanz' }] : [])]
		})
		return hasil
	}
	
	RAEHAN2GD.sendButtonMsg = async (jid, content = {}, options = {}) => {
		const { text, caption, footer = '', headerType = 1, ai, contextInfo = {}, buttons = [], mentions = [], ...media } = content;
		// DITAMBAHKAN userJid UNTUK FIX ERROR JADIBOT
		const msg = await generateWAMessageFromContent(jid, {
			viewOnceMessage: {
				message: {
					messageContextInfo: {
						deviceListMetadata: {},
						deviceListMetadataVersion: 2,
					},
					buttonsMessage: {
						...(media && typeof media === 'object' && Object.keys(media).length > 0 ? await generateWAMessageContent(media, {
							upload: RAEHAN2GD.waUploadToServer
						}) : {}),
						contentText: text || caption || '',
						footerText: footer,
						buttons,
						headerType: media && Object.keys(media).length > 0 ? Math.max(...Object.keys(media).map((a) => ({ document: 3, image: 4, video: 5, location: 6 })[a] || headerType)) : headerType,
						contextInfo: {
							...contextInfo,
							...options.contextInfo,
							mentionedJid: options.mentions || mentions,
							...(options.quoted ? {
								stanzaId: options.quoted.key.id,
								remoteJid: options.quoted.key.remoteJid,
								participant: options.quoted.key.participant || options.quoted.key.remoteJid,
								fromMe: options.quoted.key.fromMe,
								quotedMessage: options.quoted.message
							} : {})
						}
					}
				}
			}
		}, { userJid: RAEHAN2GD.user.id }); // <=== FIX UTAMA DISINI
		const hasil = await RAEHAN2GD.relayMessage(msg.key.remoteJid, msg.message, {
			messageId: msg.key.id,
			additionalNodes: [{
				tag: 'biz',
				attrs: {},
				content: [{
					tag: 'interactive',
					attrs: {
						type: 'native_flow',
						v: '1'
					},
					content: [{
						tag: 'native_flow',
						attrs: {
							v: '9',
							name: 'mixed'
						}
					}]
				}]
			}, ...(ai ? [{ attrs: { biz_bot: '1' }, tag: 'hanz' }] : [])]
		})
		return hasil
	}
	
	RAEHAN2GD.newsletterMsg = async (key, content = {}, timeout = 5000) => {
		const { type: rawType = 'INFO', name, description = '', picture = null, react, id, newsletter_id = key, ...media } = content;
		const type = rawType.toUpperCase();
		if (react) {
			if (!(newsletter_id.endsWith('@newsletter') || !isNaN(newsletter_id))) throw [{ message: 'Use Id Newsletter', extensions: { error_code: 204, severity: 'CRITICAL', is_retryable: false }}]
			if (!id) throw [{ message: 'Use Id Newsletter Message', extensions: { error_code: 204, severity: 'CRITICAL', is_retryable: false }}]
			const hasil = await RAEHAN2GD.query({
				tag: 'message',
				attrs: {
					to: key,
					type: 'reaction',
					'server_id': id,
					id: generateMessageID()
				},
				content: [{
					tag: 'reaction',
					attrs: {
						code: react
					}
				}]
			});
			return hasil
		} else if (media && typeof media === 'object' && Object.keys(media).length > 0) {
			const msg = await generateWAMessageContent(media, { upload: RAEHAN2GD.waUploadToServer });
			const anu = await RAEHAN2GD.query({
				tag: 'message',
				attrs: { to: newsletter_id, type: 'text' in media ? 'text' : 'media' },
				content: [{
					tag: 'plaintext',
					attrs: /image|video|audio|sticker|poll/.test(Object.keys(media).join('|')) ? { mediatype: Object.keys(media).find(key => ['image', 'video', 'audio', 'sticker','poll'].includes(key)) || null } : {},
					content: proto.Message.encode(msg).finish()
				}]
			})
			return anu
		} else {
			if ((/(FOLLOW|UNFOLLOW|DELETE)/.test(type)) && !(newsletter_id.endsWith('@newsletter') || !isNaN(newsletter_id))) return [{ message: 'Use Id Newsletter', extensions: { error_code: 204, severity: 'CRITICAL', is_retryable: false }}]
			const _query = await RAEHAN2GD.query({
				tag: 'iq',
				attrs: {
					to: 's.whatsapp.net',
					type: 'get',
					xmlns: 'w:mex'
				},
				content: [{
					tag: 'query',
					attrs: {
						query_id: type == 'FOLLOW' ? '9926858900719341' : type == 'UNFOLLOW' ? '7238632346214362' : type == 'CREATE' ? '6234210096708695' : type == 'DELETE' ? '8316537688363079' : '6563316087068696'
					},
					content: new TextEncoder().encode(JSON.stringify({
						variables: /(FOLLOW|UNFOLLOW|DELETE)/.test(type) ? { newsletter_id } : type == 'CREATE' ? { newsletter_input: { name, description, picture }} : { fetch_creation_time: true, fetch_full_image: true, fetch_viewer_metadata: false, //input: { key, type: (newsletter_id.endsWith('@newsletter') || !isNaN(newsletter_id)) ? 'JID' : 'INVITE' }
						}
					}))
				}]
			},timeout);
			const res = JSON.parse(_query.content[0].content)?.data?.xwa2_newsletter || JSON.parse(_query.content[0].content)?.data?.xwa2_newsletter_join_v2 || JSON.parse(_query.content[0].content)?.data?.xwa2_newsletter_leave_v2 || JSON.parse(_query.content[0].content)?.data?.xwa2_newsletter_create || JSON.parse(_query.content[0].content)?.data?.xwa2_newsletter_delete_v2 || JSON.parse(_query.content[0].content)?.errors || JSON.parse(_query.content[0].content)
			res.thread_metadata ? (res.thread_metadata.host = 'https://mmg.whatsapp.net') : null
			return res
		}
	}
	
	RAEHAN2GD.sendCarouselMsg = async (jid, body = '', footer = '', cards = [], options = {}) => {
		async function getImageMsg(url) {
			const { imageMessage } = await generateWAMessageContent({ image: { url } }, { upload: RAEHAN2GD.waUploadToServer });
			return imageMessage;
		}
		const cardPromises = cards.map(async (a) => {
			const imageMessage = await getImageMsg(a.url);
			return {
				header: {
					imageMessage: imageMessage,
					hasMediaAttachment: true
				},
				body: { text: a.body },
				footer: { text: a.footer },
				nativeFlowMessage: {
					buttons: a.buttons.map(b => ({
						name: b.name,
						buttonParamsJson: JSON.stringify(b.buttonParamsJson ? JSON.parse(b.buttonParamsJson) : '')
					}))
				}
			};
		});
		
		const cardResults = await Promise.all(cardPromises);
		// DITAMBAHKAN userJid UNTUK FIX ERROR JADIBOT
		const msg = await generateWAMessageFromContent(jid, {
			viewOnceMessage: {
				message: {
					messageContextInfo: {
						deviceListMetadata: {},
						deviceListMetadataVersion: 2
					},
					interactiveMessage: proto.Message.InteractiveMessage.create({
						body: proto.Message.InteractiveMessage.Body.create({ text: body }),
						footer: proto.Message.InteractiveMessage.Footer.create({ text: footer }),
						carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.create({
							cards: cardResults,
							messageVersion: 1
						})
					})
				}
			}
		}, { userJid: RAEHAN2GD.user.id }); // <=== FIX UTAMA DISINI
		const hasil = await RAEHAN2GD.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
		return hasil
	}

	RAEHAN2GD.sendMessageV3 = async (jid, content = {}, options = {}) => {
		const { text, title = '', description = '', thumbnailUrl, sourceUrl, contextInfo = {}, mentions = [] } = content;
		if (thumbnailUrl && text) {
			let compressedMedia;
			let meta = { width: 1024, height: 576 };
			try {
				const image = await Jimp.read(thumbnailUrl);
				meta.width = image.bitmap.width;
				meta.height = image.bitmap.height;
				compressedMedia = await image.quality(90).getBufferAsync(Jimp.MIME_JPEG);
			} catch (error) {
				compressedMedia = { url: thumbnailUrl };
			}
			const { imageMessage: img } = await prepareWAMessageMedia({ image: compressedMedia }, { upload: RAEHAN2GD.waUploadToServer, mediaTypeOverride: 'thumbnail-link' });
			const linkUrl = sourceUrl || thumbnailUrl;
			const customContextInfo = {
				...contextInfo, ...options.contextInfo,
				mentionedJid: options.mentions || mentions,
				...(options.quoted ? {
					stanzaId: options.quoted.key.id,
					remoteJid: options.quoted.key.remoteJid,
					participant: options.quoted.key.participant || options.quoted.key.remoteJid,
					fromMe: options.quoted.key.fromMe,
					quotedMessage: options.quoted.message
				} : {})
			};
			const payloadMessage = {
				extendedTextMessage: {
					text: `${linkUrl}\n\n${text}`.trim(),
					matchedText: linkUrl,
					title, description, previewType: 0,
					renderLargerThumbnail: true,
					jpegThumbnail: img.jpegThumbnail,
					thumbnailDirectPath: img.directPath,
					thumbnailSha256: img.fileSha256,
					thumbnailEncSha256: img.fileEncSha256,
					mediaKey: img.mediaKey,
					mediaKeyTimestamp: img.mediaKeyTimestamp,
					thumbnailHeight: meta.height,
					thumbnailWidth: meta.width,
					contextInfo: customContextInfo
				}
			};
			const hasil = await RAEHAN2GD.relayMessage(jid, payloadMessage, { messageId: generateMessageID() });
			return hasil;
		} else {
			return await RAEHAN2GD.sendMessage(jid, content, options);
		}
	}
	
 RAEHAN2GD.public = true

}


async function Serialize(RAEHAN2GD, msg, store) {
	const botLid = RAEHAN2GD.decodeJid(RAEHAN2GD.user.lid);
	const botNumber = RAEHAN2GD.decodeJid(RAEHAN2GD.user.id);
	const m = { ...msg };
	if (!m) return m
	if (m.key) {
		m.id = m.key.id
		m.chat = m.key.remoteJidAlt || m.key.remoteJid
		m.fromMe = m.key.fromMe
		m.isBot = ['HSK', 'BAE', 'B1E', '3EB0', 'B24E', 'WA'].some(a => m.id.startsWith(a) && [12, 16, 20, 22, 40].includes(m.id.length)) || /(.)\1{5,}|[^a-zA-Z0-9]|[^0-9A-F]/.test(m.id) || false
		m.isGroup = m.chat.endsWith('@g.us')
		if (!m.isGroup && m.chat.endsWith('@lid')) m.chat = RAEHAN2GD.findJidByLid(m.chat, store) || m.chat;
		m.sender = RAEHAN2GD.decodeJid(m.fromMe && RAEHAN2GD.user.id || m.key.participantAlt || m.key.participant || m.chat || '')
		if (m.isGroup) {
			if (!store.groupMetadata) store.groupMetadata = await RAEHAN2GD.groupFetchAllParticipating().catch(e => ({}));
			let metadata = store.groupMetadata[m.chat] ? store.groupMetadata[m.chat] : (store.groupMetadata[m.chat] = await RAEHAN2GD.groupMetadata(m.chat).catch(e => ({ ...store.groupMetadata[m.chat] })));
			if (!metadata) {
				metadata = await RAEHAN2GD.groupMetadata(m.chat).catch(e => ({ ...store.groupMetadata[m.chat] }));
				store.groupMetadata[m.chat] = metadata
			}
			m.metadata = metadata
			m.metadata.size = (metadata.participants || []).length;
			if (metadata.addressingMode === 'lid') {
				const participant = metadata.participants.find(a => a.id === m.sender || a.phoneNumber === m.sender)
				m.sender = participant?.phoneNumber || m.key.participantAlt || m.sender;
				m.metadata.owner = m.metadata?.participants?.find(p => p.id === m.metadata.owner)?.id || m.metadata.owner;
				m.metadata.subjectOwner = m.metadata?.participants?.find(p => p.id === m.metadata.subjectOwner)?.id || m.metadata.subjectOwner;
				if(!m.sender.endsWith('@g.us')) store.contacts[m.sender] = { ...(store.contacts[m.sender] || {}), id: jidNormalizedUser(m.fromMe && RAEHAN2GD.user.lid || participant?.id || store.contacts[m.sender]?.id || m.sender), phoneNumber: jidNormalizedUser(m.fromMe && RAEHAN2GD.user.id || participant?.phoneNumber || store.contacts[m.sender]?.phoneNumber || m.sender), name: (m.fromMe && RAEHAN2GD.user.name) || m.pushName };
			}
			m.admins = m.metadata.participants ? m.metadata.participants.filter(p => p.admin).map(p => ({ id: p.id, phoneNumber: p.phoneNumber, admin: p.admin })) : [];
			m.isAdmin = m.admins.some(a => a.id === m.sender || a.phoneNumber === m.sender);
			m.isBotAdmin = m.admins.some(a => [botNumber, botLid].includes(a.id) || [botNumber, botLid].includes(a.phoneNumber));
		}
		if (m.key.addressingMode === 'lid') {
			if(!m.sender.endsWith('@g.us')) store.contacts[m.sender] = {
				...(store.contacts[m.sender] || {}),
				id: jidNormalizedUser(m.fromMe && RAEHAN2GD.user.lid || store.contacts[m.sender]?.id || m.key.remoteJid),
				phoneNumber: jidNormalizedUser(m.fromMe && RAEHAN2GD.user.id || store.contacts[m.sender]?.phoneNumber || m.sender),
				name: (m.fromMe && RAEHAN2GD.user.name) || m.pushName
			}
		}
	}
	if (m.message) {
		m.type = getContentType(m.message) || Object.keys(m.message)[0]
		let inner = m.message[m.type];
		m.msg = inner?.message ? inner.message[getContentType(inner.message) || Object.keys(inner.message)[0]] : (inner?.editedMessage ? inner.editedMessage : (extractMessageContent(inner) || inner));
		m.body = m.message?.conversation || m.msg?.text || m.msg?.conversation || m.msg?.caption || m.msg?.selectedButtonId || m.msg?.singleSelectReply?.selectedRowId || m.msg?.selectedId || (m.type === 'interactiveResponseMessage' && m.message.interactiveResponseMessage?.nativeFlowResponseMessage ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson || '{}')?.id : '') || (m.type === 'editedMessage' || m.type === 'protocolMessage' ? (m.message[m.type]?.editedMessage?.extendedTextMessage?.text || m.message[m.type]?.editedMessage?.conversation || '') : '') || m.msg?.contentText || m.msg?.title || m.msg?.name || '';
		m.mentionedJid = m.msg?.contextInfo?.mentionedJid?.map(a => RAEHAN2GD.findJidByLid(a, store, true)) || []
		m.text = m.msg?.text || m.msg?.caption || m.message?.conversation || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || '';
		m.prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(m.body) ? m.body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : /[\uD800-\uDBFF][\uDC00-\uDFFF]/gi.test(m.body) ? m.body.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/gi)[0] : ''
		m.command = m.body && m.body.replace(m.prefix, '').trim().split(/ +/).shift()
		m.args = m.body?.trim().replace(new RegExp("^" + m.prefix?.replace(/[.*=+:\-?^${}()|[\]\\]|\s/g, '\\$&'), 'i'), '').replace(m.command, '').split(/ +/).filter(a => a) || []
		m.device = getDevice(m.id)
		m.expiration = m.msg?.contextInfo?.expiration || m?.metadata?.ephemeralDuration || store?.messages?.[m.chat]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0
		m.timestamp = (typeof m.messageTimestamp === "number" ? m.messageTimestamp : m.messageTimestamp.low ? m.messageTimestamp.low : m.messageTimestamp.high) || m.msg.timestampMs * 1000
		m.isMedia = !!m.msg?.mimetype || !!m.msg?.thumbnailDirectPath
		if (m.isMedia) {
			m.mime = m.msg?.mimetype
			m.size = m.msg?.fileLength
			m.height = m.msg?.height || ''
			m.width = m.msg?.width || ''
			if (/webp/i.test(m.mime)) {
				m.isAnimated = m.msg?.isAnimated
			}
		}
		m.quoted = m.msg?.contextInfo?.quotedMessage || null
		if (m.quoted) {
			let qMsg = JSON.parse(JSON.stringify(m.msg?.contextInfo?.quotedMessage));
			if (m.msg?.contextInfo?.participant?.endsWith('@lid')) m.msg.contextInfo.participant =  m?.metadata?.participants?.find(a => a.id === m.msg.contextInfo.participant)?.phoneNumber || m.msg.contextInfo.participant;
			m.quoted = {
				...qMsg,
				message: extractMessageContent(qMsg) || qMsg,
				type: getContentType(qMsg) || Object.keys(qMsg)[0],
				id: m.msg.contextInfo.stanzaId,
				chat: m.msg.contextInfo.remoteJid || m.chat,
				sender: RAEHAN2GD.decodeJid(m.msg.contextInfo.participant),
				fromMe: RAEHAN2GD.decodeJid(m.msg.contextInfo.participant) === RAEHAN2GD.decodeJid(RAEHAN2GD.user.id),
				text: qMsg?.conversation || qMsg?.caption || '',
			};
			m.quoted.msg = extractMessageContent(qMsg[m.quoted.type]) || qMsg[m.quoted.type];
			m.quoted.device = getDevice(m.quoted.id)
			m.quoted.isBot = m.quoted.id ? ['HSK', 'BAE', 'B1E', '3EB0', 'B24E', 'WA'].some(a => m.quoted.id.startsWith(a) && [12, 16, 20, 22, 40].includes(m.quoted.id.length)) || /(.)\1{5,}|[^a-zA-Z0-9]|[^0-9A-F]/.test(m.quoted.id) : false
			m.quoted.fromMe = m.quoted.sender === RAEHAN2GD.decodeJid(RAEHAN2GD.user.id)
			m.quoted.mentionedJid = m.quoted?.msg?.contextInfo?.mentionedJid?.map(a => RAEHAN2GD.findJidByLid(a, store, true)) || []
			m.quoted.body = m.quoted.message?.conversation || m.quoted.msg?.text || m.quoted.msg?.conversation || m.quoted.msg?.caption || m.quoted.msg?.selectedButtonId || m.quoted.msg?.singleSelectReply?.selectedRowId || m.quoted.msg?.selectedId || (m.quoted.type === 'interactiveResponseMessage' && m.quoted.message?.interactiveResponseMessage?.nativeFlowResponseMessage ? JSON.parse(m.quoted.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson || '{}')?.id : '') || (m.quoted.type === 'editedMessage' || m.quoted.type === 'protocolMessage' ? (m.quoted.message[m.quoted.type]?.editedMessage?.extendedTextMessage?.text || m.quoted.message[m.quoted.type]?.editedMessage?.conversation || '') : '') || m.quoted.msg?.contentText || m.quoted.msg?.title || m.quoted.msg?.name || '';
			m.getQuotedObj = async () => {
				if (!m.quoted.id) return null
				let q = await global.loadMessage(m.chat, m.quoted.id, RAEHAN2GD)
				if (q) {
					return await Serialize(RAEHAN2GD, q, store)
				} else {
					return null
				}
			}
			m.quoted.key = {
				remoteJid: m.msg?.contextInfo?.remoteJid || m.chat,
				participant: m.quoted.sender,
				fromMe: areJidsSameUser(RAEHAN2GD.decodeJid(m.msg?.contextInfo?.participant), RAEHAN2GD.decodeJid(RAEHAN2GD?.user?.id)),
				id: m.msg?.contextInfo?.stanzaId
			}
			m.quoted.isGroup = m.quoted.chat.endsWith('@g.us')
			m.quoted.mentions = m.quoted.msg?.contextInfo?.mentionedJid || []
			m.quoted.prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(m.quoted.body) ? m.quoted.body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] : /[\uD800-\uDBFF][\uDC00-\uDFFF]/gi.test(m.quoted.body) ? m.quoted.body.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/gi)[0] : ''
			m.quoted.command = m.quoted.body && m.quoted.body.replace(m.quoted.prefix, '').trim().split(/ +/).shift()
			m.quoted.isMedia = !!m.quoted.msg?.mimetype || !!m.quoted.msg?.thumbnailDirectPath
			if (m.quoted.isMedia) {
				m.quoted.fileSha256 = m.quoted[m.quoted.type]?.fileSha256 || ''
				m.quoted.mime = m.quoted.msg?.mimetype
				m.quoted.size = m.quoted.msg?.fileLength
				m.quoted.height = m.quoted.msg?.height || ''
				m.quoted.width = m.quoted.msg?.width || ''
				if (/webp/i.test(m.quoted.mime)) {
					m.quoted.isAnimated = m?.quoted?.msg?.isAnimated || false
				}
			}
			m.quoted.fakeObj = () => ({
				key: {
					remoteJid: m.quoted.chat,
					fromMe: m.quoted.fromMe,
					id: m.quoted.id
				},
				message: m.quoted,
				...(m.isGroup ? { participant: m.quoted.sender } : {})
			});
			m.quoted.download = () => RAEHAN2GD.downloadMediaMessage(m.quoted)
			m.quoted.delete = () => {
				RAEHAN2GD.sendMessage(m.quoted.chat, {
					delete: {
						remoteJid: m.quoted.chat,
						fromMe: m.isBotAdmin ? false : true,
						id: m.quoted.id,
						participant: m.quoted.sender
					}
				})
			}
		}
	}
	
	m.download = () => RAEHAN2GD.downloadMediaMessage(m)
	
	m.copy = () => Serialize(RAEHAN2GD, JSON.parse(JSON.stringify(m)), store)
	
	m.react = (u) => RAEHAN2GD.sendMessage(m.chat, { react: { text: u, key: m.key }})
	
	m.reply = async (content, options = {}) => {
		const { quoted = m, chat = m.chat, caption = '', mentions = [], ephemeralExpiration = m.expiration || m?.metadata?.ephemeralDuration || store?.messages[m.chat]?.array?.slice(-1)[0]?.metadata?.ephemeralDuration || 0, ...validate } = options;
		const textBody = typeof content === 'string' ? content : (content.text || content.caption || '');
		const providedMentions = Array.isArray(mentions) ? mentions : [];
		const extractedMentions = [...textBody.matchAll(/@(\d{5,16})/g)].map(v => v[1] + '@s.whatsapp.net');
		const fixMentions = [...new Set([...providedMentions, ...extractedMentions])];
		if (typeof content === 'object') {
			return RAEHAN2GD.sendMessage(chat, content, { ...validate, quoted, ephemeralExpiration })
		} else if (typeof content === 'string') {
			try {
				if (/^https?:\/\//.test(content)) {
					const res = await axios.head(content).catch(() => null);
					const mime = res?.headers['content-type'] || '';
					if (/gif|image|video|audio|pdf|stream/i.test(mime)) {
						let type = /image/.test(mime) ? 'image' : /video/.test(mime) ? 'video' : /audio/.test(mime) ? 'audio' : 'document';
						return RAEHAN2GD.sendMessage(chat, { [type]: { url: content }, caption, mimetype: mime, ...validate }, { quoted, ephemeralExpiration })
					} else {
						return RAEHAN2GD.sendMessage(chat, { text: content, mentions: fixMentions, ...validate }, { quoted, ephemeralExpiration })
					}
				} else {
					return RAEHAN2GD.sendMessage(chat, { text: content, mentions: fixMentions, ...validate }, { quoted, ephemeralExpiration })
				}
			} catch (e) {
				return RAEHAN2GD.sendMessage(chat, { text: content, mentions: fixMentions, ...validate }, { quoted, ephemeralExpiration })
			}
		}
	}

	return m
}

export {
	GroupUpdate,
	GroupParticipantsUpdate,
	LoadDataBase,
	MessagesUpsert,
	Solving
};

const watcher = chokidar.watch(RAEHAN2GDPath, {
	ignored: /^\./,
	persistent: true,
});

watcher.on('change', async (filePath) => {
	console.log(chalk.yellowBright(`[UPDATE] ${filePath}`));
	await reloadHandler();
});