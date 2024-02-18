#!/usr/bin/env node
import { start } from './app.ts';
import { Command } from 'commander';
import { default as data } from '../package.json';

/**
 * This is our production executable. Do NOT use any sort of
 * .env variables here, the enviornment should be defined by
 * the software managing the container runtime.
 **/

const program = new Command();
program.description(`${data.description}\n\n Homepage: ${data.homepage}`);

program
  .command('version')
  .description('output the version number')
  .action(() => {
    console.log(data.version);
  });

program
  .command('start')
  .description('start up service')
  .action(async () => {
    start();
  });

program.parse();
