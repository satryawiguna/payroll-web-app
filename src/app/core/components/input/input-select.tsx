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
import Autocomplete from '@material-ui/lab/Autocomplete';
import {cls} from 'app/utils';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {InputLabel} from './input-label';
import {inputClassName, StandardInputProps} from './input-model';

export type InputSelectProps<T extends Record<string, any>, V> = StandardInputProps<V> & {
  options?: T[];
  getOptionKey?: (option: T) => V;
  getOptionLabel?: (option: T) => string;
  readOnlyValue?: string;
  required?: boolean;
};

export const InputSelect = <T extends Record<string, any>, V>(
  {disabled, readOnly, readOnlyValue, getOptionKey: propsGetOptionKey, getOptionLabel: propsGetOptionLabel, options, onChange,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
   required, prefix, suffix, ...props}: InputSelectProps<T, V>
) => {
  const [value, setValue] = useState<T | null>(null);
  const {t} = useTranslation();

  useEffect(() => {
    const item = options?.find(opt => {
      const v = getOptionKey(opt);
      return v === props.value;
    });
    setValue(item ?? null);
  }, [propsGetOptionKey, options, props.value]);

  function getOptionKey(option?: T): V | undefined {
    if (!option) return undefined;
    return (propsGetOptionKey ? propsGetOptionKey(option) : option[DEF_OPTION_KEY]);
  }

  function getOptionLabel(option?: T): string {
    if (!option) return '';
    if (propsGetOptionLabel) return propsGetOptionLabel(option);
    if (option[DEF_OPTION_LABEL]) return option[DEF_OPTION_LABEL] as string;
    if (option[DEF_OPTION_LABEL_ALT]) return t(option[DEF_OPTION_LABEL_ALT] as string);
    return '';
  }

  function handleOnChange(event: ChangeEvent<unknown>, item: T | null) {
    const v = getOptionKey(item ?? undefined);
    setValue(item);
    props.onBlur?.();
    onChange?.({target: {name: props.name, value: v}});
  }

  if (readOnly) {
    const item = options?.find(opt => {
      const v = getOptionKey(opt);
      return v === props.value;
    });
    return (
      <InputLabel {...props} readOnly className={cls('input-select', props.className)}
                  value={readOnlyValue ?? getOptionLabel(item)} />
    );
  }

  return (
    <Autocomplete
      className={inputClassName('input-select', props.name, props.className, props.error)}
      options={options ?? []}
      getOptionLabel={d => getOptionLabel(d)}
      value={value}
      onChange={handleOnChange}
      disableClearable={required}
      disabled={disabled}

      renderInput={(params) => (
        <TextField
          {...props}
          {...params}
          id={props.id ?? props.name}
          variant="outlined"
          placeholder={props.placeholder}
        />
      )}
    />
  );
};

const DEF_OPTION_KEY = 'id';
const DEF_OPTION_LABEL = 'label';
const DEF_OPTION_LABEL_ALT = 'i18nLabel';
