#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import fetch from 'node-fetch';
import chalk from 'chalk';
import dd from 'double-digit';

import { spinner } from './functions/spinner';

const pkg = require(path.join(__dirname, '../package.json'));

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[country]')
  .action(async ({ args }: { args: string[] }) => {
    spinner.text = 'Checking report';
    spinner.start();

    try {
      const res = await fetch(
        `https://covid19.mathdro.id/api${
          args.length ? `/countries/${args[0]}` : ''
        }`
      );

      const data = await res.json();

      if (data.error) {
        spinner.fail(chalk.red(data.error.message));

        process.exit();
      }

      spinner.stop();

      const date = new Date(data.lastUpdate);

      console.log(
        chalk.bold.blueBright(
          args.length
            ? `${args[0][0].toUpperCase()}${args[0].slice(1)}`
            : 'Globally'
        )
      );

      console.log(chalk.yellow(`Confirmed: ${data.confirmed.value}`));
      console.log(chalk.green(`Recovered: ${data.recovered.value}`));
      console.log(chalk.red(`Deaths: ${data.deaths.value}`));

      console.log('');

      console.log(
        `Last update: ${date.getFullYear()}.${dd(date.getMonth() + 1)}.${dd(
          date.getDate()
        )}, ${dd(date.getHours())}:${dd(date.getMinutes())}`
      );
    } catch {
      spinner.fail(chalk.red('Unable to get report'));

      process.exit();
    }
  });

program.on('--help', () => {
  console.log(
    chalk.grey(
      figlet.textSync('Coronavirus\nreport', {
        horizontalLayout: 'full',
        verticalLayout: 'full',
      })
    )
  );
});

program.parse(process.argv);
