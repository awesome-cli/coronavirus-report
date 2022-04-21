import fetch from 'node-fetch';

import { COVID_API_ENDPOINT } from '../constants';

export const getCountry = async (name: string) => {
  // TODO move to util
  const res = await fetch(`${COVID_API_ENDPOINT}/countries`);

  const { countries } = await res.json();

  // TODO no any
  // TODO refactor, for -> map
  return countries.find((country: Record<string, any>) => {
    for (const key in country) {
      if (country[key].toLowerCase() === name.toLowerCase()) {
        return country;
      }
    }
  });
};
