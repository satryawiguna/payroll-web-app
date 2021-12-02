/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {RouteComponentProps} from '@reach/router';
import {
  AlertDialogContext,
  Button,
  EditDialog,
  EditDialogRef,
  EditFormRef,
  FormDetailList,
  SecondaryButton,
  TrackingHistory
} from 'app/core/components';
import {ContentTitle} from 'app/core/layouts';
import {lovLabel} from 'app/modules/master';
import {showToast} from 'app/utils';
import {BOT, COMPONENT_NAME} from 'config';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Subscription} from 'rxjs';
import {ElementClassificationCbx} from '../../models/element-classification';
import {InputValue, PayrollElement, PayrollElementCbx} from '../../models/payroll-element';
import {PayrollFormula} from '../../models/payroll-formula';
import {ElementClassificationSvc} from '../../services/element-classification-svc';
import {PayrollElementSvc} from '../../services/payroll-element-svc';
import './payroll-element-editor.scss';
import {PayrollElementForm} from './payroll-element-form';
import {PayrollInputValueForm} from './payroll-input-value-form';

type PayrollElementEditorProps = RouteComponentProps & {
  action?: string;
  elementId?: string;
};

type Subscriptions = {
  item?: Subscription;
  inputValue?: Subscription;
  element?: Subscription;
  classification?: Subscription;
};

