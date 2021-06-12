#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';

import { spinner } from './config/spinner';

import { interactiveMode, Options } from './commands/interactiveMode';
import { getByDate } from './commands/getByDate';
import { getToday } from './commands/getToday';

import Params from './interfaces/Params';

import { Statistic } from './enums/Statistic';

const pkg = require(path.join(__dirname, '../package.json'));

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[countries...] [options]')
  .option('-i, --interactive', 'display interactive form')
  .option('-a, --all', 'display summarized stats')
  .option('-d, --date [date]', 'report for given date')
  .option('-g, --growth', 'display growth')
  .action(async (params: Params) => {
    const {
      interactive,
      all: displayAllStats,
      date: statsForDate,
      growth: displayDailyGrowth,
      args: countries,
    } = params;

    let options = {} as Options;

    if (interactive) {
      options = await interactiveMode();
    } else {
      if (countries.length) {
        options.statistics = Statistic.GivenCountry;
        options.countries = countries;
      } else {
        options.statistics = Statistic.Globally;
      }

      options.all = displayAllStats;
      options.growth = displayDailyGrowth;

      if (statsForDate) {
        options.date = new Date(statsForDate);
      } else {
        options.date = new Date();
      }
    }

    // console.log(options.date);

    // const data = await getToday(options.countries[0]);
    const data = await getByDate(options.date);

    console.log(data.find((item: any) => item.countryRegion === 'Poland'));

    let theDayBeforeStats = {} as any;

    if (options.growth || options.all) {
      const dayBefore = new Date();

      if (options.date) {
        dayBefore.setDate(options.date.getDate() - 1);
      } else {
        dayBefore.setDate(dayBefore.getDate() - 1);
      }

      // console.log(dayBefore);

      theDayBeforeStats = await getByDate(dayBefore);

      // console.log(theDayBeforeStats);
    }

    spinner.text = 'Checking report';
    spinner.start();

    spinner.stop();
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
