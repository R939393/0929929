import path from 'path';
import chalk from 'chalk';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { watchFile, unwatchFile } from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function start() {
	let args = [path.join(__dirname, '★HANZ★START★★★.js'), ...process.argv.slice(2)]
	let p = spawn(process.argv[0], args, {
		stdio: ['inherit', 'inherit', 'inherit', 'ipc']
	}).on('message', data => {
		if (data === 'reset') {
			console.log(chalk.yellow.bold('[ HANZ ] MEMULAI ULANG...'))
			p.kill()
			start()
		} else if (data === 'uptime') {
			p.send(process.uptime())
		}
	}).on('exit', code => {
		if (code !== 0) {
			console.error(chalk.red.bold(`[ HANZ ] ERORR: ${code}`))
			start()
		} 
	})
}
start()
