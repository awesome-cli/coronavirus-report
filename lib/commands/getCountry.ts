import fetch from 'node-fetch';

import { API_ENDPOINT } from '../constants';

interface RootObject {
  readonly countries: Country[];
}

interface Country {
  readonly name: string;
  readonly iso2?: string;
  readonly iso3?: string;
}

export const getCountry = async (name: string) => {
  try {
    const res = await fetch(`${API_ENDPOINT}/countries`);

    const { countries }: RootObject = await res.json();

    return countries.find((country: any) => {
      for (const key in country) {
        if (country[key].toLowerCase() === name.toLowerCase()) {
          return country;
        }
      }
    });
  } catch (err) {
    throw err;
  }
};
