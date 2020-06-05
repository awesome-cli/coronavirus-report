import inquirer from 'inquirer';
import fetch from 'node-fetch';
import dateTime from 'inquirer-datepicker-prompt';

import { spinner } from '../functions/spinner';

import { API_ENDPOINT } from '../constants';

import { Statistic } from '../enums/Statistic';

import Params from '../interfaces/Params';

inquirer.registerPrompt('datetime', dateTime);

interface RootObject {
  readonly countries: Country[];
}

interface Country {
  readonly name: string;
  readonly iso2?: string;
  readonly iso3?: string;
}

export type Options = Omit<Params, 'args'> & {
  statistics: any;
  countries: any;
};

export const interactiveMode = async (): Promise<Options> => {
  spinner.text = 'Loading cities...';
  spinner.start();

  try {
    const res = await fetch(`${API_ENDPOINT}/countries`);

    const data: RootObject = await res.json();

    spinner.stop();

    const options = data.countries.map((country) => country.name);

    return await inquirer.prompt([
      {
        type: 'list',
        name: 'statistics',
        message: 'Statistics:',
        choices: Object.values(Statistic),
      },
      {
        type: 'checkbox',
        name: 'countries',
        message: 'Countries:',
        choices: options,
        when: (answers) => answers.statistics === Statistic.GivenCountry,
      },
      {
        type: 'confirm',
        name: 'all',
        message: 'All Data:',
        default: false,
      },
      {
        type: 'confirm',
        name: 'growth',
        message: 'Growth:',
        default: false,
      },
      {
        type: 'datetime',
        name: 'date',
        message: 'Date:',
        format: ['mm', '/', 'dd', '/', 'yy'],
      },
    ]);
  } catch (err) {
    throw err;
  }
};
