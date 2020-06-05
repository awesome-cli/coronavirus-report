import fetch from 'node-fetch';
import { API_ENDPOINT } from '../constants';

// export const countGrowth = async ({ date }: any) => {
// try {
//   const res = await fetch(`${API_ENDPOINT}/daily/${date}`);
//   const data = await res.json();
//   return data;
//   // console.log(data);
// } catch (err) {
//   return { error: err };
// }
// };

export const countGrowth = (data: any, previousDayData: any) => {};
