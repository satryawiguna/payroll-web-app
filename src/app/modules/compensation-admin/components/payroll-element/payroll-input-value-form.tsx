/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {EditFormRef, FormControl, InputDate, InputSelect, InputText} from 'app/core/components';
import {LOV} from 'app/modules/master';
import React, {forwardRef, Ref, useEffect, useImperativeHandle, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {InputValue} from '../../models/payroll-element';

export type PayInputValueFormProps = {
  item?: InputValue;
  readOnly?: boolean;
};

export const PayrollInputValueForm = forwardRef((
  {item, ...props}: PayInputValueFormProps, ref: Ref<EditFormRef<InputValue>>
) => {
  const form = useForm<InputValue>({mode: 'onTouched'});
  const [readOnly, setReadOnly] = useState(props.readOnly);
  const {t} = useTranslation('payroll');

  useImperativeHandle(ref, () => ({
    submit: submit,
    setReadOnly: (value) => setReadOnly(value ?? true),
  }));

  useEffect(() => setFormValue(), [item]);

  function setFormValue() {
    if (item == null) return;
    form.setValue('effective_start', item.effective_start);
    form.setValue('effective_end', item.effective_end);
    form.setValue('value_code', item.value_code);
    form.setValue('value_name', item.value_name);
    form.setValue('data_type', item.data_type);
    form.setValue('default_value', item.default_value);
    form.setValue('description', item.description);
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): InputValue {
    const item = form.getValues();
    return {
      effective_start: item.effective_start,
      effective_end: item.effective_end,
      value_code: item.value_code,
      value_name: item.value_name,
      data_type: item.data_type,
      default_value: item.default_value,
      description: item.description,
    };
  }

  async function submit(): Promise<InputValue | undefined> {
    const valid = await validate();
    return valid ? formValue() : undefined;
  }

  return (
    <div className="form-item">
      <FormControl
        name="value_code" control={form.control} state={form.formState} label={t('label.value-code')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputText {...props} className="input-sm" />
        )}
      />
      <FormControl
        name="value_name" control={form.control} state={form.formState} label={t('label.value-name')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputText {...props} className="input-lg" />
        )}
      />
      <FormControl
        name="data_type" control={form.control} state={form.formState} label={t('common:label.data-type')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputSelect {...props} options={LOV.DATA_TYPES} getOptionLabel={(d) => d.label ?? t(d.i18nLabel!)} />
        )}
      />
      <FormControl
        name={['effective_start', 'effective_end']} control={form.control} state={form.formState}
        label={t('common:label.effective-date')} readOnly={readOnly}
        render={props => (props.name === 'effective_start'
            ? <InputDate {...props} placeholder={t('common:label.from')} />
            : <InputDate {...props} placeholder={t('common:label.to')} />
        )}
      />
      <FormControl
        name="default_value" control={form.control} state={form.formState} label={t('common:label.default-value')}
        readOnly={readOnly}
        render={props => (
          <InputText {...props} className="input-lg" />
        )}
      />
    </div>
  );
});
