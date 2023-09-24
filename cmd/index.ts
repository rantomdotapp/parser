import dotenv from 'dotenv';
import yargs from 'yargs/yargs';

import { GetlogCommand } from './commands/getlog';
import { ServeCommand } from './commands/serve';

(async function () {
  dotenv.config();

  const serveCmd = new ServeCommand();
  const getlogCmd = new GetlogCommand();

  yargs(process.argv.slice(2))
    .scriptName('rantom')
    .command(serveCmd.name, serveCmd.describe, serveCmd.setOptions, serveCmd.execute)
    .command(getlogCmd.name, getlogCmd.describe, getlogCmd.setOptions, getlogCmd.execute)
    .help().argv;
})();
