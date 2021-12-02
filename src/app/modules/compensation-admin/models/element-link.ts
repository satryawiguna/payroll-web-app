/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

export type ElementLink = {
  link_id?: string;
  is_read_only?: boolean;
  effective_start?: Date;
  effective_end?: Date;
  element_id?: string;
  element_name?: string;
  classification_name?: string;

  office_id?: number;
  office_name?: string;
  location_id?: number;
  location_name?: string;
  department_id?: number;
  department_name?: string;
  project_id?: number;
  project_name?: string;
  position_id?: number;
  position_name?: string;
  grade_id?: number;
  grade_name?: string;
  pay_group_id?: string;
  pay_group_name?: string;
  people_group?: string;
  employee_category?: string;

  description?: string;

  values?: LinkValue[];
};

export type LinkValue = {
  value_id?: string;
  is_read_only?: boolean;
  effective_start?: Date;
  effective_end?: Date;
  input_value_id?: string;
  input_value_name?: string;
  default_value?: string;
  link_value?: string;
  description?: string;
};
