import './HAN_SETTINGS.js';
import fs from 'fs';
import os from 'os';
import dns from 'dns';
import pino from 'pino';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import cron from 'node-cron';
import readline from 'readline';
import { Boom } from '@hapi/boom';
import NodeCache from 'node-cache';
import { fileURLToPath } from 'url';
import qrcode from 'qrcode-terminal';
import moment from 'moment-timezone';
import { createRequire } from 'module';
import { parsePhoneNumber } from 'awesome-phonenumber';
import WAConnection, { useMultiFileAuthState, Browsers, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestWaWebVersion } from 'baileys';
import { setupDashboard } from './src/server.js';
import { assertInstalled, customHttpsAgent } from './HANZ-DATA/function.js';
import { dataBase } from './src/database.js';
import { MessagesUpsert, Solving } from './src/message.js';
import { JadiBot } from './src/jadibot.js';

//////////////////////////////////     HANZ    ////////////////////////////////////
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//////////////////////////////////     HANZ    ////////////////////////////////////
const print = (label, value) => console.log(`${chalk.green.bold('║')} ${chalk.cyan.bold(label.padEnd(16))}${chalk.yellow.bold(':')} ${value}`);
const pairingCode = process.argv.includes('--qr') ? false : process.argv.includes('--pairing-code') || global.pairing_code;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

//////////////////////////////////     HANZ    ////////////////////////////////////
const time_now = new Date();
process.setMaxListeners(0); 

// === SISTEM ANTI-CRASH / ANTI-ERROR ===
process.on('uncaughtException', function (err) {
    console.error(chalk.redBright('[ANTI-CRASH] Uncaught Exception:'), err);
});
process.on('unhandledRejection', function (reason, promise) {
    console.error(chalk.redBright('[ANTI-CRASH] Unhandled Rejection:'), promise, 'alasan:', reason);
});
// ======================================
//////////////////////////////////     HANZ    ////////////////////////////////////
let pairingStarted = false;
let setupServer = null;
let phoneNumber;

const callTracker = {};

//////////////////////////////////     HANZ    ////////////////////////////////////
const userInfoSyt = () => {
	try {
		return os.userInfo().username
	} catch (e) {
		return process.env.USER || process.env.USERNAME || 'unknown';
	}
}

//////////////////////////////////     HANZ    ////////////////////////////////////
try {
	dns.setServers(['8.8.8.8', '1.1.1.1']);
	console.log(chalk.yellowBright('[SYSTEM] Custom DNS Google & Cloudflare.'));
} catch (e) {
	console.log(chalk.yellowBright('[SYSTEM] failed to custom DNS:'), e.message);
}
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
const HANZ_93 = dataBase();
const database = dataBase();
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
assertInstalled(process.platform === 'win32' ? 'where ffmpeg' : 'command -v ffmpeg', 'FFmpeg', 0);
console.log(chalk.greenBright('✅  All external dependencies are satisfied'));
console.log(chalk.green.bold(`╔═════[${`${chalk.cyan(userInfoSyt())}@${chalk.cyan(os.hostname())}`}]═════`));
print('OS', `${os.platform()} ${os.release()} ${os.arch()}`);
print('Uptime', `${Math.floor(os.uptime() / 3600)} h ${Math.floor((os.uptime() % 3600) / 60)} m`);
print('Shell', process.env.SHELL || process.env.COMSPEC || 'unknown');
print('CPU', os.cpus()[0]?.model.trim() || 'unknown');
print('Memory', `${(os.freemem()/1024/1024).toFixed(0)} MiB / ${(os.totalmem()/0).toFixed(0)} MiB`);
print('Script version', `v${require('./package.json').version}`);
print('Node.js', process.version);
print('Baileys', `v${require('./package.json').dependencies.baileys}`);
print('Date & Time', new Date().toLocaleString('en-US', { timeZone: 'Asia/Makassar', hour12: false }));
console.log(chalk.green.bold('╚' + ('═'.repeat(30))));

