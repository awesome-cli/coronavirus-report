#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import fetch from 'node-fetch';

import { spinner } from './functions/spinner';

const pkg = require(path.join(__dirname, '../package.json'));

program
  .version(pkg.version)
  .description(pkg.description)
  .action(async ({ args }: { args: string[] }) => {
    spinner.text = 'Checking report';
    spinner.start();

    try {
      const res = await fetch(
        `https://covid19.mathdro.id/api/countries/${args[0]}`
      );

      const data = await res.json();

      spinner.stop();

      const date = new Date(data.lastUpdate);

      console.log(
        chalk.bold.blueBright(`${args[0][0].toUpperCase()}${args[0].slice(1)}`)
      );

      console.log(chalk.yellow(`Confirmed: ${data.confirmed.value}`));
      console.log(chalk.green(`Recovered: ${data.recovered.value}`));
      console.log(chalk.red(`Deaths: ${data.deaths.value}`));

      console.log('');

      console.log(
        `Last Update: ${date.getFullYear()}.${date.getMonth() +
          1}.${date.getDate()}`
      );
    } catch {
      spinner.fail(chalk.red('Unable to get report'));
    }
  });

program.on('--help', () => {
  console.log(
    chalk.whiteBright(
      figlet.textSync('Coronavirus\nreport', {
        horizontalLayout: 'full',
        verticalLayout: 'full',
      })
    )
  );
});

program.parse(process.argv);
