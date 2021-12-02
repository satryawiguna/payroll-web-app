/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {TextField} from '@material-ui/core';
import {TextFieldProps} from '@material-ui/core/TextField/TextField';
import {cls, Modify} from 'app/utils';
import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {createAdornments} from './input-adornment';
import {InputLabel} from './input-label';
import {inputClassName, StandardInputProps} from './input-model';

export type InputTextProps =  Modify<TextFieldProps, StandardInputProps<string>>;

export const InputText = (
  {readOnly, onChange, prefix, suffix, ...props}: InputTextProps
) => {
  const startAdornments = useMemo(() => createAdornments('start', prefix), [prefix]);
  const endAdornments = useMemo(() => createAdornments('end', suffix), [suffix]);

  const [value, setValue] = useState<string>('');
  useEffect(() => setValue(props.value ?? ''), [props.value]);

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const v = event.target.value ?? '';
    setValue(v);
    onChange?.({target: {name: props.name, value: v}});
  }

  if (readOnly) {
    return (
      <InputLabel {...props} readOnly={true} className={cls('input-text', props.className)} />
    );
  }

  return (
    <TextField
      {...props}
      id={props.id ?? props.name}
      type="text"
      variant="outlined"
      className={inputClassName('input-text', props.name, props.className, props.error)}
      placeholder={props.placeholder}

      value={value}
      onChange={handleOnChange}

      InputProps={{
        startAdornment: startAdornments,
        endAdornment: endAdornments,
      }}
    />
  );
};
