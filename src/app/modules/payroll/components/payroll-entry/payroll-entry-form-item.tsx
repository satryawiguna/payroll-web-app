/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {EditFormRef, FormControl, InputDate, InputText} from 'app/core/components';
import React, {forwardRef, Ref, useEffect, useImperativeHandle} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {PayrollEntry} from '../../models/payroll-entry';

type PayrollEntryFormItemProps = {
  item?: PayrollEntry;
};

export const PayrollEntryFormItem = forwardRef((
  {item}: PayrollEntryFormItemProps, ref: Ref<EditFormRef<PayrollEntry>>
) => {
  const form = useForm<PayrollEntry>({mode: 'onTouched'});
  const {t} = useTranslation('payroll');

  useImperativeHandle(ref, () => ({submit}));

  useEffect(() => {
    setFormValue(item);
  }, [item]);

  function setFormValue(item: PayrollEntry | undefined) {
    if (item == null) return;
    form.setValue('element_name', item.element_name);
    form.setValue('effective_start', item.effective_start);
    form.setValue('effective_end', item.effective_end);
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): PayrollEntry {
    const f = form.getValues() as Record<string, any>;
    return {
      effective_start: f.effective_start,
      effective_end: f.effective_end,
    };
  }

  async function submit(): Promise<PayrollEntry | undefined> {
    const valid = await validate();
    return valid ? formValue() : undefined;
  }

  return (
    <div className="form-item">
      <FormControl
        name="element_name" control={form.control} state={form.formState} label={t('label.element')}
        render={props => (
          <InputText {...props} disabled={true} className="input-lg" />
        )}
      />

      <FormControl
        name={['effective_start', 'effective_end']} control={form.control} state={form.formState} label={t('common:label.effective-date')}
        render={props => (props.name === 'effective_start'
            ? <InputDate {...props} placeholder={t('common:label.from')} />
            : <InputDate {...props} placeholder={t('common:label.to')} />
        )}
      />
    </div>
  );
});
