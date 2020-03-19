#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import fetch from 'node-fetch';
import chalk from 'chalk';
import dd from 'double-digit';

import { spinner } from './functions/spinner';

import { Results } from './types/results';

const pkg = require(path.join(__dirname, '../package.json'));

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[country]')
  .action(async ({ args }: { args: string[] }) => {
    const places = args.length ? args : ['globally'];

    const results = await Promise.all(
      places.map(async place => {
        spinner.text = 'Checking report';
        spinner.start();

        try {
          const res = await fetch(
            `https://covid19.mathdro.id/api${
              place !== 'globally' ? `/countries/${place}` : ''
            }`
          );

          const data = await res.json();

          spinner.stop();

          if (data.error) {
            return { error: data.error.message };
          }

          const date = new Date(data.lastUpdate);

          return {
            place: `${place[0].toUpperCase()}${place.slice(1)}`,
            confirmed: `Confirmed: ${data.confirmed.value}`,
            recovered: `Recovered: ${data.recovered.value}`,
            deaths: `Deaths: ${data.deaths.value}`,
            update: `Last update: ${date.getFullYear()}.${dd(
              date.getMonth() + 1
            )}.${dd(date.getDate())}, ${dd(date.getHours())}:${dd(
              date.getMinutes()
            )}`,
          };
        } catch {
          spinner.stop();

          return { error: 'Unable to get report' };
        }
      })
    );

    results.map(
      (
        { place, confirmed, recovered, deaths, update, error }: Results,
        index
      ) => {
        if (error) {
          spinner.fail(chalk.red(error));
        } else {
          console.log(chalk.bold.blueBright(place));

          console.log(chalk.yellow(confirmed));
          console.log(chalk.green(recovered));
          console.log(chalk.red(deaths));

          console.log('');

          console.log(update);
        }

        if (index !== results.length - 1) console.log('');
      }
    );
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
