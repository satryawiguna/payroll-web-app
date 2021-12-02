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
  InputSelect,
  InputText
} from 'app/core/components';
import React, {forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {InputValueCbx, PayrollElementCbx} from '../../models/payroll-element';
import {FormulaResult, FormulaType} from '../../models/payroll-formula';

export type PayrollFormulaResultFormProps = {
  formulaType?: FormulaType;
  item?: FormulaResult;
  elements: PayrollElementCbx[];
  readOnly?: boolean;
};

export const PayrollFormulaResultForm = forwardRef((
  {formulaType, item, elements, ...props}: PayrollFormulaResultFormProps, ref: Ref<EditFormRef<FormulaResult>>
) => {
  const form = useForm<FormulaResult>({mode: 'onTouched'});
  const [readOnly, setReadOnly] = useState(props.readOnly);
  const [inputValues, setInputValues] = useState<InputValueCbx[]>([]);
  const {t} = useTranslation('payroll');

  const lastElementId = useRef<string>();

  useImperativeHandle(ref, () => ({
    submit: submit,
    setReadOnly: (value) => setReadOnly(value ?? true),
  }));

  useEffect(() => setFormValue(), [item]);

  function setFormValue() {
    if (item == null) return;

    setInputValues(getInputValues(item.element_id));
    lastElementId.current = item.element_id;

    form.setValue('effective_start', item.effective_start);
    form.setValue('effective_end', item.effective_end);
    form.setValue('result_code', item.result_code);
    form.setValue('element_id', item.element_id);
    form.setValue('input_value_id', item.input_value_id);
    form.setValue('formula_expr', item.formula_expr);
  }

  async function handleElementChange(props: FormControlRenderProps<string>, event: InputChangeEvent<string>) {
    props.onChange(event);
    const value = event.target.value;
    if (value === lastElementId.current) return;
    lastElementId.current = value;
    await form.setValue('input_value_id', undefined);
    setInputValues(getInputValues(value));
  }

  function getInputValues(elementId?: string): InputValueCbx[] {
    const el = elements.find(d => d.element_id === elementId);
    return el?.values ?? [];
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): FormulaResult {
    const item = form.getValues();
    return {
      effective_start: item.effective_start,
      effective_end: item.effective_end,
      result_code: item.result_code,
      element_id: item.element_id,
      input_value_id: item.input_value_id,
      formula_expr: (formulaType === 'FX') ? item.formula_expr : undefined,
    };
  }

  async function submit(): Promise<FormulaResult | undefined> {
    const valid = await validate();
    return valid ? formValue() : undefined;
  }

  return (
    <div className="form-item">
      <FormControl
        name="result_code" control={form.control} state={form.formState} label={t('label.result-code')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputText {...props} className="input-sm" />
        )}
      />
      <FormControl
        name={['element_id', 'input_value_id']} control={form.control} state={form.formState} label={t('label.result-element')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (props.name === 'element_id'
          ? <InputSelect {...props} options={elements} getOptionKey={d => d.element_id} getOptionLabel={d => d.element_name}
                         onChange={e => handleElementChange(props, e)} />
          : <InputSelect {...props} options={inputValues} getOptionKey={d => d.input_value_id} getOptionLabel={d => d.value_name} />
        )}
      />
      {formulaType === 'FX' &&
        <FormControl
          name="formula_expr" control={form.control} state={form.formState} label={t('label.formula-expr')}
          readOnly={readOnly} rules={{required: true}}
          render={props => (
            <InputText {...props} className="input-lg" />
          )}
        />
      }
      <FormControl
        name={['effective_start', 'effective_end']} control={form.control} state={form.formState} label={t('common:label.effective-date')}
        readOnly={readOnly}
        render={props => (props.name === 'effective_start'
            ? <InputDate {...props} placeholder={t('common:label.from')} />
            : <InputDate {...props} placeholder={t('common:label.to')} />
        )}
      />
    </div>
  );
});
