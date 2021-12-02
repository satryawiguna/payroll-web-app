/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {format} from 'date-fns';

export const DB_DATE_FORMAT = 'yyyy-MM-dd';
export const DB_TIME_FORMAT = 'HH:mm:ss';
export const DB_DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const DISPLAY_DATE_FORMAT = 'dd-MMM-yyyy';
export const DATE_PICKER_HEADER_FORMAT = 'E, MMM dd';

export function formatDate(date: Date | undefined, pattern: string = DISPLAY_DATE_FORMAT): string | undefined {
  if (date == null) return undefined;
  return format(date, pattern);
}

export function today(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}
