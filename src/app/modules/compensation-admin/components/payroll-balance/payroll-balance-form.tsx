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
  InputRadio,
  InputText
} from 'app/core/components';
import {LOV} from 'app/modules/master';
import React, {forwardRef, Ref, useEffect, useImperativeHandle, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {BalanceFeedType, PayrollBalance} from '../../models/payroll-balance';

export type PayrollBalanceFormProps = {
  item?: PayrollBalance;
  feedTypeChange?: (event: InputChangeEvent<BalanceFeedType>) => void;
  readOnly?: boolean;
  feedTypeIsDisabled?: boolean;
};

export const PayrollBalanceForm = forwardRef((
  {item, feedTypeChange, feedTypeIsDisabled, ...props}: PayrollBalanceFormProps, ref: Ref<EditFormRef<PayrollBalance>>
) => {
  const form = useForm<PayrollBalance>({mode: 'onTouched'});
  const [readOnly, setReadOnly] = useState(props.readOnly);
  const {t} = useTranslation('payroll');

  useImperativeHandle(ref, () => ({
    submit: submit,
    setReadOnly: (value) => setReadOnly(value ?? true),
  }));

  useEffect(() => setFormValue(item), [item]);

  const FEED_TYPES = LOV.BALANCE_FEED_TYPE;

  function setFormValue(item: PayrollBalance | undefined) {
    if (item == null) return;
    form.setValue('balance_name', item.balance_name);
    form.setValue('balance_feed_type', item.balance_feed_type);
    form.setValue('description', item.description);
  }

  async function handleFeedTypeChange(props: FormControlRenderProps<BalanceFeedType>, event: InputChangeEvent<BalanceFeedType>) {
    props.onChange(event);
    feedTypeChange?.(event);
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): PayrollBalance {
    const item = form.getValues();
    return {
      balance_name: item.balance_name,
      balance_feed_type: item.balance_feed_type,
      description: item.description,
    };
  }

  async function submit(): Promise<PayrollBalance | undefined> {
    const valid = await validate();
    return valid ? formValue() : undefined;
  }

  return (
    <div className="form-item">
      <FormControl
        name="balance_name" control={form.control} state={form.formState} label={t('label.balance-name')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputText {...props} className="input-lg" />
        )}
      />
      <FormControl
        name="balance_feed_type" control={form.control} state={form.formState} label={t('label.balance-feed-type')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputRadio {...props} options={FEED_TYPES} disabled={!props.readOnly && feedTypeIsDisabled}
                      onChange={e => handleFeedTypeChange(props, e)} />
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