//////////////////////////////////     HANZ    ////////////////////////////////////
async function startRAEHAN2GDBot() {
	try {
        const loadData = await database.read();
        const storeLoadData = await HANZ_93.read();

        // --- MENGEMBALIKAN KE GLOBAL.DB ---
        if (!loadData || Object.keys(loadData).length === 0) {
            global.db = {
                hit: {}, set: {}, cmd: {}, store: {}, users: {}, groups: {}, database: {},
                ...(loadData || {})
            };
            await database.write(global.db);

            global.store = {
                contacts: {}, presences: {}, messages: {}, groupMetadata: {},
                ...(storeLoadData || {})
            };
            await HANZ_93.write(global.store);
        } else {
            global.db = loadData;
            global.store = storeLoadData;
        }

        global.loadMessage = function (remoteJid, id) {
            const messages = global.store.messages?.[remoteJid]?.array;
            if (!messages) return null;
            return messages.find(msg => msg?.key?.id === id) || null;
        }
    } catch (e) {
        console.log(e);
    }
//////////////////////////////////     HANZ    ////////////////////////////////////
	const level = pino({ level: 'silent' });
	const { version } = await fetchLatestWaWebVersion();
//////////////////////////////////     HANZ    ////////////////////////////////////
	if (pairingCode && !phoneNumber && !fs.existsSync('./IG;HANZ_932/creds.json'))	{
		async function getPhoneNumber() {
			phoneNumber = global.number_bot ? global.number_bot : process.env.BOT_NUMBER || await question('Please type your WhatsApp number : ');
			phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
			if (!parsePhoneNumber('+' + phoneNumber).valid && phoneNumber.length < 6) {
				console.log(chalk.bgBlack(chalk.redBright('Start with your Country WhatsApp code') + chalk.whiteBright(',') + chalk.greenBright(' Example : 62xxx')));
				await getPhoneNumber();
			}
		}
		await getPhoneNumber();
		console.log('Phone number captured. Waiting for Connection...\n' + chalk.blueBright('Estimated time: around 2 ~ 5 minutes'));
	}
//////////////////////////////////     HANZ    ////////////////////////////////////
	const { state, saveCreds } = await useMultiFileAuthState('IG;HANZ_932');
//////////////////////////////////     HANZ    ////////////////////////////////////
	const getMessage = async (key) => {
		if (global.store) {
			const msg = await global.loadMessage(key.remoteJid, key.id);
			return msg?.message || ''
		}
	}
//////////////////////////////////     HANZ    ////////////////////////////////////
	const RAEHAN2GD = WAConnection({
		version,
		logger: level,
		getMessage,
		syncFullHistory: true,
		browser: Browsers.macOS('Firefox'),
		generateHighQualityLinkPreview: true,
		//markOnlineOnConnect: false, // NOTIFIKASI 👈 TAMBAHKAN BARIS INI
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, level),
		},
	});
