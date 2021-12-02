/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {EditFormRef, FormControl, InputDate, InputRadio, InputSelect} from 'app/core/components';
import {LOV} from 'app/modules/master';
import React, {forwardRef, Ref, useEffect, useImperativeHandle, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {ElementClassificationCbx} from '../../models/element-classification';
import {BalanceFeed, BalanceFeedType} from '../../models/payroll-balance';
import {PayrollElementCbx} from '../../models/payroll-element';

export type PayBalanceFeedFormProps = {
  feedType?: BalanceFeedType;
  item?: BalanceFeed;
  classifications: ElementClassificationCbx[];
  elements: PayrollElementCbx[];
  readOnly?: boolean;
};

export const PayrollBalanceFeedForm = forwardRef((
  {feedType, item, classifications, elements, ...props}: PayBalanceFeedFormProps, ref: Ref<EditFormRef<BalanceFeed>>
) => {
  const form = useForm<BalanceFeed>({mode: 'onTouched'});
  const [readOnly, setReadOnly] = useState(props.readOnly);
  const {t} = useTranslation('payroll');

  useImperativeHandle(ref, () => ({
    submit: submit,
    setReadOnly: (value) => setReadOnly(value ?? true),
  }));

  useEffect(() => setFormValue(), [item]);

  const ADD_SUBTRACT = LOV.ADD_SUBTRACT;

  function setFormValue() {
    if (item == null) return;
    form.setValue('effective_start', item.effective_start);
    form.setValue('effective_end', item.effective_end);
    form.setValue('classification_id', item.classification_id);
    form.setValue('element_id', item.element_id);
    form.setValue('add_subtract', item.add_subtract);
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): BalanceFeed {
    const item = form.getValues();
    return {
      effective_start: item.effective_start,
      effective_end: item.effective_end,
      classification_id: feedType === 'C' ? item.classification_id : undefined,
      element_id: feedType === 'E' ? item.element_id : undefined,
      add_subtract: item.add_subtract,
    };
  }

  async function submit(): Promise<BalanceFeed | undefined> {
    const valid = await validate();
    return valid ? formValue() : undefined;
  }

  return (
    <div className="form-item">
      {feedType === 'C' &&
        <FormControl
          name="classification_id" control={form.control} state={form.formState} label={t('label.classification')}
          readOnly={readOnly} rules={{required: true}}
          render={props => (
            <InputSelect {...props} options={classifications} getOptionKey={d => d.classification_id} getOptionLabel={d => d.classification_name} />
          )}
        />
      }
      {feedType === 'E' &&
        <FormControl
          name="element_id" control={form.control} state={form.formState} label={t('label.element')}
          readOnly={readOnly} rules={{required: true}}
          render={props => (
            <InputSelect {...props} options={elements} getOptionKey={d => d.element_id} getOptionLabel={d => d.element_name} />
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
      <FormControl
        name="add_subtract" control={form.control} state={form.formState} label={t('label.add-subtract')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputRadio {...props} options={ADD_SUBTRACT} />
        )}
      />
    </div>
  );
});
