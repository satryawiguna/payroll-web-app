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
  AlertDialogContext,
  EditDialog,
  EditDialogRef,
  EditFormRef,
  FormControl,
  FormControlRenderProps,
  IconButton,
  InputChangeEvent,
  InputDate,
  InputSelect,
  InputText,
  TrackingHistory
} from 'app/core/components';
import {PayrollElement, PayrollElementCbx} from 'app/modules/compensation-admin';
import {BOT, COMPONENT_NAME} from 'config';
import React, {forwardRef, Ref, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Subscription} from 'rxjs';
import {FormLabel} from '../../../../core/components/input/form-label';
import {showToast} from '../../../../utils';
import {PayrollEntry, PayrollEntryValue} from '../../models/payroll-entry';
import {PayrollEntrySvc} from '../../services/payroll-entry-svc';
import {PayrollEntryFormItem} from './payroll-entry-form-item';
import {PayrollEntryFormValue} from './payroll-entry-form-value';
import './payroll-entry-form.scss';

export type PayrollEntryItemProps = {
  employeeId: number;
  item?: PayrollEntry;
  elements?: PayrollElementCbx[];
  allEntries?: PayrollEntry[];
};

type Subscriptions = {
  value?: Subscription;
};

export const PayrollEntryForm = forwardRef((
  {employeeId, allEntries, elements, ...props}: PayrollEntryItemProps, ref: Ref<EditFormRef<PayrollEntry>>
) => {
  const ctx = useContext(AlertDialogContext);

  const form = useForm<PayrollElement>({mode: 'onTouched'});
  const [item, setItem] = useState<PayrollEntry>();
  const [values, setValues] = useState<PayrollEntryValue[]>([]);
  const [readOnly, setReadOnly] = useState(true);
  const [isModified, setIsModified] = useState<boolean>(false);

  const {t} = useTranslation('payroll');
  const sub$ = useRef<Subscriptions>({});

  const dialogItemRef = useRef<EditDialogRef<PayrollEntry>>(null);
  const dialogValueRef = useRef<EditDialogRef<PayrollEntryValue>>(null);

  useImperativeHandle(ref, () => ({
    submit,
    setReadOnly: (value) => setReadOnly(value ?? true),
    isModified: () => isModified,
  }));

  useEffect(() => {
    setItem(props.item);
    setValues(props.item?.values ?? []);
  }, [props.item]);

  useEffect(() => setFormValue(item), [item]);
  useEffect(() => setFormValues(values), [values]);

  useEffect(() => () => {
    for (const [, s] of Object.entries(sub$.current)) s?.unsubscribe();
  }, []);

  function setFormValue(item: PayrollEntry | undefined) {
    if (item == null) return;
    form.setValue('element_id', item.element_id);
    form.setValue('effective_start', item.effective_start);
    form.setValue('effective_end', item.effective_end);
  }

  function setFormValues(values: PayrollEntryValue[] | undefined) {
    values?.forEach((v, i) => {
      form.setValue('effective_start_' + i as any, v.effective_start);
      form.setValue('effective_end_' + i as any, v.effective_end);
      form.setValue('entry_value_' + i as any, v.entry_value);
    });
  }

  function handleElementChange(props: FormControlRenderProps<string>, event: InputChangeEvent<string>) {
    props.onChange(event);
    const elementId = event.target.value;
    const elValues = elements?.find(d => d.element_id === elementId)?.values ?? [];
    const exValues = allEntries?.find(d => d.element_id === elementId)?.values ?? [];
    const values = elValues.map(d => {
      const x = exValues.find(d => d.input_value_id === d.input_value_id);
      return {...d, link_value: x?.link_value} as PayrollEntryValue;
    });
    setValues(values);
    setFormValues(values);
  }

  function handleEffectiveStartChange(props: FormControlRenderProps<Date>, event: InputChangeEvent<Date>) {
    props.onChange(event);
    values.forEach((d, i) => form.setValue('effective_start_' + i as any, event.target.value));
  }

  function handleEffectiveEndChange(props: FormControlRenderProps<Date>, event: InputChangeEvent<Date>) {
    props.onChange(event);
    values.forEach((d, i) => form.setValue('effective_end_' + i as any, event.target.value));
  }

  function handleHistoryChange(effective: Date | undefined, item: PayrollEntryValue, index: number) {
    sub$.current.value?.unsubscribe();
    sub$.current.value = PayrollEntrySvc.getOneValue(item.value_id!, {effective}).subscribe(res => {
      if (res == null) return;
      setValues(values.map((d, i) => (i === index) ? res : d));
    });
  }

  function handleEdit(employeeId: number, item: PayrollEntry) {
    if (!item.entry_id) return;
    dialogItemRef.current?.open(item)?.then(([cont, data]) => {
      if (!cont) return;
      PayrollEntrySvc.update(item.entry_id!, data!).subscribe(() => {
        showToast(t('common:message.update-success'));
        setItem({...item, ...data});
        setIsModified(true);
      });
    });
  }

  async function handleEditValue(value: PayrollEntryValue, index: number) {
    dialogValueRef.current?.open(value)?.then(([cont, data, addtl]) => {
      if (!cont) return;

      const params = {...addtl, effective: item?.effective_start ?? BOT};
      PayrollEntrySvc.updateValue(value.value_id!, data!, params).subscribe(() => {
        showToast(t('common:message.update-success'));
        setValues(values.map((d, i) => (i === index) ? {...value, ...data} : d));
        setIsModified(true);
      });
    });
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): PayrollEntry {
    const f = form.getValues() as Record<string, any>;
    return {
      element_id: f.element_id,
      effective_start: f.effective_start,
      effective_end: f.effective_end,
      values: values.map((d, i) => ({
        input_value_id: d.input_value_id,
        effective_start: f['effective_start_' + i],
        effective_end: f['effective_end_' + i],
        entry_value: f['entry_value_' + i],
      })),
    };
  }

  async function submit(): Promise<PayrollEntry | undefined> {
    const valid = await validate();
    return valid ? formValue() : undefined;
  }

  async function validateValue(item?: PayrollEntryValue, data?: PayrollEntryValue)
    : Promise<[boolean, Record<string, any> | undefined]> {
    if (item?.value_id == null) return [true, undefined];
    return await ctx.confirmChangeInsert(item?.effective_start, data?.effective_start);
  }

  return (
    <div className={`form-payroll-entry ${readOnly ? 'read-only' : ''}`}>
      <div className="form-item">
        <FormControl
          name="element_id" className="element-id" control={form.control} state={form.formState} label={t('label.element')}
          readOnly={readOnly} rules={{required: true}}
          render={props => (
            <InputSelect {...props} options={elements} getOptionKey={d => d.element_id} getOptionLabel={d => d.element_name}
                         readOnlyValue={item?.element_name} className="input-lg" onChange={e => handleElementChange(props, e)} />
          )}
        />

        {readOnly && <div className="form-actions">
          <IconButton role="edit" style={{gridRow: 'span 2'}} onClick={() => handleEdit(employeeId, item!)} />
        </div>}

        <FormControl
          name={['effective_start', 'effective_end']} className="effective"
          control={form.control} state={form.formState} label={t('common:label.effective-date')}
          readOnly={readOnly}
          render={props => (props.name === 'effective_start'
              ? <InputDate {...props} placeholder={t('common:label.from')} onChange={e => handleEffectiveStartChange(props, e)} />
              : <InputDate {...props} placeholder={t('common:label.to')} onChange={e => handleEffectiveEndChange(props, e)} />
          )}
        />

        <div className="form-subtitle divider"><h2>{t('header.entry-values')}</h2></div>

        <div className="d-none d-xl-block" />
        <label className="form-label block-label effective-detail">{t('common:label.effective-date')}</label>
        {readOnly && <div className="d-md-none" />}
        <label className="form-label block-label">{t('label.default-value')}</label>
        <label className="form-label block-label">{t('label.entry-value')}</label>
        {readOnly && <div className="d-none d-md-block" />}

        {values.map((value, i) => [
          <label key={'label-' + i} className="form-label label-input-value">{value.value_name}:</label>,
          <FormControl
            key={0} name={['effective_start_' + i, 'effective_end_' + i]} className="effective-detail"
            control={form.control} state={form.formState} readOnly={readOnly}
            render={(props, i) => (i === 0
                ? <InputDate {...props} placeholder={t('common:label.from')} />
                : <InputDate {...props} placeholder={t('common:label.to')} />
            )}
          />,
          readOnly
            ? <div key={1} className="form-actions d-md-none" style={{justifySelf: 'flex-end'}}>
                {value.value_id &&
                <TrackingHistory name={COMPONENT_NAME.PAYROLL_ENTRY_VALUE} id={value.value_id}
                                 onClick={effective => handleHistoryChange(effective, value, i)} />}
                <IconButton role="edit" onClick={() => handleEditValue(value, i)} />
            </div>
            : undefined,
          <FormLabel key={2} readOnly={readOnly} value={value.link_value ? value.link_value : value.default_value} />,
          <FormControl
            key={3} name={'entry_value_' + i} control={form.control} state={form.formState}
            readOnly={readOnly}
            render={props => (
              <InputText {...props} />
            )}
          />,
          readOnly
            ? <div key={4} className="form-actions d-none d-md-block" style={{justifySelf: 'flex-end'}}>
                {value.value_id &&
                <TrackingHistory name={COMPONENT_NAME.PAYROLL_ENTRY_VALUE} id={value.value_id}
                                 onClick={effective => handleHistoryChange(effective, value, i)} />}
                <IconButton role="edit" onClick={() => handleEditValue(value, i)} />
              </div>
            : undefined
        ])}
      </div>

      <EditDialog
        ref={dialogItemRef}
        title={t('header.payroll-entry')}
        content={item => <PayrollEntryFormItem item={item} />}
      />

      <EditDialog
        ref={dialogValueRef}
        title={t('header.payroll-entry-value')}
        beforeSubmit={validateValue}
        content={v => <PayrollEntryFormValue item={v} entry={item} />}
      />
    </div>
  );
});