export const PayrollElementEditor = ({action, elementId, ...props}: PayrollElementEditorProps) => {
  const ctx = useContext(AlertDialogContext);

  const [item, setItem] = useState<PayrollElement>();
  const [values, setValues] = useState<InputValue[]>([]);
  const [classifications, setClassifications] = useState<ElementClassificationCbx[]>([]);
  const [retroElements, setRetroElements] = useState<PayrollElementCbx[]>([]);

  const {t} = useTranslation('payroll');

  const formRef = useRef<EditFormRef<PayrollElement>>(null);
  const dialogRef = useRef<EditDialogRef<PayrollElement>>(null);
  const sub$ = useRef<Subscriptions>({});

  useEffect(() => {
    sub$.current.classification = ElementClassificationSvc.listCbx().subscribe(res => setClassifications(res ?? []));
    return () => {
      for (const [, s] of Object.entries(sub$.current)) s?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (elementId) {
      const effective = (props.location?.state as any)?.effective;
      getItem(elementId, effective).then(item => {
        setItem(item);
        setValues(item?.values ?? []);
      });
    }
    sub$.current.element = PayrollElementSvc.listCbx({excludeId: elementId}).subscribe(res => setRetroElements(res ?? []));
  }, [elementId]);

  function getItem(elementId: string, effective?: Date): Promise<PayrollElement | undefined> {
    return new Promise(resolve => {
      sub$.current.item?.unsubscribe();
      sub$.current.item = PayrollElementSvc.getOne(elementId, {effective}).subscribe(res => resolve(res));
    });
  }

  function handleHistoryChange(effective?: Date) {
    if (!elementId) return;
    getItem(elementId, effective).then(item => {
      setItem(item);
    });
  }

  async function handleInsert() {
    const data = await formRef.current?.submit?.() as PayrollElement;
    if (data == null) return;

    data.values = values.map(d => ({
      effective_start: d.effective_start,
      effective_end: d.effective_end,
      value_code: d.value_code,
      value_name: d.value_name,
      data_type: d.data_type,
      default_value: d.default_value,
      description: d.description,
    }));
    if (!await validateInsert(data)) return;

    PayrollElementSvc.insert(data).subscribe(() => {
      showToast(t('common:message.insert-success'));
      props.navigate?.('..');
    });
  }

  async function validateInsert(data: PayrollElement): Promise<boolean> {
    if (!data.values?.length) {
      await ctx.alertInvalid({message: t('common:message.cant-empty', {item: t('header.input-value')})});
      return false;
    }
    return true;
  }

  async function beforeUpdate(item?: PayrollFormula, data?: PayrollFormula): Promise<[boolean, Record<string, any> | undefined]> {
    return await ctx.confirmChangeInsert(item?.effective_start, data?.effective_start);
  }

  async function handleUpdate() {
    const [cont, data, addtl] = await dialogRef.current?.open(item) ?? [false, undefined, undefined];
    if (!cont) return;

    setItem({...item, ...data!,
      classification_name: classifications.find(d => d.classification_id === data!.classification_id)?.classification_name,
      retro_element_name: retroElements.find(d => d.element_id === data!.retro_element_id)?.element_name,
    });

    const params = {...addtl, effective: item?.effective_start ?? BOT};
    PayrollElementSvc.update(elementId!, data!, params).subscribe(() => {
      showToast(t('common:message.update-success'));
    });
  }

  function handleDetailHistoryChange(effective: Date | undefined, item: InputValue, index: number) {
    sub$.current.inputValue?.unsubscribe();
    sub$.current.inputValue = PayrollElementSvc.getOneInputValue(item.input_value_id!, {effective}).subscribe(res => {
      if (res == null) return;
      setValues(values.map((d, i) => (i === index) ? res : d));
    });
  }

  async function validateDetail(item: InputValue | undefined, data: InputValue, options?: Record<string, any>)
    : Promise<[boolean, Record<string, any> | undefined]> {

    const existingIds = options?.existingIds ?? [];
    if (existingIds.includes(data.value_code)) {
      await ctx.alertInvalid({message: t('common:message.already-defined', {item: data.value_code})});
      return [false, undefined];
    }
    if (item?.input_value_id) {
      return await ctx.confirmChangeInsert(item?.effective_start, data.effective_start);
    }
    return [true, undefined];
  }

  async function insertDetail(data: InputValue) {
    const newItem = {...data};
    setValues([...values, newItem]);

    if (elementId) {
      PayrollElementSvc.insertInputValue(elementId, data).subscribe(res => {
        showToast(t('common:message.insert-success'));
        newItem.input_value_id = res.new_id;
        setValues([...values, newItem]);
      });
    }
  }

  async function updateDetail(item: InputValue, index: number, data: InputValue, addtl?: Record<string, any>) {
    const updated = {...item, ...data};
    setValues(values.map((d, i) => (i === index) ? updated : d));

    if (elementId) {
      const params = {...addtl, effective: item?.effective_start ?? BOT};
      PayrollElementSvc.updateInputValue(item.input_value_id!, data, params).subscribe(() => {
        showToast(t('common:message.update-success'));
      });
    }
  }

  async function deleteDetail(item: InputValue, index: number) {
    const confirm = await ctx.confirmDelete({
      i18nMessage: elementId ? 'message.confirm-permanent-delete' : 'message.confirm-delete',
      params: {item: item.value_code}
    });
    if (!confirm) return;

    setValues(values.filter((_, i) => i !== index));
    if (elementId) {
      PayrollElementSvc.deleteInputValue(item.input_value_id!).subscribe(() => (
        showToast(t('common:message.delete-success'))
      ));
    }
  }

  function goBack() {
    props.navigate?.('/compensation-admin/payroll-element');
  }

  return (
    <article>
      <ContentTitle title={[
        {label: t('header.payroll-element'), url: '/compensation-admin/payroll-element'},
        {label: t('common:title.' + action)},
      ]} />

      <section className="content content-form">
        {item?.is_read_only && <div className="alert alert-warning">{t('common:message.item-is-read-only')}</div>}

        <form noValidate className="form-payroll-element" onSubmit={async e => {e.preventDefault(); await handleInsert();}}>

          {/* == Basic Details == */}
          <div className="form-title">
            <h1>{t('common:title.basic-details')}</h1>
            {elementId &&
              <div className="form-title-actions">
                <TrackingHistory name={COMPONENT_NAME.PAYROLL_ELEMENT} id={elementId} onClick={handleHistoryChange} />
                {action !== 'view' && <SecondaryButton role="edit" onClick={handleUpdate}>{t('common:button.edit')}</SecondaryButton>}
              </div>
            }
          </div>

          <PayrollElementForm ref={formRef} item={item} classifications={classifications} retroElements={retroElements}
                              readOnly={elementId != null} />

          <EditDialog
            ref={dialogRef}
            title={t('header.payroll-element')}
            beforeSubmit={beforeUpdate}
            content={item => (
              <PayrollElementForm item={item} classifications={classifications} retroElements={retroElements} wide={false} />
            )}
          />

          {/* == Input Values == */}
          <FormDetailList
            name={COMPONENT_NAME.PAYROLL_INPUT_VALUE}
            title={t('header.input-values')}
            formTitle={t('header.input-value')}
            addButtonLabel={t('common:button.add-value')}
            readOnly={item?.is_read_only}

            getUniqueId={d => d.value_code}
            columnId="input_value_id"
            columns={[
              {name: 'value_code', label: t('label.value-code')},
              {name: 'value_name', label: t('label.value-name')},
              {name: 'data_type', label: t('common:label.data-type'), content: item => lovLabel('DATA_TYPES', item.data_type)},
              {name: 'effective_start', type: 'date', label: t('common:label.effective-start')},
              {name: 'effective_end', type: 'date', label: t('common:label.effective-end')},
              {name: 'default_value', label: t('common:label.default-value')},
            ]}
            items={values}
            withHistory={elementId != null}
            onHistoryChange={handleDetailHistoryChange}
            beforeSubmit={validateDetail}
            onInsert={insertDetail}
            onUpdate={updateDetail}
            onDelete={deleteDetail}

            dialogContent={(item) => (
              <PayrollInputValueForm item={item} />
            )}
          />

          <div className="form-actions">
            <SecondaryButton onClick={goBack}>{t('common:button.back')}</SecondaryButton>
            {!elementId && <Button type="submit" role="save">{t('common:button.save')}</Button>}
          </div>
        </form>
      </section>
    </article>
  );
};