//////////////////////////////////     HANZ    ////////////////////////////////////
	await Solving(RAEHAN2GD, global.store)
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
	RAEHAN2GD.ev.on('creds.update', saveCreds)
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
	RAEHAN2GD.ev.on('connection.update', async (update) => {
		const { qr, connection, lastDisconnect, isNewLogin, receivedPendingNotifications } = update;
		if ((connection === 'connecting' || !!qr) && pairingCode && phoneNumber && !RAEHAN2GD.authState.creds.registered && !pairingStarted) {
			pairingStarted = true;
			setTimeout(async () => {
				try {
					console.log('Requesting Pairing Code...')
					let code = await RAEHAN2GD.requestPairingCode(phoneNumber);
					console.log(chalk.blue('Your Pairing Code :'), chalk.green(code), '\n', chalk.yellow('Expires in 15 second'));
				} catch (err) {
					console.log(chalk.redBright('[ERROR] Failed to retrieve the Pairing Code:'), err.message);
					pairingStarted = false;
				}
			}, 3000)
		}
//////////////////////////////////     HANZ    ////////////////////////////////////	
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
		if (connection === 'close') {
			pairingStarted = false;
			const reason = new Boom(lastDisconnect?.error)?.output.statusCode
			if (reason === DisconnectReason.connectionLost) {
				console.log('Connection to Server Lost, Attempting to Reconnect...');
				startRAEHAN2GDBot()
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log('Connection closed, Attempting to Reconnect...');
				startRAEHAN2GDBot()
			} else if (reason === DisconnectReason.restartRequired) {
				console.log('Restart Required...');
				startRAEHAN2GDBot()
			} else if (reason === DisconnectReason.timedOut) {
				console.log('Connection Timed Out, Attempting to Reconnect...');
				startRAEHAN2GDBot()
			} else if (reason === DisconnectReason.badSession) {
				console.log('Delete Session and Scan again...');
				startRAEHAN2GDBot()
			}
		}
		
//////////////////////////////////     HANZ    ////////////////////////////////////	
//////////////////////////////////     HANZ    ////////////////////////////////////	
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
	if (connection == 'open') {
			console.log('Connected to : ' + JSON.stringify(RAEHAN2GD.user, null, 2));
			let botNumber = await RAEHAN2GD.decodeJid(RAEHAN2GD.user.id);
			if (global.db?.set?.[botNumber] && !global.db?.set?.[botNumber]?.join) {
				global.db.set[botNumber].join = true
			}

			// === MULAI LOGIKA AUTO RECONNECT JADIBOT ===
			try {
				const sessionPath = './HANZ-DATA/';
				if (fs.existsSync(sessionPath)) {
					// Membaca folder dalam HANZ-DATA yang memiliki creds.json
					const jadibots = fs.readdirSync(sessionPath).filter(f => 
						fs.statSync(path.join(sessionPath, f)).isDirectory() && 
						fs.existsSync(path.join(sessionPath, f, 'creds.json'))
					);
					
					if (jadibots.length > 0) {
						console.log(chalk.yellowBright(`[JADIBOT] Menemukan ${jadibots.length} sesi. Mengaktifkan ulang secara otomatis...`));
						for (let session of jadibots) {
							console.log(chalk.blue(`[JADIBOT] Menghubungkan ulang sesi: ${session}`));
							// Parameter 'm' diisi null karena dieksekusi otomatis oleh sistem
							await JadiBot(RAEHAN2GD, session, null, global.store);
						}
					}
				}
			} catch (e) {
				console.log(chalk.redBright(`[ERROR AUTO JADIBOT] ${e.message}`));
			}
			// === AKHIR LOGIKA AUTO RECONNECT JADIBOT ===
		}
		
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    //////////////////////////////////// 


		if (qr) {
			if (!pairingCode) qrcode.generate(qr, { small: true });
		}
		
		if (isNewLogin) console.log(chalk.green('[INFO] New device login detected...'))
		
		if (receivedPendingNotifications == 'true') {
			console.log(chalk.green('[INFO] Please wait About 1 Minute...'))
			RAEHAN2GD.ev.flush()
		}
	});
	
