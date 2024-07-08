import 'module-alias/register';

const dotenv = require('dotenv')
dotenv.config();

(global as any).mochaTimeout = 5000;