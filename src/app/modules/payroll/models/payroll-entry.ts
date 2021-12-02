/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {PageResponse} from 'app/core/models';
import {PayrollElementCbx} from 'app/modules/compensation-admin';

export type PayrollPerEntry = {
  employee_id?: number;
  employee_no?: string;
  employee_name?: string;

  gender_id?: number;
  gender_name?: string;
  religion_name?: string;
  marital_status?: string;
  child_count?: number;
  phone_no?: string;

  join_date?: Date;
  termination_date?: Date;

  department_id?: number;
  department_name?: string;
  project_id?: number;
  project_name?: string;
  office_id?: number;
  office_name?: string;
  location_id?: number;
  location_name?: string;
  position_id?: number;
  position_name?: string;
  grade_id?: number;
  grade_name?: string;
  pay_group_id?: string;
  pay_group_name?: string;
  people_group?: string;
  employee_category?: string;
  salary_basis_id?: string;
  basic_salary?: number;

  entries?: PayrollEntry[];
};

export type PayrollEntry = {
  element_id?: string;
  element_name?: string;
  entry_id?: string;
  effective_start?: Date;
  effective_end?: Date;
  value_from?: PayrollEntryFrom;
  values?: PayrollEntryValue[];
};

export type PayrollEntryFrom = 'pay-per-entry' | 'element-link' | 'element';

export type PayrollEntryValue = {
  input_value_id?: string;
  value_code?: string;
  value_name?: string;
  data_type?: 'C' | 'N' | 'D';
  value_id?: string;
  effective_start?: Date;
  effective_end?: Date;
  default_value?: string;
  link_value?: string;
  entry_value?: string;
};

export type PayrollPerEntryPageRes = PageResponse<PayrollPerEntry> & {
  elements?: PayrollElementCbx[];
};

export type PayrollPerEntryRes = {
  employee?: PayrollPerEntry;
  entries?: PayrollEntry[];
};
