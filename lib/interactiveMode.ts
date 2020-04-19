import inquirer from 'inquirer';
import fetch from 'node-fetch';
// import dateTime from 'inquirer-datepicker-prompt';

import { endpoint } from './utils';

import { spinner } from './functions/spinner';

inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

export const interactiveMode = async () => {
  spinner.text = 'Loading cities...';
  spinner.start();

  try {
    const res = await fetch(`${endpoint}/countries`);

    const data = await res.json();

    spinner.stop();

    const options = data.countries.map((country: any) => country.name);

    return await inquirer.prompt([
      {
        type: 'list',
        name: 'statistics',
        message: 'Statistics:',
        choices: ['Globally', 'Given Country'],
      },
      {
        type: 'checkbox',
        name: 'countries',
        message: 'Countries:',
        choices: options,
      },
      {
        type: 'datetime',
        name: 'date',
        message: 'Date:',
        format: ['mm', '/', 'dd', '/', 'yy'],
      },
    ]);
  } catch (err) {}
};
