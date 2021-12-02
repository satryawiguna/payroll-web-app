/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

export type PayrollElement = {
  element_id?: string;
  is_read_only?: boolean;
  effective_start?: Date;
  effective_end?: Date;
  element_code?: string;
  element_name?: string;
  input_value_names?: string;
  classification_id?: string;
  classification_name?: string;
  processing_priority?: number;
  retro_element_id?: string;
  retro_element_name?: string;
  is_recurring?: boolean;
  is_once_per_period?: boolean;
  description?: string;

  values?: InputValue[];
};

export type InputValue = {
  input_value_id?: string;
  is_read_only?: boolean;
  effective_start?: Date;
  effective_end?: Date;
  value_code?: string;
  value_name?: string;
  data_type?: 'C' | 'N' | 'D'; // C: Character | N: Number | D: Date
  default_value?: string;
  description?: string;
};

export type PayrollElementCbx = {
  element_id: string;
  element_code: string;
  element_name: string;
  classification_name?: string;
  values?: InputValueCbx[];
};

export type InputValueCbx = {
  input_value_id: string;
  value_code: string;
  value_name: string;
  data_type?: 'C' | 'N' | 'D';
  default_value: string | undefined;
};
