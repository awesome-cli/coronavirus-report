#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import fetch from 'node-fetch';
import chalk from 'chalk';
import td from 'two-digit';

import { spinner } from './functions/spinner';

import { endpoint } from './utils';

import { getCountry } from './commands/getCountry';

import { Results } from './interfaces/results';

const pkg = require(path.join(__dirname, '../package.json'));

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[countries...]')
  .action(async ({ args }: { args: string[] }) => {
    const places = args.length ? args : ['Globally'];

    const results = await Promise.all(
      places.map(async (place) => {
        spinner.text = 'Checking report';
        spinner.start();

        try {
          const countryInfo = await getCountry(place);

          if (countryInfo === undefined && place !== 'Globally') {
            return { error: `Country \`${place}\` not found in JHU database` };
          }

          const res = await fetch(
            `${endpoint}${
              place !== 'Globally' ? `/countries/${countryInfo?.name}` : ''
            }`
          );

          const data = await res.json();

          spinner.stop();

          if (data.error) {
            return { error: data.error.message };
          }

          const date = new Date(data.lastUpdate);

          return {
            place: countryInfo?.name ?? place,
            confirmed: `Confirmed: ${data.confirmed.value}`,
            recovered: `Recovered: ${data.recovered.value}`,
            deaths: `Deaths: ${data.deaths.value}`,
            update: `Last update: ${date.getFullYear()}.${td(
              date.getMonth() + 1
            )}.${td(date.getDate())}, ${td(date.getHours())}:${td(
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

        if (index !== results.length - 1) {
          console.log('');
        }
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
