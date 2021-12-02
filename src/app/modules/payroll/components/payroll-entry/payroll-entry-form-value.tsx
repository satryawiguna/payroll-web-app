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
import {FormLabel} from 'app/core/components/input/form-label';
import React, {forwardRef, Ref, useEffect, useImperativeHandle} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {PayrollEntry, PayrollEntryValue} from '../../models/payroll-entry';

type PayrollEntryFormValueProps = {
  item?: PayrollEntryValue;
  entry?: PayrollEntry;
};

export const PayrollEntryFormValue = forwardRef((
  {item, ...props}: PayrollEntryFormValueProps, ref: Ref<EditFormRef<PayrollEntryValue>>
) => {
  const form = useForm<PayrollEntryValue>({mode: 'onTouched'});
  const {t} = useTranslation('payroll');

  useImperativeHandle(ref, () => ({submit}));

  useEffect(() => {
    setFormValue(item);
  }, [item]);

  function setFormValue(item: PayrollEntryValue | undefined) {
    if (item == null) return;
    form.setValue('effective_start', item.effective_start);
    form.setValue('effective_end', item.effective_end);
    form.setValue('entry_value', item.entry_value);
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): PayrollEntryValue {
    const f = form.getValues() as Record<string, any>;
    return {
      effective_start: f.effective_start,
      effective_end: f.effective_end,
      entry_value: f.entry_value,
    };
  }

  async function submit(): Promise<PayrollEntryValue | undefined> {
    const valid = await validate();
    return valid ? formValue() : undefined;
  }

  return (
    <div className="form-item">
      <FormLabel className="input-lg" label={t('label.element')} value={[props.entry?.element_name, item?.value_name]} />
      <FormControl
        name={['effective_start', 'effective_end']} control={form.control} state={form.formState} label={t('common:label.effective-date')}
        render={props => (props.name === 'effective_start'
            ? <InputDate {...props} placeholder={t('common:label.from')} />
            : <InputDate {...props} placeholder={t('common:label.to')} />
        )}
      />
      <FormLabel className="input-lg" label={t('label.default-value')} value={item?.default_value} />
      <FormControl
        name={'entry_value'} control={form.control} state={form.formState} label={t('label.entry-value')}
        render={props => <InputText {...props} className="input-lg" />}
      />
    </div>
  );
});
