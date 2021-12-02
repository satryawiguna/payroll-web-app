/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {useMediaQuery} from '@material-ui/core';
import {cls} from 'app/utils';
import _ from 'lodash';
import React, {PropsWithChildren, ReactElement, Ref, useEffect, useState} from 'react';
import {Control, Controller, FormState} from 'react-hook-form';
import {FieldValues} from 'react-hook-form/dist/types';
import {RegisterOptions} from 'react-hook-form/dist/types/validator';
import {InputError} from './input-error';
import {InputChangeEvent} from './input-model';

export type FormRules = Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;

export type FormControlProps<V> = {
  name: string | string[];
  className?: string;
  control: Control<FieldValues, any>;
  state: FormState<any>;
  rules?: FormRules | (FormRules | undefined)[];
  label?: string;
  defaultValue?: V;
  readOnly?: boolean;
  render: (props: FormControlRenderProps<V>, i: number) => ReactElement;
};

export type FormControlRenderProps<V> = {
  name: string;
  inputRef: Ref<any>;
  onChange: (event: InputChangeEvent<V>) => void;
  onBlur: () => void;
  readOnly: boolean;
  required: boolean;
  value: V | V[];
  error: boolean;
};

export const FormControl = (props: PropsWithChildren<FormControlProps<any>>) => {
  const [names, setNames] = useState<string[]>([]);
  const [rules, setRules] = useState<(FormRules | undefined)[]>([]);
  const isLargeScreen = !useMediaQuery('(max-width: 1199.98px)');

  useEffect(() => {
    const names = (_.isArray(props.name) ? props.name : [props.name]) as string[];
    setNames(names);
    setRules(names.map((name, i) => _.isArray(props.rules) ? props.rules[i] : props.rules));
  }, [props.name, props.rules]);

  const el = (<>
    {props.label != null
      ? <label className="form-label" htmlFor={names[0]}>
          {props.label}{rules[0]?.required ? <span className="required">*</span> : ''}:
        </label>
      : undefined
    }
    <div className={cls('form-control', isLargeScreen ? props.className : '')}>
      <div className="form-control-inner">
        {names.map((name, i) => (
          <Controller key={i}
            name={name}
            control={props.control}
            defaultValue={_.isArray(props.defaultValue) ? props.defaultValue[i] : props.defaultValue}
            rules={rules[i]}
            render={({field, formState: {errors}}) => props.render({
              name: field.name,
              inputRef: field.ref,
              onChange: event => field.onChange(event.target.value),
              onBlur: field.onBlur,
              required: rules[0]?.required != null,
              readOnly: props.readOnly ?? false,
              value: field.value ?? null,
              error: errors[field.name] != null,
            }, i)}
          />
        ))}
        {props.children}
      </div>
      <InputError errors={names.map(name => props.state.errors[name])} />
    </div>
  </>);

  return isLargeScreen
    ? el
    : <div className={cls('form-control-wrap', props.className)}>{el}</div>;
};
