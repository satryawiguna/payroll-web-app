/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Radio} from '@material-ui/core';
import {cls} from 'app/utils';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {InputLabel} from './input-label';
import {inputClassName, StandardInputProps} from './input-model';

export type InputRadioProps<T extends Record<string, any>, V> = StandardInputProps<V> & {
  options?: T[];
  getOptionKey?: (option: T) => V;
  getOptionLabel?: (option: T) => string;
  readOnlyValue?: string;
};

export const InputRadio = <T extends Record<string, any>, V>(
  {readOnly, readOnlyValue, getOptionKey: propsGetOptionKey, getOptionLabel: propsGetOptionLabel, options, onChange,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    prefix, suffix, ...props}: InputRadioProps<T, V>
) => {
  const [value, setValue] = useState<V>();
  const {t} = useTranslation();

  useEffect(() => setValue(props.value), [props.value]);

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    if (props.disabled || !options?.length) return;
    const v = getOptionKey(options[+event.target.value]);
    setValue(v);
    props.onBlur?.();
    onChange?.({target: {name: props.name, value: v}});
  }

  function getOptionKey(option: T): V {
    return (propsGetOptionKey ? propsGetOptionKey(option) : option[DEF_OPTION_KEY]);
  }

  function getOptionLabel(option?: T): string {
    if (!option) return '';
    if (propsGetOptionLabel) return propsGetOptionLabel(option);
    if (option[DEF_OPTION_LABEL]) return option[DEF_OPTION_LABEL] as string;
    if (option[DEF_OPTION_LABEL_ALT]) return t(option[DEF_OPTION_LABEL_ALT] as string);
    return '';
  }

  if (readOnly) {
    const item = options?.find(opt => {
      const v = getOptionKey(opt);
      return v === props.value;
    });
    return (
      <InputLabel {...props} readOnly className={cls('input-radio', props.className)}
                  value={readOnlyValue ?? getOptionLabel(item)} />
    );
  }

  return (
    <div className={inputClassName('input-radio', props.name, props.className, props.error)}>
      <div className="radio-wrap">
        {options?.map((opt, i) => {
          const checked = getOptionKey(opt) === value;
          return (
            <label className={cls('radio-item', checked ? 'checked' : 'unchecked')} key={i}>
              <Radio name={props.name} checked={checked} value={i} disabled={props.disabled} onChange={handleOnChange} />
              <span className="radio-label">{getOptionLabel(opt)}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

const DEF_OPTION_KEY = 'id';
const DEF_OPTION_LABEL = 'label';
const DEF_OPTION_LABEL_ALT = 'i18nLabel';
