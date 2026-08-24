import path from 'path';
import chalk from 'chalk';
import { createRequire } from 'module';
import { jidNormalizedUser } from 'baileys';
import { updateSettings } from '../HANZ-DATA/function.js';
import { io } from 'socket.io-client';

const require = createRequire(import.meta.url);
const packageInfo = require('../package.json');


async function setupDashboard(database, storeDB, RAEHAN2GD) {
		transports: ['websocket']}

	
	


export { setupDashboard };
