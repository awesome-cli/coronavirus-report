#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import fetch from 'node-fetch';
import chalk from 'chalk';
import td from 'two-digit';

import { spinner } from './utils/spinner';

import { COVID_API_ENDPOINT } from './constants';

// TODO move to utils
import { getCountry } from './commands/getCountry';

import { Results } from './types/results';

const pkg = require(path.join(__dirname, '../package.json'));

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[countries...]')
  // TODO extract interface
  .action(async ({ args }: { args: string[] }) => {
    // TODO move Globally to const
    const places = args.length ? args : ['Globally'];

    const results = await Promise.all(
      // TODO separate function
      places.map(async (place) => {
        spinner.text = 'Checking report';
        spinner.start();

        try {
          const countryInfo = await getCountry(place);

          // TODO update condition
          if (countryInfo === undefined && place !== 'Globally') {
            throw new Error(`Country \`${place}\` not found in JHU database`);
          }

          const res = await fetch(
            // TODO create util
            `${COVID_API_ENDPOINT}${
              place !== 'Globally' ? `/countries/${countryInfo?.name}` : ''
            }`
          );

          if (!res.ok) {
            throw new Error('Failed to fetch data');
          }

          const data = await res.json();

          // TODO move to finally
          spinner.stop();

          if (data.error) {
            throw new Error(data.error.message);
          }

          const date = new Date(data.lastUpdate);

          return {
            place: countryInfo?.name ?? place,
            // TODO destruct
            confirmed: `Confirmed: ${data.confirmed.value}`,
            // TODO destruct
            recovered: `Recovered: ${data.recovered.value}`,
            // TODO destruct
            deaths: `Deaths: ${data.deaths.value}`,
            // TODO refactor
            // TODO use Intl
            update: `Last update: ${date.getFullYear()}.${td(
              date.getMonth() + 1
              // TODO refactor
              // TODO use Intl
            )}.${td(date.getDate())}, ${td(date.getHours())}:${td(
              date.getMinutes()
            )}`,
          };
          // TODO add error handling
        } catch {
          // TODO move to finally
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
        // TODO separate function
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
