//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
import './HAN_SETTINGS.js';
import fs from 'fs';
import os from 'os';
import util from 'util';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import yts from 'yt-search';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import webp from 'node-webpmux';
import { createRequire } from 'module';
import speed from 'performance-now';
import moment from 'moment-timezone';
import { performance } from 'perf_hooks';
import { parsePhoneNumber } from 'awesome-phonenumber';
import { exec, spawn, execSync } from 'child_process';
import { generateWAMessageContent, jidNormalizedUser, getContentType } from 'baileys';
import { JadiBot, StopJadiBot, ListJadiBot } from './src/jadibot.js';
import 'moment/min/locales.js';
import { UguuSe } from './HANZ-DATA/uploader.js';
import { toAudio, toPTT } from './HANZ-DATA/converter.js';
import { GroupUpdate, LoadDataBase } from './src/message.js';
import { getRandom, getBuffer, fetchJson, runtime, clockString, sleep, isUrl, formatDate, formatp, generateProfilePicture, errorCache, normalize, runUpdate, updateSettings, parseMention, fixBytes, similarity, pickRandom, encodeToLetters, tarBackup } from './HANZ-DATA/function.js';
//////////////////////////////////     HANZ    ////////////////////////////////////
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//////////////////////////////////     HANZ    ////////////////////////////////////
const locales = moment.locales();
const timez = moment.tz.names();
const menfesTimeouts = new Map();
const settingsPath = path.join(__dirname, 'HAN_SETTINGS.js');
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
const fileContent = fs.readFileSync(__filename, 'utf-8');
const casesArray = [...fileContent.matchAll(/case\s+['"]([^'"]+)['"]/g)].map(match => match[1]);
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
const RAEHAN2GD = async (RAEHAN2GD, m, msg, store) => {
//////////////////////////////////     HANZ    ////////////////////////////////////
	if (!global.db) global.db = {};
	global.db.cases = global.db.cases || casesArray;
	const cases = global.db.cases;
	await LoadDataBase(RAEHAN2GD, m);
//////////////////////////////////     HANZ    ////////////////////////////////////
	const botNumber = RAEHAN2GD.decodeJid(RAEHAN2GD.user.id);
	const set = db.set[botNumber];
	const ownerNumber = set.owner = [...new Set([...global.owner, botNumber.split('@')[0], ...set?.owner || []])];
//////////////////////////////////     HANZ    ////////////////////////////////////

		try {
		await GroupUpdate(RAEHAN2GD, m, store);
		const body = ((m.type === 'conversation') ? m.message.conversation :
		(m.type == 'imageMessage') ? m.message.imageMessage.caption :
		(m.type == 'videoMessage') ? m.message.videoMessage.caption :
		(m.type == 'extendedTextMessage') ? m.message.extendedTextMessage.text :
		(m.type == 'reactionMessage') ? m.message.reactionMessage.text :
		(m.type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId :
		(m.type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
		(m.type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId :
		(m.type == 'interactiveResponseMessage'  && m.quoted) ? (m.message.interactiveResponseMessage?.nativeFlowResponseMessage ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id : '') :
		(m.type == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || '') :
		(m.type == 'editedMessage') ? (m.message.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || m.message.editedMessage?.message?.protocolMessage?.editedMessage?.conversation || '') :
		(m.type == 'protocolMessage') ? (m.message.protocolMessage?.editedMessage?.extendedTextMessage?.text || m.message.protocolMessage?.editedMessage?.conversation || m.message.protocolMessage?.editedMessage?.imageMessage?.caption || m.message.protocolMessage?.editedMessage?.videoMessage?.caption || '') : '') || '';
//////////////////////////////////     HANZ    ////////////////////////////////////
		const budy = (typeof m.text == 'string' ? m.text : '');
		const isCreator = global.isOwner = ownerNumber.some(owner => {
			const ownerJid = owner.includes('@') ? owner : owner + '@s.whatsapp.net';
			const findJid = RAEHAN2GD.findJidByLid(jidNormalizedUser(ownerJid), store, true);
			if (!findJid) return false;
			return findJid === m.sender;
		});
		
//////////////////////////////////     HANZ    ////////////////////////////////////	
		
		const symbolMatch = body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@()#,'"*+÷/\%^&.©^]/gi);
		const emojiMatch = body.match(/^[\uD800-\uDBFF][\uDC00-\uDFFF]/gi); 
		const listMatch = global.listprefix.find(a => body?.startsWith(a));
		const detectedPrefix = symbolMatch ? symbolMatch[0] : (emojiMatch ? emojiMatch[0] : listMatch);
		const prefix = isCreator ? (detectedPrefix || set.authorPrefix) : set.multiprefix ? (detectedPrefix || '¿') : (listMatch || '¿');
		const isCmd = body.startsWith(prefix);
		const args = body.trim().split(/ +/).slice(1);
		const quoted = m.quoted ? m.quoted : m;
		const command = isCmd ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : '';
		const text = global.q = args.join(' ');
		const mime = (quoted.msg || quoted).mimetype || '';
		const qmsg = (quoted.msg || quoted);
//////////////////////////////////     HANZ    ////////////////////////////////////	
		const author = set.author = global.author || 'MATAMU';
		const packname = set.packname = global.packname || 'UMAT DANCOK';
		const botname = set.botname = global.botname || 'HANZ';
//////////////////////////////////     HANZ    ////////////////////////////////////
		const locale_day = moment.tz(global.timezone).locale(global.locale).format('dddd');
		const date = moment.tz(global.timezone).locale(global.locale).format('DD/MM/YYYY');
		const date_time = moment.tz(global.timezone).locale(global.locale).format('HH:mm:ss');
//////////////////////////////////     HANZ    ////////////////////////////////////
		const time = Date.now();
		const time_now = new Date();
		const setv = pickRandom(global.listv);
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////



// ==================== 𝘽𝘼𝙏𝘼𝙎 ===================




		

		
		
// ==================== 𝘾𝙀𝙉𝙏𝘼𝙉𝙂 𝘽𝙄𝙍𝙐 ===================
		const fkontak = {
			key: {
				remoteJid: '0@s.whatsapp.net',
				participant: '0@s.whatsapp.net',
				fromMe: false,
				id: 'HANZ'
			},
			message: {
				contactMessage: {
					displayName: (m.pushName || author),
					vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${m.pushName || author},;;;\nFN:${m.pushName || author}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
					sendEphemeral: true
				}
			}
		};
		
		
		
		
		
// ==================== 𝙁𝘼𝙆𝙀 𝙑𝙉 ===================

// Fungsi untuk mengacak array bawaan Anda
const getShuffledWaveform = () => {
    const baseWaveform = [10, 20, 100, 100, 80, 100, 90, 70, 50, 30, 10, 30, 60, 90, 70, 40, 20, 10, 40, 80, 100, 80, 40, 20];
    for (let i = baseWaveform.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baseWaveform[i], baseWaveform[j]] = [baseWaveform[j], baseWaveform[i]]; // Tukar posisi
    }
    return new Uint8Array(baseWaveform);
};
// Fungsi untuk membuat gelombang 100% acak dan natural
const getRandomWaveform = () => {
    const length = Math.floor(Math.random() * 30) + 20; // Panjang gelombang acak antara 20 - 50
    const waveform = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        waveform[i] = Math.floor(Math.random() * 100); // Tinggi gelombang acak 0 - 100
    }
    return waveform;
};



		
// ==================== 𝙇𝙊𝙂 CHAT ===================
// Buat tempat penyimpanan log di memori (bukan file)
if (!global.logChatData) global.logChatData = []; 

const logContent = `[CHAT: ${budy || m.type}] | FROM: ${m.sender.split('@')[0]} | TO: ${m.chat}`;
global.logChatData.push(logContent);

// Batasi riwayat log maksimal 100 pesan terakhir agar chat WA tidak ngelag saat dipanggil
if (global.logChatData.length > 200) {
    global.logChatData.shift(); 
}

// ==================== 𝙇𝙊𝙂 𝙏𝙀𝙍𝙈𝙄𝙉𝘼𝙇 ===================

		{
			console.log(chalk.black(chalk.whiteBright('[CHAT]:'), chalk.greenBright(`${locale_day} ${date} (${date_time})`), chalk.hex('#AF26EB')(m.key.id) + '\n' + chalk.hex('#00EAD3')(budy || m.type) + '\n' + chalk.cyanBright('[FROM]:'), chalk.yellowBright(m.pushName || (isCreator ? 'Bot' : 'Anonim')), chalk.hex('#FF449F')(m.sender.split('@')[0]), chalk.hex('#FF5700')(m.isGroup ? m.metadata?.subject || 'Group' : m.chat.endsWith('@newsletter') ? 'Newsletter' : 'Private Chat'), chalk.blueBright('(' + m.chat + ')')));
			} //else {console.log(chalk.black(chalk.bgWhite('[CHAT]:'), chalk.bgGreen(`${locale_day} ${date} (${date_time})`), chalk.bgHex('#AF26EB')(m.key.id) + '\n' + chalk.bgHex('#00EAD3')(budy || m.type) + '\n' + chalk.bgCyanBright('[FROM]:'), chalk.bgYellow(m.pushName || (isCreator ? 'Bot' : 'Anonim')), chalk.bgHex('#FF449F')(m.sender), chalk.bgHex('#FF5700')(m.isGroup ? m.metadata?.subject || 'Group' : m.chat.endsWith('@newsletter') ? 'Newsletter' : 'Private Chat'), chalk.bgBlue('(' + m.chat + ')')));
		//}
		
		
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////

// ==================== 𝙊𝙁𝙁𝙇𝙄𝙉𝙀 ===================
{ RAEHAN2GD.sendPresenceUpdate('unavailable');}





// ==================== 𝘼𝙐𝙏𝙊 𝙍𝙀𝘾𝙊𝙍𝘿𝙄𝙉𝙂 ==================

if (!global.recentChats) global.recentChats = [];
//▬▭▬▭▬▭▬▭▬▬▭▬▭▬▭▬▭▬▭▬▭▬▬▭▬▭

 { global.recentChats = global.recentChats.filter(jid => jid !== m.chat);
   global.recentChats.unshift(m.chat);
//▬▭▬▭▬▭▬▭▬▬▭▬▭▬▭▬▭▬▭▬▭▬▬▭▬▭
              ////// BATAS CHAT ///////
//▬▭▬▭▬▭▬▭▬▬▭▬▭▬▭▬▭▬▭▬▭▬▬▭▬▭
    if (global.recentChats.length > 50) {   global.recentChats.pop(); }
    for (let jid of global.recentChats) { await RAEHAN2GD.sendPresenceUpdate('recording', jid);}}    
    
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////




// ==================== 𝙇𝙊𝘼𝘿𝙄𝙉𝙂 ===================
		
const sendLoading = async (chatId, m) => {
let { key } = await RAEHAN2GD.sendMessage(chatId, { text: 'LOADING SCRIPT RAEHAN', mentions: [m.sender] },  { quoted: fkontak });
			const loadingAnimation = [
				
"『 ⎔ 𝙻𝚘𝚊𝚍𝚒𝚗𝚐... 』\n*[■□□□□□□□□□] 𝟷𝟶٪*",
"『 ⎔ 𝙻𝚘𝚊𝚍𝚒𝚗𝚐... 』\n*[■■□□□□□□□□] 𝟸𝟶٪*",				
"『 ⎔ 𝙻𝚘𝚊𝚍𝚒𝚗𝚐... 』\n*[■■■□□□□□□□] 𝟹𝟶٪*",
"『 ⎔ 𝙻𝚘𝚊𝚍𝚒𝚗𝚐... 』\n*[■■■■■□□□□□] 𝟻𝟶٪*",
"『 ⎔ 𝙻𝚘𝚊𝚍𝚒𝚗𝚐... 』\n*[■■■■■■■□□□] 𝟾𝟶٪*",
"『 ⎔ 𝙻𝚘𝚊𝚍𝚒𝚗𝚐... 』\n*[■■■■■■■■□□] 𝟿𝟶٪*",				
"『 ⎔ 𝙻𝚘𝚊𝚍𝚒𝚗𝚐... 』\n*[■■■■■■■■■■] 𝟷𝟶𝟶٪*",
"ʟᴏᴀᴅɪɴɢ sᴜᴄᴄᴇssғᴜʟ . . ."
			];

			// 3. Looping untuk mengedit pesan secara berkala
			for (let i = 0; i < loadingAnimation.length; i++) {
			//	await sleep(0); // Jeda 0.4 detik per perubahan frame
				await RAEHAN2GD.sendMessage(m.chat, { text: loadingAnimation[i], edit: key, mentions: [m.sender] });
			}};
			
			
			
// ==================== 𝙏𝘼𝙉𝙋𝘼 𝙋𝙍𝙀𝙁𝙄𝙓 ===================

		/*if (/^p$/.test(budy?.toLowerCase())) {
    
    await RAEHAN2GD.sendMessage(m.chat, {
        audio: { url: 'https://mp3tourl.com/audio/1785579630645-37b037a1-4ab9-4f27-afe1-a9cc8feb0090.opus' }, 
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true,
        waveform: getRandomWaveform() // Menambahkan garis-garis VN
    });
}*/

//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
		switch(command) {
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////





// ==================== 𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙀𝙍 ===================
case 'setvn': {
    if (!/audio/.test(mime)) return m.reply(`Reply Voice Note atau Audio dengan caption *${prefix + command} <jumlah_detik>*\nContoh: *${prefix + command} 3600*`);
    if (!text || isNaN(text.trim())) return m.reply(`Masukkan jumlah detik berupa angka!\nContoh: *${prefix + command} 3600*`);

    let sec = parseInt(text.trim());
    m.react('⏳');
    // PERBAIKAN: Posisi download media dinaikkan ke atas
    let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
    let audioBuffer = await toPTT(media, 'mp4');
    
    await RAEHAN2GD.sendMessage(m.chat, {
        audio: audioBuffer, 
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true,
        seconds: sec,
        waveform: getRandomWaveform()
    }, { quoted: m });

    if (fs.existsSync(media)) fs.unlinkSync(media);
}
break;

			case 'toaud':{
				if (!/video|audio/.test(mime)) return m.reply(`Kirim/Reply Video/Audio Yang Ingin Dijadikan Audio Dengan Caption ${prefix + command}`);
				m.react('⏳');
				let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
				
				let audio = await toAudio(media, 'mp4');
				await m.reply({ audio: { url: audio }, mimetype: 'audio/mpeg'});
				
				// Proses Penghapusan File
				if (fs.existsSync(audio)) fs.unlinkSync(audio);
				if (fs.existsSync(media)) fs.unlinkSync(media);
			}
			break;
			
			case 'tomp3': {
				if (!/video|audio/.test(mime)) return m.reply(`Kirim/Reply Video/Audio Yang Ingin Dijadikan Audio Dengan Caption ${prefix + command}`);
				m.react('⏳');
				let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
    
    try {
        // Proses konversi dari video ke audio
        let audio = await toAudio(media, 'mp4'); 
        await RAEHAN2GD.sendMessage(m.chat, { 
            audio: audio, 
            mimetype: 'audio/mp4', 
            ptt: false // Ubah true jika untuk case 'tovn'
        }, { quoted: m });
    } finally {
        if (fs.existsSync(media)) fs.unlinkSync(media);
    }
}
break;
			
			case 'tovn': {
				if (!/video|audio/.test(mime)) return m.reply(`Kirim/Reply Video/Audio Yang Ingin Dijadikan Audio Dengan Caption ${prefix + command}`);
				m.react('⏳');
				let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
				
				let audioBuffer = await toPTT(media, 'mp4');
				await RAEHAN2GD.sendMessage(m.chat, { audio: audioBuffer, 
				mimetype: 'audio/ogg; codecs=opus', 
				ptt: true, waveform: getRandomWaveform()});
				
				// Proses Penghapusan File
				if (fs.existsSync(media)) fs.unlinkSync(media);
			}
			break;

			case 'togif': {
				if (!/webp|video/.test(mime)) return m.reply(`Reply Video/Stiker dengan caption *${prefix + command}*`);
				m.react('⏳');
				let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
				// Menggunakan direktori sementara OS (os.tmpdir) bukan folder HANZ-DATA
				let ran = path.join(os.tmpdir(), getRandom('.mp4'));
				
				exec(`ffmpeg -y -i "${media}" -an -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -pix_fmt yuv420p -c:v libx264 -preset veryfast "${ran}"`, async (err) => {
					if (err) {
						if (fs.existsSync(media)) fs.unlinkSync(media); // Hapus jika error
						return m.reply('gagal');
					}
					await m.reply({ video: { url: ran }, gifPlayback: true, caption: ('okey'), gifAttribution: pickRandom(['TENOR','GIPHY']) });
					
					// Proses Penghapusan File
					if (fs.existsSync(media)) fs.unlinkSync(media);
					if (fs.existsSync(ran)) fs.unlinkSync(ran);
				});
			}
			break;

			case 'toimg': {
				if (!/webp|video|image/.test(mime)) return m.reply(`Reply Video/Stiker dengan caption *${prefix + command}*`);
				m.react('⏳');
				let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
				// Menggunakan direktori sementara OS (os.tmpdir) bukan folder HANZ-DATA
				let ran = path.join(os.tmpdir(), getRandom('.png'));
				
				exec(`ffmpeg -y -i "${media}" -vframes 1 "${ran}"`, async (err) => {
					if (err) {
						if (fs.existsSync(media)) fs.unlinkSync(media); // Hapus jika error
						return m.reply(' gagal');
					}
					await m.reply({ image: { url: ran }, caption: "oky"});
					
					// Proses Penghapusan File
					if (fs.existsSync(media)) fs.unlinkSync(media);
					if (fs.existsSync(ran)) fs.unlinkSync(ran);
				});
			}
			break;

			case 'toptv': {
				if (!/video/.test(mime)) return m.reply(`Kirim/Reply Video Yang Ingin Dijadikan PTV Message Dengan Caption ${prefix + command}`);
				if ((m.quoted ? m.quoted.type : m.type) === 'videoMessage') {
					m.react('⏳');
					let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
					
					const message = await generateWAMessageContent({ video: { url: media } }, { upload: RAEHAN2GD.waUploadToServer });
					await RAEHAN2GD.relayMessage(m.chat, { ptvMessage: message.videoMessage }, {});
					
					// Proses Penghapusan File
					if (fs.existsSync(media)) fs.unlinkSync(media);
				} else m.reply('Reply Video Yang Mau Di Ubah Ke PTV Message!');
			}
			break;

			case 'tourl': {
				await sendLoading(m.chat, m);
				if (/webp|video|sticker|audio|jpg|jpeg|png/.test(mime)) {
					m.react('⏳');
					let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
					
					let anu = await UguuSe(media);
					m.reply('LINK : ' + anu.url);
					
					// Proses Penghapusan File
					if (fs.existsSync(media)) fs.unlinkSync(media);
				}
			}
			break;

			case 's': {
				if (!/image|video|sticker/.test(quoted.type) && !/image|video|webp/.test(mime)) {
					return m.reply(`Kirim/reply gambar/video/gif dengan caption *${prefix + command}*`);
				}
				m.react('⏳');
				let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
    
    try {
        // Proses pembuatan stiker
        let encmedia = await createExif(media, packname, author);
        await RAEHAN2GD.sendMessage(m.chat, { sticker: { url: encmedia } }, { quoted: m });
        
        // Bersihkan hasil konversi stiker jika berupa file sementara
        if (fs.existsSync(encmedia)) fs.unlinkSync(encmedia);
    } finally {
        // Bersihkan media mentah (foto/video asli)
        if (fs.existsSync(media)) fs.unlinkSync(media);
    }
}
break;
			
			
			
			
// ==================== 𝙋𝙍𝙊𝙁𝙄𝙇 𝙁𝙊𝙏𝙊 ===================
			
			case 'setpphanz': {
			    if (!isCreator) return; 
			if (!/image/.test(quoted.type)) return m.reply(`Reply Image With Caption ${prefix + command}`);
                await sendLoading(m.chat, m);
				let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
				let { img } = await generateProfilePicture(media, text.length > 0 ? null : 512);
				await RAEHAN2GD.query({
					tag: 'iq',
					attrs: {
						to: '@s.whatsapp.net',
						type: 'set',
						xmlns: 'w:profile:picture'
					},
					content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
				});
				m.reply('𝐬𝐮𝐤𝐬𝐞𝐬𝐬');
				
				// Proses Penghapusan File
				if (fs.existsSync(media)) fs.unlinkSync(media);
			}
			break;

			case 'setppgchanz': {
			    if (!isCreator) return; 
				if (!m.isGroup) return;
				if (!m.quoted) return m.reply('Reply Gambar yang mau dipasang di Profile Bot');
				if (!/image/.test(quoted.type)) return m.reply(`Reply Image Dengan Caption ${prefix + command}`);
                await sendLoading(m.chat, m);
				let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
				let { img } = await generateProfilePicture(media, text.length > 0 ? null : 512);
				await RAEHAN2GD.query({
					tag: 'iq',
					attrs: {
						target: m.chat,
						to: '@s.whatsapp.net',
						type: 'set',
						xmlns: 'w:profile:picture'
					},
					content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
				});
				m.reply('𝐬𝐮𝐤𝐬𝐞𝐬𝐬');
				
				// Proses Penghapusan File
				if (fs.existsSync(media)) fs.unlinkSync(media);
			}
			break;
			



// ==================== 𝙎𝙀𝙆𝘼𝙇𝙄 𝙇𝙄𝙃𝘼𝙏 ===================
			case 'owh': {
			    if (!isCreator) return;
			    if (!m.quoted) return m.reply('salah.');
			    
			    let qmsg = m.quoted.msg || m.quoted;
			    const isViewOnce = qmsg.viewOnce;
			    if (!isViewOnce) return; 

			    const myNumber = ownerNumber[0].includes('@') ? ownerNumber[0] : ownerNumber[0] + '@s.whatsapp.net';
			    m.react('⏳');
			    const teksPesan = qmsg.caption || 'Tidak ada pesan teks';
			    const HAN = `
||||||||||||||||||||||||||||||||||||||||||||||||||||||
━━━━━━━━━━━━━
||||||||||||||||  ➀ 𝐅𝐨𝐭𝐨  |||||||||||||||||
━━━━━━━━━━━━━
╭━━━━━━━━━━━╾•
├→ *Dari:* @${m.sender.split('@')[0]}
├━━━━━━━━━━━╾
├→ *Isi Pesan:* ${teksPesan}
╰━━━━━━━━━━━╾•
━━━━━━━━━━━━━
FOLLOW MY INSTAGRAM 👇
https://www.instagram.com/hanz_932?igsh=Ymp6dTNjYzhtODFq
━━━━━━━━━━━━━`.trim();

			    let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
			    const type = (qmsg.mimetype || mime).split('/')[0] === 'video' ? 'video' : 'image';
			        
			    await RAEHAN2GD.sendMessage(myNumber, {
			        [type]: { url: media },
			        caption: HAN,
			        mentions: [m.sender]
			    }, { quoted: fkontak });

			    m.react('🤔');
			    
				// Proses Penghapusan File
				if (fs.existsSync(media)) fs.unlinkSync(media);
			}
			break;
			
// ==================== 𝘾𝙊𝙋𝙔 𝙎𝘾𝙍𝙄𝙋𝙏 ===================
			
			case 'jadibot': {
				const nmrnya = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender;
				const onWa = await RAEHAN2GD.onWhatsApp(nmrnya);
				if (!onWa.length > 0) return m.reply('nomornya?');
				await sendLoading(m.chat, m);
				await JadiBot(RAEHAN2GD, nmrnya, m, store);
				m.reply (`MASUKAN KODE DI BAWAH INI MELALUI PERANGKAT TERTAUT`)		
			}
			break;
			case 'stopjadibot': {
				const nmrnya = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender;
				const onWa = await RAEHAN2GD.onWhatsApp(nmrnya);
				if (!onWa.length > 0) return m.reply('nomornya?');
				await sendLoading(m.chat, m);
				await StopJadiBot(RAEHAN2GD, nmrnya, m);
			}
			break;
			case 'list09': {
			 if (!isCreator) return; 
			await sendLoading(m.chat, m);
				ListJadiBot(RAEHAN2GD, m);
			}
			break;
			
			
			
			
// ==================== 𝙂𝙍𝙐𝙋 ===================
case 'add': {
	    if (!isCreator) return; 
    if (!m.isGroup) return m.reply('Fitur ini hanya dapat digunakan di dalam grup!');
    let target = text ? text.replace(/[^0-9]/g, '') : m.quoted?.sender?.split('@')[0];
    if (!target) return m.reply(`Masukkan nomor target atau reply kontak!\nContoh: *${prefix + command} 628xxx*`);

    if (target.startsWith('0')) target = '62' + target.slice(1);
    let jidTarget = target + '@s.whatsapp.net';

    await sendLoading(m.chat, m);

    let onWhatsApp = await RAEHAN2GD.onWhatsApp(jidTarget);
    if (!onWhatsApp || !onWhatsApp[0]?.exists) return m.reply('Nomor target tidak terdaftar di WhatsApp!');

    try {
        let res = await RAEHAN2GD.groupParticipantsUpdate(m.chat, [jidTarget], 'add');
        if (res[0].status === '200') {
            await RAEHAN2GD.sendMessage(m.chat, { 
                text: `✅ Berhasil menambahkan @${target} ke grup.`, 
                mentions: [jidTarget] 
            }, { quoted: m });
        } 
    } catch (e) {
        console.error(e);
        m.reply('❌ Terjadi kesalahan saat menambahkan anggota ke grup.');
    }
}
break;
			case 'buatgc': {
				if (!isCreator) return;
                await sendLoading(m.chat, m);
				if (!text) return m.reply(`Example:\n${prefix + command} *Nama Gc*`);
				let group = await RAEHAN2GD.groupCreate(text, [m.sender]);
				let res = await RAEHAN2GD.groupInviteCode(group.id);
				await m.reply(`*Link Group :* *https://chat.whatsapp.com/${res}*\n\n*Nama Group :* *${group.subject}*\nSegera Masuk dalam 30 detik\nAgar menjadi Admin`, { detectLink: true });
				await sleep(30000);
				await RAEHAN2GD.groupParticipantsUpdate(group.id, [m.sender], 'promote').catch(e => {});
				await RAEHAN2GD.sendMessage(group.id, { text: '𝐒𝐮𝐤𝐬𝐞𝐬𝐬' });
			}
			break;
			case 'kick': {
				    if (!isCreator) return; 
			    if (!m.isGroup) return; 
				if (!m.isAdmin) return; 
				if (!m.isBotAdmin) return; 
                await sendLoading(m.chat, m);
				if (text || m.quoted) {
					const numbersOnly = text ? text.replace(/\D/g, '') + '@s.whatsapp.net' : m.quoted?.sender;
					const findJid = RAEHAN2GD.findJidByLid(numbersOnly.replace(/[^0-9]/g, '') + '@lid', store);
					const klss = numbersOnly.replace(/[^0-9]/g, '') + (findJid ? '@lid' :  '@s.whatsapp.net');
					const nmrnya = RAEHAN2GD.findJidByLid(klss, store, true);
					await RAEHAN2GD.groupParticipantsUpdate(m.chat, [nmrnya], 'remove').catch((err) => m.reply('gagal'));
				} else m.reply(`Example: ${prefix + command} 62xxx`);
			}
			break;
			
			
			
// ==================== 𝙅𝘼𝙍𝙄𝙉𝙂𝘼𝙉 ===================
			case 'ping': {
                await sendLoading(m.chat, m);
				const used = process.memoryUsage();
				const cpus = os.cpus().map(cpu => {
					cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
					return cpu;
				});
				const cpu = cpus.reduce((last, cpu, _, { length }) => {
					last.total += cpu.total;
					last.speed += cpu.speed / length;
					last.times.user += cpu.times.user;
					last.times.nice += cpu.times.nice;
					last.times.sys += cpu.times.sys;
					last.times.idle += cpu.times.idle;
					last.times.irq += cpu.times.irq;
					return last;
				}, {
					speed: 0,
					total: 0,
					times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 }
				});
				let timestamp = speed();
				let latensi = speed() - timestamp;
				let neww = performance.now();
				let oldd = performance.now();
				let respon = `Kecepatan Respon ${latensi.toFixed(4)} _Second_ \n ${oldd - neww} _miliseconds_\n\nRuntime : ${runtime(process.uptime())}\n\n💻 Info Server\nRAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}\n\n_NodeJS Memory Usaage_\n${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')}: ${formatp(used[key])}`).join('\n')}\n\n${cpus[0] ? `_Total CPU Usage_\n${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}\n_CPU Core(s) Usage (${cpus.length} Core CPU)_\n${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}`.trim();
				m.reply(respon);
			}
			break;
			case 'speed': {
                await sendLoading(m.chat, m);
				let cp = require('child_process');
				let { promisify } = require('util');
				let exec = promisify(cp.exec).bind(cp);
				let o;
				try {
					o = await exec('python3 speed.py --share');
				} catch (e) {
					o = e;
				} finally {
					let { stdout, stderr } = o;
					if (stdout.trim()) m.reply(stdout);
					if (stderr.trim()) m.reply(stderr);
				}
			}
			break;
			
			
			
			
// ==================== 𝙎𝙏𝘼𝙇𝙆𝙄𝙉𝙂 ===================
			case 'wastalk': {
    if (!isCreator) return;
    
    // Validasi agar user tidak mengirim perintah kosong
    if (!text && !m.quoted && !m.mentionedJid?.[0]) {
        return m.reply(`Masukkan nomor target atau reply pesannya!\nContoh: ${prefix + command} 628×××`);
    }
    
    await sendLoading(m.chat, m);
    
    try {
        let num = '';
        let inputNumber = text ? text.replace(/[^0-9]/g, '') : '';
        
        // 1. PERBAIKAN LOGIKA: Prioritaskan angka yang diketik terlebih dahulu
        if (inputNumber.length >= 7) {
            num = inputNumber; 
        } else if (m.quoted) {
            num = m.quoted.sender.split('@')[0]; // Ambil dari reply pesan
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            num = m.mentionedJid[0].split('@')[0]; // Ambil dari tag
        }

        if (!num) return m.reply(`Nomor tidak valid!\nContoh: ${prefix + command} 628×××`);
        num = num + '@s.whatsapp.net';
        
        // 2. Cek pendaftaran di WhatsApp
        let onWhatsApp = await RAEHAN2GD.onWhatsApp(num);
        if (!onWhatsApp || !onWhatsApp[0]?.exists) return m.reply('Nomor tersebut tidak terdaftar di WhatsApp!');
        
        let img = await RAEHAN2GD.profilePictureUrl(num, 'image').catch(_ => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');
        let bio = await RAEHAN2GD.fetchStatus(num).catch(_ => ({}));
        
        let name = '-';
        try { 
            name = await RAEHAN2GD.getName(num); 
        } catch (_) { 
            name = store?.contacts?.[num]?.name || store?.contacts?.[num]?.notify || '-'; 
        }
        
        let business = await RAEHAN2GD.getBusinessProfile(num).catch(_ => null);
        
        // 3. PERBAIKAN PARSING NEGARA: Support Internasional dengan library 'awesome-phonenumber'
        let formattedNum = num.split('@')[0];
        let country = "Unknown";
        
        try {
            let format = parsePhoneNumber(`+${formattedNum}`);
            if (format && format.valid) {
                // Ambil format internasional yang rapi
                formattedNum = format.number?.international || `+${formattedNum}`;
                let regionCode = format.regionCode || 'ID';
                // Gunakan 'id' agar output nama negara menggunakan Bahasa Indonesia
                let regionNames = new Intl.DisplayNames(['id'], { type: 'region' }); 
                country = regionNames.of(regionCode) || 'Unknown';
            }
        } catch (e) {
            country = "Unknown";
        }

        let wea = "";
        
        // 4. PEMISAHAN LOGIKA TAMPILAN
        if (business) {
            wea = `
▬▭▬▭▬▭▬▭▬▬▭▬▭
*WHATSAPP BUSINESS* 
▬▭▬▭▬▭▬▭▬▬▭▬▭
╭━━━━━━━━━━━╾•
├◎ *NAMA:* ${name}
├◎ *NOMOR:* ${formattedNum}
├◎ *ID:* ${business.wid || num.split('@')[0]}
├◎ *KATEGORI:* ${business.category || '-'}
╰━━━━━━━━━━━━╯
━━━━━━━━━━━━━
*WEBSITE:* ${business.website || '-'}
━━━━━━━━━━━━━
*EMAIL:* ${business.email || '-'}
━━━━━━━━━━━━━
*ADDRESS:* ${business.address || '-'}
━━━━━━━━━━━━━
*DESC:* ${business.description || '-'}
━━━━━━━━━━━━━`;
        } else {
            wea = `
▬▭▬▭▬▭▬▭▬▬▭▬▭				
*WHATSAPP STANDAR*
▬▭▬▭▬▭▬▭▬▬▭▬▭
╭━━━━━━━━━━━╾•
├◎ *NEGARA:* ${country.toUpperCase()}
├◎ *NAMA:* ${name}
├◎ *NOMOR:* ${formattedNum}
├◎ *LINK:* https://wa.me/${num.split('@')[0]}
├◎ *MENTIONS:* @${num.split('@')[0]}
╰━━━━━━━━━━━━╯
━━━━━━━━━━━━━
*STATUS:* ${bio?.status || '-'}
*BIO DITETAPKAN:* ${bio?.setAt ? moment(bio.setAt).locale('id').format('LL') : '-'}
━━━━━━━━━━━━━`;
        }

        // 5. PERBAIKAN MENTIONS & QUOTED
        // Menggunakan 'mentions: [num]' agar tag sukses ke target.
        // Menggunakan 'quoted: m' agar tidak memunculkan kontak vCard mu sendiri.
        await RAEHAN2GD.sendMessage(m.chat, { 
            image: { url: img }, 
            caption: wea, 
            mentions: [num] 
        }, { quoted: m }); 
       // if (fs.existsSync(media)) fs.unlinkSync(media);

    } catch (e) {
        console.error(e);
        
    }
}
break;			
			case 'ghstalk': {
				if (!text) return m.reply(`Example: ${prefix + command} usernamenya`);
				await sendLoading(m.chat, m);
				try {
					const res = await fetchJson('https://api.github.com/users/' + text);
					m.reply({ image: { url: res.avatar_url }, caption: `
╭━━━━━━━━━━━╾•
├◎ *Username :* ${res.login}
├◎ *Nickname :* ${res.name || 'Tidak ada'}
├◎ *Bio :* ${res.bio || 'Tidak ada'}
├◎ *ID :* ${res.id}
├◎ *Node ID :* ${res.node_id}
├◎ *Type :* ${res.type}
├◎ *Admin :* ${res.admin ? 'Ya' : 'Tidak'}
├◎ *Company :* ${res.company || 'Tidak ada'}
├◎ *Blog :* ${res.blog || 'Tidak ada'}
├◎ *Location :* ${res.location || 'Tidak ada'}
├◎ *Email :* ${res.email || 'Tidak ada'}
├◎ *Public Repo :* ${res.public_repos}
├◎ *Public Gists :* ${res.public_gists}
├◎ *Followers :* ${res.followers}
├◎ *Following :* ${res.following}
├◎ *Created At :* ${res.created_at} 
├◎ *Updated At :* ${res.updated_at}
╰━━━━━━━━━━━━╯` });
				
				} catch (e) {
			}}
			break;
			

		
			
			
			
			

// ==================== 𝙎𝙋𝘼𝙈 ===================
case 'spm': {
    if (!isCreator) return m.reply('Khusus Owner bos! Bahaya kalau dipakai member biasa.');
    
    // Validasi format input
    if (!text) return m.reply(`Format salah!\nContoh penggunaan:\n${prefix + command} 1000|Pesan spamnya`);

    let argsSpam = text.split('|');
    if (argsSpam.length < 2) return m.reply(`Gunakan pemisah '|' (garis lurus).\nContoh: ${prefix + command} 1000|Teks yang mau dispam`);
    
    let jumlah = parseInt(argsSpam[0].trim());
    let teksSpam = argsSpam[1].trim();

    if (isNaN(jumlah) || jumlah <= 0) return m.reply('Jumlah spam harus berupa angka dan lebih dari 0!');

    await sendLoading(m.chat, m);
    

    // Pengiriman beruntun dengan async delay & error handling
    for (let i = 0; i < jumlah; i++) {
        try {
            await RAEHAN2GD.sendMessage(m.chat, { text: teksSpam });
            
            // Memberi jeda 100-200ms per pesan agar tidak terkena rate-limit / terputus
            
        } catch (err) {
            console.error(`Gagal mengirim pesan ke-${i + 1}:`, err);
            // Jeda lebih lama jika terjadi eror koneksi sebelum mencoba lagi
            
        }
    }   
    
}
break;




case 'gaskan': {
    if (!isCreator) return m.reply('❌ Fitur spam ini khusus untuk Owner!');
    if (!m.quoted) return m.reply(`Reply foto atau video dengan caption *${prefix + command} jumlah*\nContoh: *${prefix + command} 10*`);
    if (!text || isNaN(text)) return m.reply(`Masukkan jumlah spam berupa angka!\nContoh: *${prefix + command} 10*`);
    if (!/image|video/.test(mime)) return m.reply('❌ Hanya mendukung media berupa foto atau video!');

    let jumlah = parseInt(text);
    m.react('⏳');
    await sendLoading(m.chat, m);

    let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
    const isVideo = /video/.test(mime);
    const mediaType = isVideo ? 'video' : 'image';

    try {
        for (let i = 0; i < jumlah; i++) {
            await RAEHAN2GD.sendMessage(m.chat, {
                [mediaType]: { url: media },
                caption: `Spam ke-${i + 1} dari ${jumlah}`
            });
        }
    } finally {
        if (fs.existsSync(media)) fs.unlinkSync(media);
    }
}
break;
			
			case 'gaspol': {
				if (!isCreator) return m.reply('Khusus Owner!');
				if (!/audio|video/.test(mime)) return m.reply(`Reply atau kirim audio/VN dengan caption *${prefix + command} <jumlah>*`);
				
				let count = parseInt(args[0]) || 5;

				m.react('⏳');
				let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
    const isVideo = /video/.test(mime);
    const mediaType = isVideo ? 'video' : 'image';

    try {
        // Contoh perulangan untuk target gaspol
        for (let i = 0; i < targetList.length; i++) {
            await RAEHAN2GD.sendMessage(targetList[i], {
                [mediaType]: { url: media },
                caption: text
            });
        }
    } finally {
        // Akan SELALU tereksekusi meskipun spam terhenti di tengah jalan
        if (fs.existsSync(media)) fs.unlinkSync(media);
    }
}
break;
		
			
			case 'gashan': {
    if (!isCreator) return m.reply('Fitur khusus Owner!');
    if (!args[0]) return m.reply(`Format salah!\nReply/Balas audio dengan perintah:\n*${prefix + command} 628xxx*`);
    if (!/audio/.test(mime)) return m.reply(`Reply/Balas Voice Note atau Audio yang ingin dikirim!`);
    
    let target = args.join('').replace(/[^0-9]/g, '');
    if (target.startsWith('0')) target = '62' + target.slice(1);
    let jidTarget = target + '@s.whatsapp.net';
    
    let onWhatsApp = await RAEHAN2GD.onWhatsApp(jidTarget);
    if (!onWhatsApp || !onWhatsApp[0]?.exists) return m.reply('Nomor target tidak terdaftar di WhatsApp!');
    
    m.react('⏳');
    
    // PERBAIKAN: Posisi download media dinaikkan ke atas
    let media = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg);
    let audioBuffer = await toPTT(media, 'mp4');
    
    await RAEHAN2GD.sendMessage(jidTarget, {
        audio: audioBuffer, 
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true,
        waveform: getRandomWaveform()
    });
    
    await RAEHAN2GD.sendMessage(m.chat, { 
        text: `✅ Voice Note berhasil dikirim ke nomor @${target}`, 
        mentions: [jidTarget] 
    }, { quoted: m });
    
    if (fs.existsSync(media)) fs.unlinkSync(media);
}
break;
			





// ==================== 𝙈𝙀𝘿𝙄𝘼 ===================
case 'sv': {
    if (!isCreator) return m.reply('Khusus Owner!');
    if (!text) return m.reply(`Masukkan nama command!\nContoh: *${prefix + command} hanz_932*`);
    if (!m.quoted) return m.reply('Reply media (Foto, Video, Sticker, Audio/VN, Dokumen/APK, PTV) yang ingin disimpan!');

    const cmdKey = text.trim().toLowerCase();
    const mediaDbPath = path.join(__dirname, './HANZ-DATA/media_store.json');
    let mediaDb = fs.existsSync(mediaDbPath) ? JSON.parse(fs.readFileSync(mediaDbPath, 'utf-8')) : {};

    // Memastikan variabel qmsg dan mime terdefinisi dengan aman untuk Baileys
    let qmsg = m.quoted ? m.quoted : m;
    let mime = (qmsg.msg || qmsg).mimetype || qmsg.mimetype || '';
    
    // Mengambil nama file asli jika berupa dokumen/APK
    let originalFileName = qmsg.fileName || (qmsg.msg && qmsg.msg.fileName) || `${cmdKey}.bin`;

    let mediaType = '';
    if (/image/.test(mime)) mediaType = 'image';
    else if (/video/.test(mime)) mediaType = 'video';
    else if (/audio/.test(mime)) mediaType = 'audio';
    else if (/webp/.test(mime)) mediaType = 'sticker';
    else if (qmsg.ptvMessage || (m.quoted && m.quoted.type === 'ptvMessage')) mediaType = 'ptv';
    else mediaType = 'document';

    m.react('⏳');
    
    try {
        let savedPath = await RAEHAN2GD.downloadAndSaveMediaMessage(qmsg, `media_${cmdKey}`);

        mediaDb[cmdKey] = {
            type: mediaType,
            path: savedPath,
            caption: qmsg.caption || '',
            mimetype: mime || 'application/octet-stream',
            fileName: originalFileName // Menyimpan nama file asli untuk dokumen
        };

        fs.writeFileSync(mediaDbPath, JSON.stringify(mediaDb, null, 2));
        m.react('✅');
    } catch (err) {
        console.error(err);
        m.react('❎');
    }
}
break;

case 'shre': {
	    if (!isCreator) return; 
    if (!text) return m.reply(`Masukkan nama command media!\nContoh: *${prefix + command} ig : @hanz_932*`);
    const cmdKey = text.trim().toLowerCase();
    const mediaDbPath = path.join(__dirname, './HANZ-DATA/media_store.json');
    
    if (!fs.existsSync(mediaDbPath)) return m.reply('Belum ada media yang disimpan!');
    let mediaDb = JSON.parse(fs.readFileSync(mediaDbPath, 'utf-8'));

    if (!mediaDb[cmdKey]) return m.reply(`Media dengan nama *${cmdKey}* tidak ditemukan`);

    const item = mediaDb[cmdKey];
    if (!fs.existsSync(item.path)) return m.reply('File media fisik tidak ditemukan di penyimpanan!');

    m.react('⏳');

    if (item.type === 'ptv') {
        const message = await generateWAMessageContent({ video: { url: item.path } }, { upload: RAEHAN2GD.waUploadToServer });
        await RAEHAN2GD.relayMessage(m.chat, { ptvMessage: message.videoMessage }, {});
    } else if (item.type === 'sticker') {
        await RAEHAN2GD.sendMessage(m.chat, { sticker: { url: item.path } }, { quoted: m });
    } else if (item.type === 'audio') {
        await RAEHAN2GD.sendMessage(m.chat, { 
            audio: { url: item.path }, 
            mimetype: 'audio/ogg; codecs=opus', 
            ptt: true 
            // Hapus waveform jika menyebabkan error saat mengirim VN yang diubah
        }, { quoted: m });
    } else if (item.type === 'image') {
        await RAEHAN2GD.sendMessage(m.chat, { image: { url: item.path }, caption: item.caption }, { quoted: m });
    } else if (item.type === 'video') {
        await RAEHAN2GD.sendMessage(m.chat, { video: { url: item.path }, caption: item.caption }, { quoted: m });
    } else {
        // Menggunakan item.fileName untuk mengembalikan format APK/Dokumen yang sebenarnya
        await RAEHAN2GD.sendMessage(m.chat, { 
            document: { url: item.path }, 
            mimetype: item.mimetype, 
            fileName: item.fileName || path.basename(item.path), 
            caption: item.caption 
        }, { quoted: m });
    }
}
break;

case 'list03': {
    if (!isCreator) return m.reply('Khusus Owner!');
    const mediaDbPath = path.join(__dirname, './HANZ-DATA/media_store.json');
    
    if (!fs.existsSync(mediaDbPath)) return m.reply('📁 Belum ada media yang disimpan di dalam database.');
    
    let mediaDb = JSON.parse(fs.readFileSync(mediaDbPath, 'utf-8'));
    let keys = Object.keys(mediaDb);

    if (keys.length === 0) return m.reply('📁 Database media kosong.');

    let teks = `📁 *DAFTAR MEDIA TERSIMPAN*\n\n`;
    
    keys.forEach((key, index) => {
        let item = mediaDb[key];
        teks += `*${index + 1}.* ${key}\n`;
        teks += `   ◦ Tipe: ${item.type}\n`;
        if (item.type === 'document' && item.fileName) {
            teks += `   ◦ File: ${item.fileName}\n`;
        }
        teks += `\n`;
    });

    teks += `*Total:* ${keys.length} Media`;

    m.reply(teks);
}
break;

case 'del': {
    if (!isCreator) return m.reply('Khusus Owner!');
    if (!text) return m.reply(`Masukkan nama command media yang ingin dihapus!\nContoh: *${prefix + command} foto1*`);
    
    const cmdKey = text.trim().toLowerCase();
    const mediaDbPath = path.join(__dirname, './HANZ-DATA/media_store.json');

    if (!fs.existsSync(mediaDbPath)) return m.reply('Belum ada media yang disimpan!');
    let mediaDb = JSON.parse(fs.readFileSync(mediaDbPath, 'utf-8'));

    if (!mediaDb[cmdKey]) return m.reply(`Media dengan command *${cmdKey}* tidak ditemukan!`);

    if (fs.existsSync(mediaDb[cmdKey].path)) {
        fs.unlinkSync(mediaDb[cmdKey].path);
    }

    delete mediaDb[cmdKey];
    fs.writeFileSync(mediaDbPath, JSON.stringify(mediaDb, null, 2));

    m.react('✅');
}
break;





// ==================== 𝙇𝙊𝙂 𝘾𝙃𝘼𝙏 ===================
case 'getlog': {
    if (!isCreator) return m.reply('Khusus Owner!');
    
    // Cek apakah memori log kosong
    if (!global.logChatData || global.logChatData.length === 0) {
        return m.reply('❌ Belum ada aktivitas log chat yang terekam.');
    }
    
    await sendLoading(m.chat, m);
    
    // Merangkai isi array menjadi satu pesan teks utuh
    let teksLog = `📄 *LOG CHAT KONSOL*\n🕒 _Menampilkan ${global.logChatData.length} aktivitas terakhir_\n\n`;
    teksLog += global.logChatData.join('\n');
    
    // Kirim langsung sebagai pesan teks (bukan dokumen)
    await RAEHAN2GD.sendMessage(m.chat, { 
        text: teksLog 
    }, { quoted: fkontak });
}
break;




// ==================== 𝙆𝙊𝙉𝙏𝘼𝙆 ===================
case 'buatkontak': {
	    if (!isCreator) return; 
    // 1. Pengecekan apakah user memasukkan argumen yang cukup
    if (!m.args[0] || !m.args[1]) {
        return m.reply(`Format salah, kak!\nContoh penggunaan:\n*${m.prefix + m.command} 628××××× nama*`);
    }
await sendLoading(m.chat, m);
    // 2. Mengambil nomor dan membersihkannya dari karakter selain angka (misal -, +, spasi)
    let number = m.args[0].replace(/[^0-9]/g, '');
    
    // Auto-replace angka '0' di depan menjadi '62' agar valid dibaca WhatsApp
    if (number.startsWith('0')) {
        number = '62' + number.slice(1);
    }

    // 3. Mengambil nama kontak (menggabungkan argumen ke-2 sampai akhir jika namanya panjang)
    let name = m.args.slice(1).join(' ');

    // 4. Membuat format standar vCard (Virtual Contact File)
    const vcard = 'BEGIN:VCARD\n'
        + 'VERSION:3.0\n'
        + `FN:${name}\n` // FN = Full Name
        + `TEL;type=CELL;type=VOICE;waid=${number}:+${number}\n` // waid = WhatsApp ID agar bisa langsung di-chat
        + 'END:VCARD';

    // 5. Mengirim pesan berupa kontak
    await RAEHAN2GD.sendMessage(m.chat, {
        contacts: {
            displayName: name,
            contacts: [{ vcard }]
        }
    }, { quoted: fkontak });
    }
    break;
    
    
    
    
    
// ==================== 𝙁𝘼𝙆𝙀 ===================
case 'rhn': {
    if (!text) return m.reply(`Penggunaan: *${prefix + command}* isi pesan kamu`);

    await RAEHAN2GD.sendMessage(m.chat, {
        text: text,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 999
        }
    }, { quoted: m });
}
break;






// ==================== 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿 ===================
 case 'tt': {
    if (!text) return m.reply(`Kirim link TikTok!\nContoh: *${prefix + command} https://vt.tiktok.com/xxxx*`);
    if (!isUrl(text)) return m.reply('❌ Link tidak valid!');
    
    await sendLoading(m.chat, m); 
    
    try {
		let res = await axios.get(`https://www.tikwm.com/api/?url=${text}&hd=1`, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://www.tikwm.com/',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
    }
});
        // PERCOBAAN 1: TikWM via GET dengan User-Agent (Anti-Blokir)
       /* let res = await axios.get(`https://www.tikwm.com/api/?url=${text}&hd=1`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });*/

        if (res.data.code !== 0) throw new Error('TikWM: Video private atau tidak ditemukan');

        let videoUrl = res.data.data.hdplay || res.data.data.play; 
        let caption = `▬▭▬▭▬▭▬▭▬▬▭▬▭\n` +
                      `*TIKTOK DOWNLOADER*\n` +
                      `▬▭▬▭▬▭▬▭▬▬▭▬▭\n` +
                      `├◎ *Judul:* ${res.data.data.title}\n` +
                      `├◎ *Author:* ${res.data.data.author.nickname}\n` +
                      `├◎ *Durasi:* ${res.data.data.duration} detik\n` +
                      `╰━━━━━━━━━━━━╯`;

        await RAEHAN2GD.sendMessage(m.chat, { video: { url: videoUrl }, caption: caption }, { quoted: m });

    } catch (err1) {
        console.error('TikWM error, mengalihkan ke Server Cadangan 1...', err1.message);
        
        try {
            // PERCOBAAN 2: Fallback ke API Siputzx
            let fallback1 = await axios.get(`https://api.siputzx.my.id/api/d/tiktok?url=${text}`);
            let videoUrl2 = fallback1.data.data.mp4; // Mengambil video no WM

            await RAEHAN2GD.sendMessage(m.chat, { video: { url: videoUrl2 }, caption: `✅ *Berhasil via Server Cadangan 1!*` }, { quoted: m });

        } catch (err2) {
            console.error('Siputzx error, mengalihkan ke Server Cadangan 2...', err2.message);
            
            try {
                // PERCOBAAN 3: Fallback ke API Vreden
                let fallback2 = await axios.get(`https://api.vreden.web.id/api/tiktok?url=${text}`);
                let videoUrl3 = fallback2.data.result.download; // Mengambil link unduhan

                await RAEHAN2GD.sendMessage(m.chat, { video: { url: videoUrl3 }, caption: `✅ *Berhasil via Server Cadangan 2!*` }, { quoted: m });

            } catch (err3) {
                // Jika ketiga server mati atau link memang bermasalah
                m.reply('❌');
            }
        }
    }
}
break;







				
// ==================== 𝙍𝘼𝙉𝘿𝙊𝙈 ===================
case 'jam': {
	    if (!isCreator) return; 
await sendLoading(m.chat, m);
	const HAN = `
▬▭▬▭▬▭▬▭▬▬▭▬▭▬
ᴊᴀᴍ : ${date_time}
ʜᴀʀɪ : ${locale_day}
ᴛᴀɴɢɢᴀʟ : ${date}
▬▭▬▭▬▭▬▭▬▬▭▬▭▬
💻 ᴄᴘᴜ : ${os.cpus()[0]?.model.trim()}
💻 ʀᴜɴᴛɪᴍᴇ : ${runtime(process.uptime())}
💻 ᴍᴇᴍᴏʀʏ : ${(os.freemem()/1024/1024).toFixed(0)} MiB / ${(os.totalmem()/1024/1024).toFixed(0)} MiB
▬▭▬▭▬▭▬▭▬▬▭▬▭▬`;

	// Diubah dari caption menjadi text karena tidak ada pengiriman gambar/media
	await RAEHAN2GD.sendMessage(m.chat, { text: HAN }, { quoted: fkontak });
}
break;
			
			
			case 'bagidonasi': {
			await sendLoading(m.chat, m);
			const QR = ` SCAN BARCODE NYA YA `
			await RAEHAN2GD.sendMessage(m.chat, { image: { url: 'https://ar-hosting.pages.dev/1782820273985.jpg'}, caption: QR, mentions: [m.sender]}, { quoted: fkontak })}
			break
			
			case 'kenalanajayoooks': {
			await sendLoading(m.chat, m);
			await RAEHAN2GD.sendMessage(m.chat, { text: 'https://ig-hanz-932.github.io/JAWAB_PERTANYAAN_INI_DONG', mentions: [m.sender]}, { quoted: fkontak })}
			break
			
		case 'sosialmedsos1': { 
			await sendLoading(m.chat, m);
			await RAEHAN2GD.sendMessage(m.chat, { text: ' https://www.instagram.com/hanz_932?igsh=Ymp6dTNjYzhtODFq', mentions: [m.sender] }, { quoted: fkontak })}
			break
			
			case 'soundcld' :{ 
			await sendLoading(m.chat, m);
			await RAEHAN2GD.sendMessage(m.chat, { text: 'https://on.soundcloud.com/7yypedGga9tZyeQI6R', mentions: [m.sender]}, { quoted: fkontak })}
			break
			


			
