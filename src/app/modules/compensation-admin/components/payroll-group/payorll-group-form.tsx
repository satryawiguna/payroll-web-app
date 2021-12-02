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
import React, {forwardRef, Ref, useEffect, useImperativeHandle, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {PayrollGroup} from '../../models/payroll-group';

export type PayrollGroupProps = {
  item?: PayrollGroup;
  readOnly?: boolean;
};

export const PayrollGroupForm = forwardRef((
  {item, ...props}: PayrollGroupProps, ref: Ref<EditFormRef<PayrollGroup>>
) => {
  const form = useForm<PayrollGroup>({mode: 'onTouched'});
  const [readOnly, setReadOnly] = useState(props.readOnly);
  const {t} = useTranslation('payroll');

  useImperativeHandle(ref, () => ({
    submit: submit,
    setReadOnly: (value) => setReadOnly(value ?? true),
  }));

  useEffect(() => setFormValue(item), [item]);

  function setFormValue(item: PayrollGroup | undefined) {
    if (item == null) return;
    form.setValue('effective_start', item.effective_start);
    form.setValue('effective_end', item.effective_end);
    form.setValue('pay_group_name', item.pay_group_name);
    form.setValue('description', item.description);
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): PayrollGroup {
    const item = form.getValues();
    return {
      effective_start: item.effective_start,
      effective_end: item.effective_end,
      pay_group_name: item.pay_group_name,
      description: item.description,
    };
  }

  async function submit(): Promise<PayrollGroup | undefined> {
    const valid = await validate();
    return valid ? formValue() : undefined;
  }

  return (<>
    {readOnly && <div className="alert alert-warning">{t('common:message.item-is-read-only')}</div>}

    <div className="form-item">
      <FormControl
        name="pay_group_name" control={form.control} state={form.formState} label={t('label.payroll-group-name')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputText {...props} className="input-lg" />
        )}
      />
      <FormControl
        name={['effective_start', 'effective_end']} control={form.control} state={form.formState} label={t('common:label.effective-date')}
        readOnly={readOnly}
        render={props => (props.name === 'effective_start'
            ? <InputDate {...props} placeholder={t('common:label.from')} />
            : <InputDate {...props} placeholder={t('common:label.to')} />
        )}
      />
      <FormControl
        name="description" control={form.control} state={form.formState} label={t('common:label.description')}
        readOnly={readOnly}
        render={props => (
          <InputText {...props} className="input-lg" />
        )}
      />
    </div>
  </>);
});
