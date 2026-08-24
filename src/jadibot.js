import '../HAN_SETTINGS.js';
import pino from 'pino';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { Boom } from '@hapi/boom';
import NodeCache from 'node-cache';
import { exec } from 'child_process';
import WAConnection, { useMultiFileAuthState, Browsers, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestWaWebVersion } from 'baileys';

import { MessagesUpsert, Solving } from './message.js';

// ==================== PROCESS ANTI-CRASH GUARD ====================
// Berfungsi menangkap unhandled error dari internal socket Baileys agar bot utama tidak mati/crash
process.on('uncaughtException', (err) => {
	if (err.message?.includes('Connection Closed')) return;
	console.log(chalk.redBright(`[Uncaught Exception] ${err.stack}`));
});
process.on('unhandledRejection', (reason, promise) => {
	if (reason?.message?.includes('Connection Closed')) return;
	console.log(chalk.redBright(`[Unhandled Rejection] At:`, promise, `Reason:`, reason));
});
// ==================================================================

global.client = {};

const msgRetryCounterCache = new NodeCache();

async function JadiBot(conn, from, m, store) {
	async function startJadiBot() {
		try {
			const { version } = await fetchLatestWaWebVersion();
			const { state, saveCreds } = await useMultiFileAuthState(`./HANZ-DATA/${from}`);
			const level = pino({ level: 'silent' })
			
			const getMessage = async (key) => {
				if (store) {
					const msg = await store.loadMessage(key.remoteJid, key.id);
					return msg?.message || ''
				}
			}
			
			client[from] = WAConnection({
				version,
				logger: level,
				getMessage,
				msgRetryCounterCache, // DITAMBAHKAN: Mencegah spam error enkripsi
				syncFullHistory: false,
				browser: Browsers.macOS('Firefox'),
				generateHighQualityLinkPreview: false,
				//markOnlineOnConnect: false, // ONLINE WA
				auth: {
					creds: state.creds,
					keys: makeCacheableSignalKeyStore(state.keys, level),
				},
				// DITAMBAHKAN: Bypass patch untuk fitur interaktif di multi-device
				patchMessageBeforeSending: (message) => {
					const requiresPatch = !!(
						message.buttonsMessage ||
						message.templateMessage ||
						message.listMessage ||
						message.interactiveMessage
					);
					if (requiresPatch) {
						message = {
							viewOnceMessage: {
								message: {
									messageContextInfo: {
										deviceListMetadataVersion: 2,
										deviceListMetadata: {},
									},
									...message,
								},
							},
						};
					}
					return message;
				}
			})
			
			await Solving(client[from], store)
			
			client[from].pairingStarted = false;
			
			client[from].ev.on('creds.update', saveCreds)
			
			client[from].ev.on('connection.update', async (update) => {
				const { connection, lastDisconnect, receivedPendingNotifications } = update
				if (connection === 'connecting' && !client[from].authState.creds.registered && !client[from].pairingStarted) {
					setTimeout(async () => {
						if (!client[from]) return;
						client[from].pairingStarted = true;
						let code = await client[from].requestPairingCode(from.replace(/[^0-9]/g, ''));
						if (!client[from]) return;
						m.reply(` ${code?.match(/.{1,4}/g)?.join('-') || code}`);
					}, 3000);
				}
				if (connection === 'close') {
					if (!client[from]) return; 
					const reason = new Boom(lastDisconnect?.error)?.output.statusCode
					console.log(reason)
					if ([DisconnectReason.connectionLost, DisconnectReason.connectionClosed, DisconnectReason.restartRequired, DisconnectReason.timedOut, DisconnectReason.badSession, DisconnectReason.connectionReplaced].includes(reason)) {
						JadiBot(conn, from, m, store)
					} else if (reason === DisconnectReason.loggedOut) {
						m.reply('Scan again and Run...');
						StopJadiBot(conn, from, m)
					} else if (reason === DisconnectReason.Multidevicemismatch) {
						m.reply('Scan again...');
						StopJadiBot(conn, from, m)
					} else {
						m.reply('ANDA SUDAH KELUAR DARI SESI')
					}
				}
				if (connection == 'open') {
					let botNumber = await client[from].decodeJid(client[from].user.id);
					// DIPERBAIKI: Mengganti BossRAEHAN ke global.db agar tidak undefined crash
					if (global.db?.set?.[botNumber] && !global.db.set[botNumber].join) {
						global.db.set[botNumber].original = false;
						global.db.set[botNumber].join = true;
					}
				}
				if (receivedPendingNotifications == 'true') {
					client[from].ev.flush()
				}
			});
			
			client[from].ev.on('messages.upsert', async (message) => {
				await MessagesUpsert(client[from], message, store);
			});
		
			return client[from]
		} catch (e) {
			console.log(chalk.redBright(`[ERROR] ${e}`))
		}
	}
	return startJadiBot()
}

async function StopJadiBot(conn, from, m) {
	if (!client[from]) {
		return conn.sendMessage(m.chat, { text: 'ANDA SUDAH KELUAR DARI SESI!' }, { quoted: m })
	}
	try {
		const sock = client[from];
		delete client[from];
		sock.ev.removeAllListeners();
		sock.end(undefined);
	} catch (e) {
		console.log(chalk.redBright(`[ERROR] ${e}`))
	}
	
	exec(`rm -rf ./HANZ-DATA/${from}`, (err) => {
		if (err) console.log(chalk.redBright(`[ERROR RMDIR] ${err}`));
	});
	
	return m.reply('MENGHAPUS SESI SELESAI')
}

async function ListJadiBot(conn, m) {
	let teks = 'LIST PENGGUNA:\n\n'
	for (let jadibot of Object.values(client)) {
		teks += (jadibot.user?.id ? `- @${conn.decodeJid(jadibot.user.id).split('@')[0]}\n` : '')
	}
	return m.reply(teks)
}

export { JadiBot, StopJadiBot, ListJadiBot };
