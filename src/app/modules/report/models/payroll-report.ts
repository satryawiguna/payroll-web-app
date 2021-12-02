/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

export type PayslipData = {
  earnings: PayslipGroup[],
  deductions: PayslipGroup[],
};

export type PayslipGroup = {
  group_name: string,
  items: PayslipItem[]
};

export type PayslipItem = {
  label: string,
  description: string,
  division: number,
  division_type: string,
  pay_value: number,
};