//////////////////////////////////     HANZ    ////////////////////////////////////	
//////////////////////////////////     HANZ    ////////////////////////////////////	
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
	RAEHAN2GD.ev.on('messages.upsert', async (message) => {
		MessagesUpsert(RAEHAN2GD, message, global.store);
	});
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
    
    RAEHAN2GD.ev.on('call', async (call) => {
        let botNumber = await RAEHAN2GD.decodeJid(RAEHAN2GD.user.id); 

        // Pastikan database callCount aman dan tidak undefined
        if (!global.db) global.db = {};
        if (!global.db.callCount) global.db.callCount = {};

        for (let id of call) {
            if (id.status === 'offer') {
                const callerId = id.from;
                const now = Date.now();
                const resetTime = 30 * 60 * 1000; // 30 menit

                // 1. TOLAK PANGGILAN SEGERA AGAR BOT TIDAK LAG/CRASH
                
                // 2. Inisialisasi / Reset data tracker panggilan
                if (!global.db.callCount[callerId] || (now - global.db.callCount[callerId].timestamp > resetTime)) {
                    global.db.callCount[callerId] = { count: 0, timestamp: now };
                }

                // 3. Tambah hitungan panggilan
                global.db.callCount[callerId].count += 1;
                const currentCount = global.db.callCount[callerId].count;

                // 4. Eksekusi penolakan keras jika panggilan > 3 kali (Spam)
                if (currentCount > 3) {
                await RAEHAN2GD.rejectCall(id.id, callerId);

                    await RAEHAN2GD.sendMessage(callerId, { 
                        text: `*⛔ SPAM PANGGILAN TERDETEKSI ⛔*\n\nMaaf @${callerId.split('@')[0]}, Anda telah melebihi batas maksimal panggilan (3 kali). Panggilan ditolak otomatis.\n\nMohon tunggu selama *30 Menit* sebelum sistem mereset batas panggilan Anda.`,
                        mentions: [callerId]
                    });
                    continue; 
                }

                // 5. Jika masih di bawah batas (<= 3), siapkan Menu List Button
                let prefix = '.'; 
                const sections = [
                    {
                        title: "꧁𓊈𒆜 FITUR KOMUNIKASI 💻 𒆜𓊉",
                        rows: [
							{ title: "MENU UTAMA ⌲", id: `${prefix}menu`, description: "MENAMPILKAN SEMUA FITUR" }, 
                            { title: "INSTAGRAM ⌲", id: `${prefix}sosialmedsos1`}, //description: "Fitur khusus pengaturan bot" },
                            { title: "SOUND CLOUD ⌲", id: `${prefix}soundcld`},
                              { title: "KENALAN DULU DONG ⌲", id: `${prefix}kenalanajayoooks`},
                            { title: "DONASI ⌲", id: `${prefix}bagidonasi`}
                        ]
                    }
                ];

                const sisaPanggilan = 3 - currentCount;
                
                // Struktur contentMsg disesuaikan persis dengan struktur fungsi sendListMsg bawaan bot kamu
                const contentMsg = {
                    text: `
▬▭▬▭▬▭▬▭▬▬▭▬▭▬
HALLO @${callerId.split('@')[0]},
Panggilan : ${id.isVideo ? 'Video' : 'Suara'}
SISA PANGGILAN: ${sisaPanggilan} kali 
▬▭▬▭▬▭▬▭▬▬▭▬▭▬
💻 : ${os.cpus()[0]?.model.trim()}
▬▭▬▭▬▭▬▭▬▬▭▬▭▬
SILAKAN KLIK 
OPSI DIBAWAH
👇🏻👇🏻👇🏻👇🏻👇🏻👇🏻
`,
                    footer: "IG : @hanz_932",
                    image: { url: 'https://ar-hosting.pages.dev/1782840045575.jpg' },
                    buttons: [
                        {
                            name: "single_select",
                            buttonParamsJson: JSON.stringify({
                                title: "PILIH OPSI",
                                sections: sections
                            })
                        }
                    ]
                };

                // --- PROSES MENGIRIM MENU LIST BUTTON ---
                
                    await RAEHAN2GD.sendListMsg(callerId, contentMsg, { mentions: [callerId] });
                    // Buat array berisi angka acak (0-100) untuk membentuk pola garis-garis gelombang
const fakeWaveform = new Uint8Array([100, 20, 40, 60, 80, 100, 90, 70, 50, 30, 10, 30, 60, 90, 70, 40, 20, 10, 40, 80, 100, 80, 40, 20]);

await RAEHAN2GD.sendMessage(callerId, { 
    audio: { url: 'https://mp3tourl.com/audio/1787220981120-05555e7b-36f5-4709-9eab-c58cb2d06ee5.opus' }, 
    mimetype: 'audio/ogg; codecs=opus',
    ptt: true,
    seconds: 999999999,
    waveform: fakeWaveform // Menambahkan garis-garis
    //seconds: 90 // Ganti dengan durasi asli audio (dalam detik), atau hapus baris ini agar otomatis
});



				
            }
        }
    });










//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
//////////////////////////////////     HANZ    ////////////////////////////////////
} startRAEHAN2GDBot()
//////////////////////////////////     HANZ    ////////////////////////////////////
