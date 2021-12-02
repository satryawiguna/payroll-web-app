/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {
  EditFormRef,
  FormControl,
  FormControlRenderProps,
  InputChangeEvent,
  InputDate,
  InputNumber,
  InputRadio,
  InputSelect,
  InputText,
  InputToggle
} from 'app/core/components';
import {LovItem} from 'app/modules/master';
import React, {forwardRef, Ref, useEffect, useImperativeHandle, useMemo, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {ElementClassificationCbx} from '../../models/element-classification';
import {PayrollElement, PayrollElementCbx} from '../../models/payroll-element';

export type PayrollElementFormProps = {
  item?: PayrollElement;
  classifications: ElementClassificationCbx[];
  retroElements: PayrollElementCbx[];
  readOnly?: boolean;
  wide?: boolean;
};

export const PayrollElementForm = forwardRef((
  {item, classifications, retroElements, ...props}: PayrollElementFormProps, ref: Ref<EditFormRef<PayrollElement>>
) => {
  const form = useForm<PayrollElement>({mode: 'onTouched'});
  const [readOnly, setReadOnly] = useState(props.readOnly);
  const {t} = useTranslation('payroll');

  useImperativeHandle(ref, () => ({
    submit: submit,
    setReadOnly: (value) => setReadOnly(value ?? true),
  }));

  useEffect(() => setFormValue(item), [item]);

  const RECURRING_OPTIONS = useMemo(() => [
    {id: 1, label: t('label.recurring')},
    {id: 0, label: t('label.non-recurring')},
  ] as LovItem[], []);

  function setFormValue(item: PayrollElement | undefined) {
    if (item == null) return;
    form.setValue('effective_start', item.effective_start);
    form.setValue('effective_end', item.effective_end);
    form.setValue('element_code', item.element_code);
    form.setValue('element_name', item.element_name);
    form.setValue('classification_id', item.classification_id);
    form.setValue('processing_priority', item.processing_priority);
    form.setValue('retro_element_id', item.retro_element_id);
    form.setValue('is_recurring', (item.is_recurring ? 1 : 0) as never);
    form.setValue('is_once_per_period', item.is_once_per_period ?? false);
    form.setValue('description', item.description);
  }

  function handleClassificationChange(props: FormControlRenderProps<string>, event: InputChangeEvent<string>) {
    props.onChange(event);
    const cl = classifications.find(d => d.classification_id === event.target.value);
    if (cl != null) {
      form.setValue('processing_priority', cl.default_priority);
    }
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): PayrollElement {
    const item = form.getValues();
    return {
      effective_start: item.effective_start,
      effective_end: item.effective_end,
      element_code: item.element_code,
      element_name: item.element_name,
      classification_id: item.classification_id,
      processing_priority: item.processing_priority,
      retro_element_id: item.retro_element_id,
      is_recurring: (item.is_recurring as never) === 1,
      is_once_per_period: Boolean(item.is_once_per_period),
      description: item.description,
    };
  }

  async function submit(): Promise<PayrollElement | undefined> {
    const valid = await validate();
    return valid ? formValue() : undefined;
  }

  return (
    <div className={`form-item ${(props.wide == null || props.wide) ? 'wide' : ''}`}>
      <FormControl
        name="element_code" control={form.control} state={form.formState} label={t('label.element-code')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputText {...props} className="input-sm" />
        )}
      />
      <FormControl
        name="element_name" control={form.control} state={form.formState} label={t('label.element-name')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputText {...props} className="input-lg" />
        )}
      />
      <FormControl
        name="classification_id" control={form.control} state={form.formState} label={t('label.classification')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputSelect {...props} options={classifications} getOptionKey={d => d.classification_id} getOptionLabel={d => d.classification_name}
                       readOnlyValue={item?.classification_name} onChange={e => handleClassificationChange(props, e)} />
        )}
      />
      <FormControl
        name="processing_priority" control={form.control} state={form.formState} label={t('label.processing-priority')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputNumber {...props} thousandSeparator={false} className="input-xs" />
        )}
      />

      <FormControl
        name="retro_element_id" control={form.control} state={form.formState} label={t('label.retro-element')}
        readOnly={readOnly}
        render={props => (
          <InputSelect {...props} options={retroElements} getOptionKey={d => d.element_id} getOptionLabel={d => d.element_name}
                       readOnlyValue={item?.retro_element_name} />
        )}
      />
      <FormControl
        name="is_recurring" control={form.control} state={form.formState} label={t('label.recurring')} defaultValue={1}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputRadio {...props} options={RECURRING_OPTIONS} />
        )}
      />
      <FormControl
        name="is_once_per_period" control={form.control} state={form.formState} label={t('label.once-each-period')}
        readOnly={readOnly}
        render={props => (
          <InputToggle {...props} />
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
  );
});
