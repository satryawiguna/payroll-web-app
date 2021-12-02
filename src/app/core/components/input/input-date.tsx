/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Button} from '@material-ui/core';
import {KeyboardDatePicker} from '@material-ui/pickers';
import {KeyboardDatePickerProps} from '@material-ui/pickers/DatePicker/DatePicker';
import {MaterialUiPickersDate} from '@material-ui/pickers/typings/date';
import {cls, DATE_PICKER_HEADER_FORMAT, formatDate, Modify} from 'app/utils';
import {startOfDay} from 'date-fns';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {InputLabel} from './input-label';
import {inputClassName, StandardInputProps} from './input-model';

const DEFAULT_DATE_FORMAT = 'dd-MMM-yyyy';

export type InputDateProps = Modify<KeyboardDatePickerProps, StandardInputProps<Date>> & {
  showTodayButton?: boolean;
};

export const InputDate = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  {readOnly, onChange, showTodayButton, prefix, suffix, ...props}: InputDateProps
) => {
  const [value, setValue] = useState<Date | null>(props.value ?? null);
  useEffect(() => setValue(props.value ?? null), [props.value]);

  const {t} = useTranslation('common');

  function handleOnChange(value: MaterialUiPickersDate) {
    const v = value ? startOfDay(value as Date) : null;
    setValue(v);
    props.onBlur?.();
    onChange?.({target: {name: props.name, value: v ?? undefined}});
  }

  if (readOnly) {
    return (
      <InputLabel
        {...props}
        readOnly={true}
        className={cls('input-date', props.className)}
        value={formatDate(props.value)}
      />
    );
  }

  return (
    <KeyboardDatePicker
      {...props}
      id={props.id ?? props.name}
      name={props.name}
      autoComplete="off"
      autoOk

      variant="inline"
      inputVariant="outlined"
      className={inputClassName('input-date', props.name, props.className, props.error)}
      placeholder={props.placeholder}

      format={props.format ?? DEFAULT_DATE_FORMAT}
      refuse={/[^0-9a-z]/gi}
      value={value}
      onChange={handleOnChange}

      ToolbarComponent={(toolbarProps) => (
        <div className="input-date-header">
          <div className="input-date-header-title">
            <Button className="subtitle"
                    onClick={() => toolbarProps.setOpenView('year')}>{toolbarProps.date?.getFullYear()}</Button>
            <div className="title">{formatDate(toolbarProps.date as Date, DATE_PICKER_HEADER_FORMAT)}</div>
          </div>
          <div className="input-date-actions">
            {showTodayButton !== false &&
            <Button onClick={() => toolbarProps.onChange(new Date())}>{t('button.today')}</Button>}
          </div>
        </div>
      )}
    />
  );
};
