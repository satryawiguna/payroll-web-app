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
  InputRadio,
  InputSelect,
  InputText
} from 'app/core/components';
import {FormulaList, LOV} from 'app/modules/master';
import React, {forwardRef, Ref, useEffect, useImperativeHandle, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {PayrollElementCbx} from '../../models/payroll-element';
import {FormulaType, PayrollFormula} from '../../models/payroll-formula';

export type PayrollFormulaFormProps = {
  item?: PayrollFormula;
  elements?: PayrollElementCbx[],
  formulaList?: FormulaList[];
  formulaTypeChange?: (event: InputChangeEvent<FormulaType>) => void;
  readOnly?: boolean;
  formulaTypeIsDisabled?: boolean;
};

export const PayrollFormulaForm = forwardRef((
  {item, elements, formulaTypeChange, formulaList, formulaTypeIsDisabled, ...props}: PayrollFormulaFormProps,
  ref: Ref<EditFormRef<PayrollFormula>>
) => {
  const form = useForm<PayrollFormula>({mode: 'onTouched'});
  const [readOnly, setReadOnly] = useState(props.readOnly);
  const [formulaType, setFormulaType] = useState<FormulaType>();
  const {t} = useTranslation('payroll');

  useImperativeHandle(ref, () => ({
    submit: submit,
    setReadOnly: (value) => setReadOnly(value ?? true),
  }));

  useEffect(() => setFormValue(item), [item]);

  const FORMULA_TYPES = LOV.FORMULA_TYPES;

  function setFormValue(item: PayrollFormula | undefined) {
    if (item == null) return;
    setFormulaType(item.formula_type);
    form.setValue('effective_start', item.effective_start);
    form.setValue('effective_end', item.effective_end);
    form.setValue('formula_name', item.formula_name);
    form.setValue('element_id', item.element_id);
    form.setValue('formula_type', item.formula_type);
    form.setValue('formula_def', item.formula_def);
    form.setValue('description', item.description);
  }

  async function handleFormulaTypeChange(props: FormControlRenderProps<FormulaType>, event: InputChangeEvent<FormulaType>) {
    props.onChange(event);
    formulaTypeChange?.(event);
    const value = event.target.value;
    setFormulaType(value);
    if (value === 'FX') {
      await form.setValue('formula_def', undefined);
    }
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): PayrollFormula {
    const item = form.getValues();
    return {
      effective_start: item.effective_start,
      effective_end: item.effective_end,
      formula_name: item.formula_name,
      element_id: item.element_id,
      formula_type: item.formula_type,
      formula_def: (item.formula_type === 'SP') ? item.formula_def : undefined,
      description: item.description,
    };
  }

  async function submit(): Promise<PayrollFormula | undefined> {
    const valid = await validate();
    return valid ? formValue() : undefined;
  }

  return (
    <div className={`form-item ${formulaType ? 'form-item-' + formulaType.toLocaleLowerCase() : ''}`}>
      <FormControl
        name="formula_name" control={form.control} state={form.formState} label={t('label.formula-name')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputText {...props} className="input-lg" />
        )}
      />
      <FormControl
        name="element_id" control={form.control} state={form.formState} label={t('label.element-name')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputSelect {...props} options={elements} getOptionKey={d => d.element_id} getOptionLabel={d => d.element_name}
                       readOnlyValue={item?.element_name} />
        )}
      />
      <FormControl
        name="formula_type" control={form.control} state={form.formState} label={t('label.formula-type')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputRadio {...props} options={FORMULA_TYPES} disabled={!props.readOnly && formulaTypeIsDisabled}
                      onChange={e => handleFormulaTypeChange(props, e)} />
        )}
      />
      {formulaType === 'SP' &&
        <FormControl
          name="formula_def" control={form.control} state={form.formState} label={t('label.procedure-name')}
          readOnly={readOnly} rules={{required: formulaType === 'SP'}}
          render={props => (
            <InputSelect {...props} options={formulaList} getOptionKey={d => d.formula_name} getOptionLabel={d => d.formula_name}
                         readOnlyValue={item?.formula_def} disabled={formulaType !== 'SP'} />
          )}
        />}

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
