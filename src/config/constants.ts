/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {parseISO} from 'date-fns';

export const BUILD_VERSION = '0.1.0';
export const BUILD_YEAR = 2021;

export const DEFAULT_PER_PAGE = 10; // Jumlah row per page
export const PAGES_TO_SHOW = 7; // Jumlah halaman yang ditampilkan

export const BOT = parseISO('1000-01-01');
export const EOT = parseISO('9000-12-31');

export enum COMPONENT_NAME {
  ELEMENT_CLASSIFICATION = 'pay-element-classification',
  PAYROLL_GROUP = 'pay-group',
  SALARY_BASIS = 'pay-salary-basis',
  PAYROLL_ELEMENT = 'pay-element',
  PAYROLL_INPUT_VALUE = 'pay-input-value',
  PAYROLL_FORMULA = 'pay-formula',
  PAYROLL_FORMULA_RESULT = 'pay-formula-result',
  PAYROLL_BALANCE = 'pay-balance',
  PAYROLL_BALANCE_FEED = 'pay-balance-feed',
  ELEMENT_LINK = 'pay-element-link',
  ELEMENT_LINK_VALUE = 'pay-element-link-value',
  PAYROLL_ENTRY = 'pay-per-entry',
  PAYROLL_ENTRY_VALUE = 'pay-per-entry-value',
  PAYROLL_PROCESS = 'pay-process',
}
