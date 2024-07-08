import { getDay } from 'date-fns';

export const roundUp = (num: number): number => Math.ceil(num * 100) / 100;

export const isFreeOfChargeDay = (date: string): boolean => {
  const dayOfWeek = getDay(new Date(date));
  return dayOfWeek >= 0 && dayOfWeek <= 6;
};
