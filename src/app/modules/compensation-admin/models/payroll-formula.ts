/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

export type PayrollFormula = {
  formula_id?: string;
  is_read_only?: boolean;
  effective_start?: Date;
  effective_end?: Date;
  formula_name?: string;
  element_id?: string;
  element_name?: string;
  result_elements?: string;
  formula_type?: FormulaType;
  formula_def?: string;
  description?: string;

  results?: FormulaResult[];
};

export type FormulaType = 'SP' | 'FX'; // SP: Stored Procedure | FX: Simple Formula

export type FormulaResult = {
  result_id?: string;
  is_read_only?: boolean;
  effective_start?: Date;
  effective_end?: Date;
  result_code?: string;
  element_id?: string;
  element_name?: string;
  input_value_id?: string;
  input_value_name?: string;
  formula_expr?: string;
};

export type PayrollFormulaCbx = {
  formula_id: string;
  formula_name: string;
};
