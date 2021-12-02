/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Icon, Switch} from '@material-ui/core';
import {jsxString} from 'app/utils';
import React, {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {inputClassName, StandardInputProps} from './input-model';

export type InputToggleProps = StandardInputProps<boolean> & {
  label?: ReactNode;
};

export const InputToggle = (props: InputToggleProps) => {
  const [checked, setChecked] = useState<boolean>(false);
  const {t} = useTranslation('common');
  useEffect(() => setChecked(props.value ?? false), [props.value]);

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    const v = event.target.checked;
    setChecked(v);
    props.onChange?.({target: {name: props.name, value: v}});
  }

  return (
    <div className={inputClassName('input-toggle', props.name, props.className, props.error)}>
      {props.readOnly
        ? <div className="read-only-item">
            <Icon className="read-only-icon">{props.value ? 'check' : 'close' }</Icon>
            <label>{props.value ? t('button.yes') : t('button.no')}</label>
          </div>
        : <Switch name={props.name} checked={checked} onChange={handleOnChange}
                  inputProps={{'aria-label': jsxString(props.label)}} />
      }
    </div>
  );
};
