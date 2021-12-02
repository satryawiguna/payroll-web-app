/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {InputBase} from '@material-ui/core';
import React from 'react';
import {InputDateProps} from './input-date';
import {inputClassName} from './input-model';
import {InputNumberProps} from './input-number';
import {InputRadioProps} from './input-radio';
import {InputSelectProps} from './input-select';
import {InputTextProps} from './input-text';
import {InputToggleProps} from './input-toggle';

export type InputLabelProps
  = InputTextProps | InputNumberProps | InputDateProps
  | InputSelectProps<any, any> | InputRadioProps<any, any> | InputToggleProps;

export const InputLabel = (props: InputLabelProps) => {
  const readOnly = props.readOnly ?? false;
  const className = inputClassName('input-label', props.name, props.className) +
                    (!readOnly ? ' input-label-outlined' : ' input-label-standard');
  return (
    <InputBase
      id={props.id ?? props.name}
      name={props.name}
      className={className}
      placeholder={props.placeholder}
      value={props.value ? props.value : '-'}
      readOnly={true}
    />
  );
};
