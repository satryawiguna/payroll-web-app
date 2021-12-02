/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Button, Icon} from '@material-ui/core';
import {DatePicker} from '@material-ui/pickers';
import {DATE_PICKER_HEADER_FORMAT, formatDate, today} from 'app/utils';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import './input-effective.scss';

export type InputEffectiveProps = {
  value?: Date;
  onChange?: (value: Date) => void;
};

export const InputEffective = (props: InputEffectiveProps) => {
  const {t} = useTranslation('common');
  const [open, setOpen] = useState(false);

  function onChange(value: Date) {
    setOpen(false);
    value.setHours(0, 0, 0, 0);
    props.onChange?.(value);
  }

  const value = props.value ?? today();

  return (
    <div className="input-effective-container">
      <Button onClick={() => setOpen(true)} endIcon={<Icon style={{marginLeft: '-6px'}}>arrow_drop_down</Icon>}>
        {t('label.effective')}: {formatDate(value)}
      </Button>

      <DatePicker
        variant="inline"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={value => onChange(value as Date)}
        value={value}
        ToolbarComponent={(toolbarProps) => (
          <div className="input-date-header">
            <div className="input-date-header-title">
              <Button className="subtitle"
                      onClick={() => toolbarProps.setOpenView('year')}>{toolbarProps.date?.getFullYear()}</Button>
              <div className="title">{formatDate(toolbarProps.date as Date, DATE_PICKER_HEADER_FORMAT)}</div>
            </div>
            <div className="input-date-actions">
              <Button onClick={() => toolbarProps.onChange(new Date())}>{t('button.today')}</Button>
            </div>
          </div>
        )}
      />
    </div>
  );
};
