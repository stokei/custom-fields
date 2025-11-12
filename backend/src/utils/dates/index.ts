import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import isSameOrAfterPlugin from 'dayjs/plugin/isSameOrAfter';
import isSameOrBeforePlugin from 'dayjs/plugin/isSameOrBefore';
import localizedFormatPlugin from 'dayjs/plugin/localizedFormat';
import timezonePlugin from 'dayjs/plugin/timezone';
import utcPlugin from 'dayjs/plugin/utc';

dayjs.extend(isBetweenPlugin);
dayjs.extend(isSameOrAfterPlugin);
dayjs.extend(isSameOrBeforePlugin);
dayjs.extend(localizedFormatPlugin);
dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

export const convertToISOTimestamp = (date: Date | number | string): number => {
  if (date instanceof Date) {
    return date.getTime();
  }
  return dayjs(date).toDate().getTime();
};

export const convertToISODateString = (
  date: Date | number | string,
): string => {
  return dayjs(date).toISOString();
};

export const convertToISODate = (date: Date | number | string): Date => {
  let currentDate: Date = date as Date;
  if (!(date instanceof Date)) {
    currentDate = new Date(currentDate);
  }
  return dayjs(currentDate.toISOString()).toDate();
};

export const isExpiredDate = (date: Date | number | string): boolean => {
  const now = dayjs(Date.now());
  const dateToCompare = dayjs(date);
  return now.isAfter(dateToCompare);
};

export const addSeconds = (
  seconds: number,
  startAt?: string | number | Date,
) => {
  const date = dayjs(startAt || Date.now());
  if (!seconds) {
    return date.toDate();
  }
  return date.add(seconds, 'second').toDate();
};

export const addMinutes = (
  minutes: number,
  startAt?: string | number | Date,
) => {
  const date = dayjs(startAt || Date.now());
  if (!minutes) {
    return date.toDate();
  }
  return date.add(minutes, 'minute').toDate();
};

export const addHours = (hours: number, startAt?: string | number | Date) => {
  const date = dayjs(startAt || Date.now());
  if (!hours) {
    return date.toDate();
  }
  return date.add(hours, 'hour').toDate();
};

export const addDays = (days: number, startAt?: string | number | Date) => {
  const date = dayjs(startAt || Date.now());
  if (!days) {
    return date.toDate();
  }
  return date.add(days, 'day').toDate();
};

export const addWeeks = (weeks: number, startAt?: string | number | Date) => {
  const date = dayjs(startAt || Date.now());
  if (!weeks) {
    return date.toDate();
  }
  return date.add(weeks, 'week').toDate();
};

export const addMonths = (months: number, startAt?: string | number | Date) => {
  const date = dayjs(startAt || Date.now());
  if (!months) {
    return date.toDate();
  }
  return date.add(months, 'month').toDate();
};

export const addQuarters = (
  quarters: number,
  startAt?: string | number | Date,
) => {
  const date = dayjs(startAt || Date.now());
  if (!quarters) {
    return date.toDate();
  }
  return date.add(quarters * 3, 'months').toDate();
};

export const addYears = (years: number, startAt?: string | number | Date) => {
  const date = dayjs(startAt || Date.now());
  if (!years) {
    return date.toDate();
  }
  return date.add(years, 'year').toDate();
};

export { dayjs };
