import fetch from 'node-fetch';
import td from 'two-digit';

import { API_ENDPOINT } from '../constants';

export const getByDate = async (date?: Date) => {
  // const isToday = true;

  const formatDate = () => {
    if (!date) {
      return '';
    }

    return `${td(date.getMonth() + 1)}-${td(
      date.getDate()
    )}-${date.getFullYear()}`;
  };

  console.log(formatDate());

  try {
    const res = await fetch(`${API_ENDPOINT}/daily/${formatDate()}`);

    const data = await res.json();

    // console.log(data);

    return data;
  } catch (err) {
    // console.log(err);
    return { error: err };
  }
};
