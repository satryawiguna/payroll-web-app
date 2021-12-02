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
  InputSelect,
  InputText
} from 'app/core/components';
import React, {forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {InputValueCbx, PayrollElementCbx} from '../../models/payroll-element';
import {SalaryBasis} from '../../models/salary-basis';

export type SalaryBasisFormProps = {
  item?: SalaryBasis;
  elements: PayrollElementCbx[];
  readOnly?: boolean;
};

export const SalaryBasisForm = forwardRef((
  {item, elements, ...props}: SalaryBasisFormProps, ref: Ref<EditFormRef<SalaryBasis>>
) => {
  const form = useForm<SalaryBasis>({mode: 'onTouched'});
  const [readOnly, setReadOnly] = useState(props.readOnly);
  const [inputValues, setInputValues] = useState<InputValueCbx[]>([]);
  const {t} = useTranslation('payroll');

  const lastElementId = useRef<string>();

  useImperativeHandle(ref, () => ({
    submit: submit,
    setReadOnly: (value) => setReadOnly(value ?? true),
  }));

  useEffect(() => setFormValue(item), [item]);

  function setFormValue(item: SalaryBasis | undefined) {
    if (item == null) return;

    setInputValues(getInputValues(item.element_id!));
    lastElementId.current = item.element_id;

    form.setValue('salary_basis_code', item.salary_basis_code);
    form.setValue('salary_basis_name', item.salary_basis_name);
    form.setValue('element_id', item.element_id);
    form.setValue('input_value_id', item.input_value_id);
    form.setValue('description', item.description);
  }

  async function handleElementChange(props: FormControlRenderProps<string>, event: InputChangeEvent<string>) {
    props.onChange(event);
    const value = event.target.value;
    if (value === lastElementId.current) return;
    lastElementId.current = value;
    await form.setValue('input_value_id', undefined);
    setInputValues(getInputValues(value!));
  }

  function getInputValues(elementId: string): InputValueCbx[] {
    const el = elements.find(d => d.element_id === elementId);
    return el?.values ?? [];
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): SalaryBasis {
    const item = form.getValues();
    return {
      salary_basis_code: item.salary_basis_code,
      salary_basis_name: item.salary_basis_name,
      element_id: item.element_id,
      input_value_id: item.input_value_id,
      description: item.description,
    };
  }

  async function submit(): Promise<SalaryBasis | undefined> {
    const valid = await validate();
    return valid ? formValue() : undefined;
  }

  return (<>
    {readOnly && <div className="alert alert-warning">{t('common:message.item-is-read-only')}</div>}

    <div className="form-item">
      <FormControl
        name="salary_basis_code" control={form.control} state={form.formState} label={t('label.salary-basis-code')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputText {...props} className="input-sm" />
        )}
      />
      <FormControl
        name="salary_basis_name" control={form.control} state={form.formState} label={t('label.salary-basis-name')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputText {...props} className="input-lg" />
        )}
      />
      <FormControl
        name={['element_id', 'input_value_id']} control={form.control} state={form.formState} label={t('label.element')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (props.name === 'element_id'
            ? <InputSelect {...props} options={elements} getOptionKey={d => d.element_id} getOptionLabel={d => d.element_name}
                           onChange={e => handleElementChange(props, e)} />
            : <InputSelect {...props} options={inputValues} getOptionKey={d => d.input_value_id} getOptionLabel={d => d.value_name} />
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
