import fetch from 'node-fetch';

import { API_ENDPOINT } from '../constants';

export const getToday = async (country?: any) => {
  try {
    const res = await fetch(
      `${API_ENDPOINT}/${country ? `countries/${country}` : ''}`
    );

    const data = await res.json();

    // console.log(data);

    return data;
  } catch (err) {
    // console.log(err);
    return { error: err };
  }
};
