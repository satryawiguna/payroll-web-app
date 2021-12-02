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
import {LinkValue} from '../../models/element-link';
import {InputValue} from '../../models/payroll-element';

export type ElementLinkValueFormProps = {
  item?: LinkValue;
  readOnly?: boolean;
}

export const ElementLinkValueForm = forwardRef((
  {item, ...props}: ElementLinkValueFormProps, ref: Ref<EditFormRef<LinkValue>>
) => {
  const form = useForm<LinkValue>({mode: 'onTouched'});
  const [readOnly, setReadOnly] = useState(props.readOnly);
  const {t} = useTranslation('payroll');

  useImperativeHandle(ref, () => ({
    submit: submit,
    setReadOnly: (value) => setReadOnly(value ?? true),
  }));

  useEffect(() => setFormValue(), [item]);

  function setFormValue() {
    if (item == null) return;
    form.setValue('input_value_id', item.input_value_id);
    form.setValue('input_value_name', item.input_value_name);
    form.setValue('effective_start', item.effective_start);
    form.setValue('effective_end', item.effective_end);
    form.setValue('default_value', item.default_value);
    form.setValue('link_value', item.link_value);
    form.setValue('description', item.description);
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): LinkValue {
    const item = form.getValues();
    return {
      input_value_id: item.input_value_id,
      effective_start: item.effective_start,
      effective_end: item.effective_end,
      link_value: item.link_value,
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
        name="input_value_name" control={form.control} state={form.formState} label={t('label.input-value')}
        readOnly={readOnly}
        render={props => (
          <InputText {...props} disabled={!props.readOnly} className="input-lg" />
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
          <InputText {...props} disabled={!props.readOnly} className="input-lg" />
        )}
      />
      <FormControl
        name="link_value" control={form.control} state={form.formState} label={t('common:label.value')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputText {...props} className="input-lg" />
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
  );
});
