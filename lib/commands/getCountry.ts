import fetch from 'node-fetch';

import { endpoint } from '../utils';

export const getCountry = async (name: string) => {
  const res = await fetch(`${endpoint}/countries`);

  const { countries } = await res.json();

  return countries.find((country: Record<string, any>) => {
    for (const key in country) {
      if (country[key].toLowerCase() === name.toLowerCase()) {
        return country;
      }
    }
  });
};
