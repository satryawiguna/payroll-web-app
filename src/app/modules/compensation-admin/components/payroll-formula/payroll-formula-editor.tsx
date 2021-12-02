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
import {FormulaList, FormulaListSvc} from 'app/modules/master';
import {showToast} from 'app/utils';
import {BOT, COMPONENT_NAME} from 'config';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Subscription} from 'rxjs';
import {PayrollElementCbx} from '../../models/payroll-element';
import {FormulaResult, FormulaType, PayrollFormula} from '../../models/payroll-formula';
import {PayrollElementSvc} from '../../services/payroll-element-svc';
import {PayrollFormulaSvc} from '../../services/payroll-formula-svc';
import {PayrollFormulaForm} from './payroll-formula-form';
import {PayrollFormulaResultForm} from './payroll-formula-result-form';

type PayrollFormulaEditorProps = RouteComponentProps & {
  action?: string;
  formulaId?: string;
};

type Subscriptions = {
  item?: Subscription;
  result?: Subscription;
  formulaList?: Subscription;
  element?: Subscription;
};

export const PayrollFormulaEditor = ({action, formulaId, ...props}: PayrollFormulaEditorProps) => {
  const ctx = useContext(AlertDialogContext);

  const [item, setItem] = useState<PayrollFormula>();
  const [results, setResults] = useState<FormulaResult[]>([]);
  const [formulaType, setFormulaType] = useState<FormulaType>();
  const [formulaList, setFormulaList] = useState<FormulaList[]>([]);
  const [elements, setElements] = useState<PayrollElementCbx[]>([]);

  const {t} = useTranslation('payroll');

  const formRef = useRef<EditFormRef<PayrollFormula>>(null);
  const dialogRef = useRef<EditDialogRef<PayrollFormula>>(null);
  const sub$ = useRef<Subscriptions>({});

  useEffect(() => {
    sub$.current.formulaList = FormulaListSvc.listCbx().subscribe(res => setFormulaList(res ?? []));
    sub$.current.element = PayrollElementSvc.listCbx({includeValues: true}).subscribe(res => setElements(res ?? []));
    return () => {
      for (const [, s] of Object.entries(sub$.current)) s?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const effective = (props.location?.state as any)?.effective;
    if (formulaId) {
      getItem(formulaId, effective).then(item => {
        setItem(item);
        setFormulaType(item?.formula_type);
        setResults(item?.results ?? []);
      });
    }
  }, [formulaId]);

  function getItem(formulaId: string, effective?: Date): Promise<PayrollFormula | undefined> {
    return new Promise(resolve => {
      sub$.current.item?.unsubscribe();
      sub$.current.item = PayrollFormulaSvc.getOne(formulaId, {effective}).subscribe(res => resolve(res));
    });
  }

  function handleHistoryChange(effective?: Date) {
    if (!formulaId) return;
    getItem(formulaId, effective).then(item => {
      setItem(item);
      setFormulaType(item?.formula_type);
    });
  }

  async function handleInsert() {
    const data = await formRef.current?.submit?.() as PayrollFormula;
    if (data == null) return;
    data.results = results.map(d => ({
      effective_start: d.effective_start,
      effective_end: d.effective_end,
      result_code: d.result_code,
      element_id: d.element_id,
      input_value_id: d.input_value_id,
      formula_expr: (data.formula_type === 'FX') ? d.formula_expr : undefined,
    }));
    if (!await validateInsert(data)) return;

    PayrollFormulaSvc.insert(data).subscribe(() => {
      showToast(t('common:message.insert-success'));
      props.navigate?.('..');
    });
  }

  async function validateInsert(data: PayrollFormula): Promise<boolean> {
    if (!data.results?.length) {
      await ctx.alertInvalid({message: t('common:message.cant-empty', {item: t('header.formula-result')})});
      return false;
    }
    for (const d of data.results) {
      if (formulaType === 'FX' && !d.formula_expr) {
        await ctx.alertInvalid({message: t('message.empty-result-formula-expr')});
        return false;
      }
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
      element_name: elements.find(d => d.element_id === data!.element_id)?.element_name,
    });
    setFormulaType(data!.formula_type);

    const params = {...addtl, effective: item?.effective_start ?? BOT};
    PayrollFormulaSvc.update(formulaId!, data!, params).subscribe(() => {
      showToast(t('common:message.update-success'));
    });
  }

  function handleDetailHistoryChange(effective: Date | undefined, item: FormulaResult, index: number) {
    sub$.current.result?.unsubscribe();
    sub$.current.result = PayrollFormulaSvc.getOneFormulaResult(item.result_id!, {effective}).subscribe(res => {
      if (res == null) return;
      setResults(results.map((d, i) => (i === index) ? res : d));
    });
  }

  async function validateDetail(item: FormulaResult | undefined, data: FormulaResult, options?: Record<string, any>)
    : Promise<[boolean, Record<string, any> | undefined]> {

    const existingIds = options?.existingIds ?? [];
    if (existingIds.includes(data.result_code)) {
      await ctx.alertInvalid({message: t('common:message.already-defined', {item: data.result_code})});
      return [false, undefined];
    }
    if (item?.result_id) {
      return await ctx.confirmChangeInsert(item?.effective_start, data.effective_start);
    }
    return [true, undefined];
  }

  async function insertDetail(data: FormulaResult) {
    const el = elements.find(d => d.element_id === data.element_id);
    const iv = el?.values?.find(d => d.input_value_id === data.input_value_id);
    const newItem = {...data, element_name: el?.element_name, input_value_name: iv?.value_name};
    setResults([...results, newItem]);

    if (formulaId) {
      PayrollFormulaSvc.insertFormulaResult(formulaId, data).subscribe(res => {
        showToast(t('common:message.insert-success'));
        newItem.result_id = res.new_id;
        setResults([...results, newItem]);
      });
    }
  }

  async function updateDetail(item: FormulaResult, index: number, data: FormulaResult, addtl?: Record<string, any>) {
    const el = elements.find(d => d.element_id === data.element_id);
    const iv = el?.values?.find(d => d.input_value_id === data.input_value_id);
    const updated = {...item, ...data, element_name: el?.element_name, input_value_name: iv?.value_name};
    setResults(results.map((d, i) => (i === index) ? updated : d));

    if (formulaId) {
      const params = {...addtl, effective: item?.effective_start ?? BOT};
      PayrollFormulaSvc.updateFormulaResult(item.result_id!, data, params).subscribe(() => {
        showToast(t('common:message.update-success'));
      });
    }
  }

  async function deleteDetail(item: FormulaResult, index: number) {
    const confirm = await ctx.confirmDelete({
      i18nMessage: formulaId ? 'message.confirm-permanent-delete' : 'message.confirm-delete',
      params: {item: item.result_code}
    });
    if (!confirm) return;

    setResults(results.filter((_, i) => i !== index));
    if (formulaId) {
      PayrollFormulaSvc.deleteFormulaResult(item.result_id!).subscribe(() => (
        showToast(t('common:message.delete-success'))
      ));
    }
  }

  function goBack() {
    props.navigate?.('/compensation-admin/payroll-formula');
  }

  return (
    <article>
      <ContentTitle title={[
        {label: t('header.payroll-formula'), url: '/compensation-admin/payroll-formula'},
        {label: t('common:title.' + action)}
      ]} />

      <section className="content content-form">
        {item?.is_read_only && <div className="alert alert-warning">{t('common:message.item-is-read-only')}</div>}

        <form noValidate className="form-payroll-formula" onSubmit={async e => {e.preventDefault(); await handleInsert();}}>

          {/* == Basic Details == */}
          <div className="form-title">
            <h1>{t('common:title.basic-details')}</h1>
            {formulaId &&
              <div className="form-title-actions">
                <TrackingHistory name={COMPONENT_NAME.PAYROLL_FORMULA} id={formulaId} onClick={handleHistoryChange} />
                {action !== 'view' && <SecondaryButton role="edit" onClick={handleUpdate}>{t('common:button.edit')}</SecondaryButton>}
              </div>
            }
          </div>

          <PayrollFormulaForm
            ref={formRef}
            item={item}
            elements={elements}
            formulaList={formulaList}
            readOnly={formulaId != null}
            formulaTypeChange={e => setFormulaType(e.target.value)}
            formulaTypeIsDisabled={Boolean(results.length)}
          />

          <EditDialog
            ref={dialogRef}
            title={t('header.payroll-formula')}
            beforeSubmit={beforeUpdate}
            content={item => (
              <PayrollFormulaForm item={item} elements={elements} formulaList={formulaList}
                                  formulaTypeIsDisabled={Boolean(results.length)} />
            )}
          />

          {/* == Formula Result == */}
          <FormDetailList
            name={COMPONENT_NAME.PAYROLL_FORMULA_RESULT}
            title={t('header.formula-results')}
            formTitle={t('header.formula-result')}
            addButtonLabel={t('button.add-result')}
            addButtonDisabled={formulaType == null}
            readOnly={item?.is_read_only}

            getUniqueId={d => d.result_code}
            columnId="result_id"
            columns={[
              {name: 'result_code', label: t('label.result-code')},
              {name: 'element_name', label: t('label.result-element')},
              {name: 'input_value_name', label: t('label.result-input-value')},
              (formulaType === 'FX') ? {name: 'formula_expr', label: t('label.formula-expr')} : undefined,
              {name: 'effective_start', type: 'date', label: t('common:label.effective-start')},
              {name: 'effective_end', type: 'date', label: t('common:label.effective-end')},
            ]}
            items={results}
            withHistory={formulaId != null}
            onHistoryChange={handleDetailHistoryChange}
            beforeSubmit={validateDetail}
            onInsert={insertDetail}
            onUpdate={updateDetail}
            onDelete={deleteDetail}

            dialogContent={(item) => (
              <PayrollFormulaResultForm formulaType={formulaType} item={item} elements={elements} />
            )}
          />

          <div className="form-actions">
            <SecondaryButton onClick={goBack}>{t('common:button.back')}</SecondaryButton>
            {!formulaId && <Button type="submit" role="save">{t('common:button.save')}</Button>}
          </div>
        </form>
      </section>

    </article>
  );
};
