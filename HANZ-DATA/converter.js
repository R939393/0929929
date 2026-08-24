import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getRandomFile = (ext) => `${crypto.randomBytes(6).toString('hex')}.${ext}`;

async function ffmpeg(media, args = [], ext = '', ext2 = '') {
	const isPath = typeof media === 'string';
	const tmp = isPath ? media : path.join(__dirname, '../HANZ-DATA', getRandomFile(ext));
	const out = path.join(__dirname, '../HANZ-DATA', getRandomFile(ext2));
	try {
		if (!isPath) await fs.promises.writeFile(tmp, media);
		return await new Promise((resolve, reject) => {
			spawn('ffmpeg', ['-y', '-i', tmp, ...args, out])
				.on('error', reject)
				.on('close', (code) => {
					if (code !== 0) return reject(new Error(`FFmpeg exited with code ${code}`));
					resolve(out);
				});
		});
	} catch (e) {
		if (fs.existsSync(out)) fs.unlinkSync(out);
		throw e;
	} finally {
		if (!isPath && fs.existsSync(tmp)) fs.unlinkSync(tmp);
	}
}

async function ffmpeg2(media, args = [], ext = '', ext2 = '') {
	const isPath = typeof media === 'string';
	const tmp = isPath ? media : path.join(__dirname, '../HANZ-DATA', getRandomFile(ext));
	const out = path.join(__dirname, '../HANZ-DATA', getRandomFile(ext2));
	try {
		if (!isPath) await fs.promises.writeFile(tmp, media);
		await new Promise((resolve, reject) => {
			spawn('ffmpeg', ['-y', '-i', tmp, ...args, out])
				.on('error', reject)
				.on('close', (code) => {
					if (code !== 0) return reject(new Error(`FFmpeg exited with code ${code}`));
					resolve(true);
				});
		});
		const resultBuffer = await fs.promises.readFile(out);
		return resultBuffer;
	} catch (e) {
		throw e;
	} finally {
		if (!isPath && fs.existsSync(tmp)) fs.unlinkSync(tmp);
		if (fs.existsSync(out)) fs.unlinkSync(out);
	}
}

function toAudio(media, ext) {
	return ffmpeg(media, ['-vn', '-ac', '2', '-b:a', '128k', '-ar', '44100', '-f', 'mp3'], ext, 'mp3');
}

function toPTT(media, ext) {
	return ffmpeg2(media, ['-vn', '-c:a', 'libopus', '-b:a', '128k', '-vbr', 'on', '-compression_level', '10'], ext, 'opus');
}

function toVideo(media, ext) {
	return ffmpeg(media, ['-c:v', 'libx264', '-c:a', 'aac', '-ab', '128k', '-ar', '44100', '-crf', '32', '-preset', 'slow'], ext, 'mp4');
}

export {
	toAudio,
	toPTT,
	toVideo,
	ffmpeg,
	ffmpeg2
};