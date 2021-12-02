/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {PropTypes} from '@material-ui/core';
import React, {Ref} from 'react';

export type StandardInputProps<V> = {
  id?: string;
  name?: string;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
  error?: boolean;

  inputRef?: Ref<any>;
  placeholder?: string;
  value?: V;
  onChange?: (event: InputChangeEvent<V>) => void;
  onBlur?: () => void;

  prefix?: InputAdornmentProps<any> | InputAdornmentProps<any>[];
  suffix?: InputAdornmentProps<any> | InputAdornmentProps<any>[];
};

export type InputChangeEvent<V> = {target: {name?: string, value?: V}};

export type InputAdornmentProps<O> = {
  name?: string;
  position?: 'start' | 'end';
  className?: string;
  tooltip?: string;
  label?: string;
  icon?: string;
  color?: PropTypes.Color;
  value?: string;

  list?: O[];
  getListKey?: (item: O) => string;
  getListLabel?: (item: O) => string;

  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onChange?: (event: InputChangeEvent<O>) => void;
};

export type DataType = 'string' | 'number' | 'date' | 'boolean' | 'yes-no' | 'check-none';

export function inputClassName(inputType: string, name?: string, className?: string, hasError?: boolean): string {
  let ret = 'app-input ' + inputType;
  if (name) ret += ' input-' + name.replace('.', '_');
  if (hasError) ret += ' has-error';
  if (className) ret += ' ' + className;
  return ret;
}