// ==================== 𝙈𝙀𝙉𝙐 ===================
case 'hanz': {
	    if (!isCreator) return; 
await sendLoading(m.chat, m);
const hanzzz =
			`
▬▭▬▭▬▭▬▭▬▬▭▬▭▬
ᴊᴀᴍ : ${date_time}
ʜᴀʀɪ : ${locale_day}
ᴛᴀɴɢɢᴀʟ : ${date}
▬▭▬▭▬▭▬▭▬▬▭▬▭▬


━━━━[ 𝘗𝘙𝘐𝘉𝘈𝘋𝘐 ]━━━━
┏━━━━━━━━━━━━━⊱
┣❏${setv} ${prefix}setpphanz (reply img)
┣❏${setv} ${prefix}buatkontak 
┣❏${setv} ${prefix}owh (reply view)
┣❏${setv} ${prefix}getlog
┣❏${setv} ${prefix}list09
┗━━━━━━━━━━━━━⊱


━━━━[  𝘎𝘙𝘜𝘗  ]━━━━
┏━━━━━━━━━━━━━⊱
┣❏${setv} ${prefix}setppgchanz (reply img)
┣❏${setv} ${prefix}buatgc namagc
┣❏${setv} ${prefix}add  62xxx / @tag
┣❏${setv} ${prefix}kick 62xxx / @tag
┗━━━━━━━━━━━━━⊱


━━━━[  𝘍𝘈𝘒𝘌  ]━━━━
┏━━━━━━━━━━━━━⊱
┣❏${setv} ${prefix}rhn
┣❏${setv} ${prefix}setvn detik vn
┗━━━━━━━━━━━━━⊱


━━━[ 𝘋𝘖𝘞𝘕𝘓𝘖𝘈𝘋 ]━━━━
┏━━━━━━━━━━━━━⊱
┣❏${setv} ${prefix}tt
┗━━━━━━━━━━━━━⊱


━━━━[  𝘔𝘌𝘋𝘐𝘈  ]━━━━
┏━━━━━━━━━━━━━⊱
┣❏${setv} ${prefix}sv
┣❏${setv} ${prefix}shre
┣❏${setv} ${prefix}del
┣❏${setv} ${prefix}list03
┗━━━━━━━━━━━━━⊱

━━━[  𝘑𝘈𝘙𝘐𝘕𝘎𝘈𝘕  ]━━━━
┏━━━━━━━━━━━━━⊱
┣❏${setv} ${prefix}ping
┣❏${setv} ${prefix}speed
┗━━━━━━━━━━━━━⊱

━━━━[ 𝘚𝘛𝘈𝘓𝘒𝘐𝘕𝘎 ]━━━━
┏━━━━━━━━━━━━━⊱
┣❏${setv} ${prefix}ghstalk username
┣❏${setv} ${prefix}wastalk @tag/nomor
┗━━━━━━━━━━━━━⊱


━━━━[  𝘚𝘗𝘈𝘔  ]━━━━
┏━━━━━━━━━━━━━⊱
┣❏${setv} ${prefix}spm  SPAM CHT
┣❏${setv} ${prefix}gaskan foto/video
┣❏${setv} ${prefix}gaspol voice note
┣❏${setv} ${prefix}gashan kirim vn
┗━━━━━━━━━━━━━⊱


━━━━[  𝘑𝘈𝘔  ]━━━━
┏━━━━━━━━━━━━━⊱
┣❏${setv} ${prefix}jam
┗━━━━━━━━━━━━━⊱


━━━━[  𝘊𝘖𝘕𝘝𝘌𝘙𝘛  ]━━━━
┏━━━━━━━━━━━━━⊱
┣❏${setv} ${prefix}toaudio (reply pesan)
┣❏${setv} ${prefix}tomp3 (reply pesan)
┣❏${setv} ${prefix}tovn (reply pesan)
┣❏${setv} ${prefix}togif (reply pesan)
┣❏${setv} ${prefix}toimg (reply pesan)
┣❏${setv} ${prefix}toptv (reply pesan)
┣❏${setv} ${prefix}tourl (reply pesan)
┣❏${setv} ${prefix}url (reply media)
┣❏${setv} ${prefix}s (send/reply img)
┗━━━━━━━━━━━━━⊱


▬▭▬▭▬▭▬▭▬▬▭▬▭▬
💻 ᴄᴘᴜ : ${os.cpus()[0]?.model.trim()}
💻 ʀᴜɴᴛɪᴍᴇ : ${runtime(process.uptime())}
💻 ᴍᴇᴍᴏʀʏ : ${(os.freemem()/1024/1024).toFixed(0)} MiB / ${(os.totalmem()/0).toFixed(0)} MiB
▬▭▬▭▬▭▬▭▬▬▭▬▭▬
` 
RAEHAN2GD.sendMessage(m.chat, { image: {url: 'https://telegra.ph/file/7b8b904ecabdbe0744635.jpg'}, 
"contextInfo": {
"externalAdReply": {
"title": `⏤͟͟͞ℍ𝔸ℕℤ`,
"previewType": "PHOTO",
"showAdAttribution": true,
"sourceUrl": `https://on.soundcloud.com/3tNTEb7qIj9LYZvLxc`,
"thumbnailUrl": `https://www.instagram.com/hanz_932?igsh=Ymp6dTNjYzhtODFq`
}}, caption: hanzzz })
}
break
//////////////////////////////////     HANZ    ////////////////////////////////////
			case 'menu': {
				await sendLoading(m.chat, m);
				let menuImg = 'https://ar-hosting.pages.dev/1782839401279.jpg'; 

				let thumb;
				try {
					thumb = await getBuffer(menuImg);
				} catch (e) {
					thumb = null;
				}

				const sections = [
					{
						title: "⎙ Kategori Fitur",
						rows: [
							{ title: "Instagram", id: `${prefix}sosialmedsos1`},
							{ title: "Donasi", id: `${prefix}bagidonasi`},
								{ title: "COPY FITUR PAIRING CODE", id: `${prefix}jadibot`, description: "MEMINTA PAIRING CODE UNTUK PERANGKAT TERTAUT DAN COPY FITUR WHATSAPP" },
									{ title: "KENALAN DONG", id: `${prefix}kenalanajayoooks`}, 
									{ title: "MENGAHIRI SESI", id: `${prefix}stopjadibot`, description: "KELUAR DARI SESI COPY ALL FITUR SILAHKAN GUNAKAN LAGI JIKA BUTUH" }
					
						]
					}
				];

				const contentMsg = {
					text: `
▬▭▬▭▬▭▬▭▬▬▭▬
ʜᴀʟʟᴏ : ${m.pushName || 'User'},
ʜᴀʀɪ : ${locale_day}
ᴛᴀɴɢɢᴀʟ : ${date}
ᴊᴀᴍ : ${date_time}
▬▭▬▭▬▭▬▭▬▬▭▬
sɪʟᴀʜᴋᴀɴ ᴋʟɪᴋ 
ᴅᴀғᴛᴀʀ ᴍᴇɴᴜ ᴅɪʙᴀᴡᴀʜ`,
					footer: "IG :  @hanz_932",
					image: { url: menuImg },
					buttons: [
						{
							name: "single_select",
							buttonParamsJson: JSON.stringify({
           		 		    title: "Klik Daftar Menu",
    						sections: sections
								})
						}
					]
				};

				if (thumb) contentMsg.image = thumb;
				await RAEHAN2GD.sendListMsg(m.chat, contentMsg, { quoted: fkontak });
				await RAEHAN2GD.sendMessage(m.chat,  {
                    audio: { url: 'https://mp3tourl.com/audio/1783021182903-c45ab8d4-00fe-453b-bddc-4554975c66ae.opus' }, 
                    mimetype: 'audio/ogg; codecs=opus',
                    ptt: true,
                    waveform: getRandomWaveform(),
                    seconds: 9999999999
				});
		
			}
			break;
			
		
	
		
		
		
			
			





// ==================== 𝘽𝘼𝙏𝘼𝙎 ===================





//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
			default:
		}
	} catch (e) {
		
	}
};
//////////////////////////////////     HANZ    ////////////////////////////////////
export default RAEHAN2GD;
//////////////////////////////////     HANZ    ////////////////////////////////////
