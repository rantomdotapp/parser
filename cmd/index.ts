import dotenv from 'dotenv';
import yargs from 'yargs/yargs';

import { ServeCommand } from './commands/serve';

(async function () {
  dotenv.config();

  const serveCmd = new ServeCommand();

  yargs(process.argv.slice(2))
    .scriptName('rantom')
    .command(serveCmd.name, serveCmd.describe, serveCmd.setOptions, serveCmd.execute)
    .help().argv;
})();
