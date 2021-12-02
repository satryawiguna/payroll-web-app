/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Icon, Tooltip} from '@material-ui/core';
import {RouteComponentProps} from '@reach/router';
import {
  AlertDialogContext,
  FormDetailList,
  FormDetailListRef,
  IconButton,
  InputEffective,
  SecondaryButton
} from 'app/core/components';
import {ContentTitle} from 'app/core/layouts';
import {PayrollElementCbx, PayrollElementSvc} from 'app/modules/compensation-admin';
import {showToast, today} from 'app/utils';
import {COMPONENT_NAME} from 'config';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Subscription} from 'rxjs';
import {PayrollEntry, PayrollPerEntry, PayrollPerEntryRes} from '../../models/payroll-entry';
import {PayrollEntrySvc} from '../../services/payroll-entry-svc';
import './payroll-entry-editor.scss';
import {PayrollEntryEmployeeForm} from './payroll-entry-employee-form';
import {PayrollEntryEmployeeList} from './payroll-entry-employee-list';
import {PayrollEntryForm} from './payroll-entry-form';

type PayrollEntryEditorProps = RouteComponentProps & {
  action?: string;
  employeeId?: number;
};

type Subscriptions = {
  header?: Subscription;
  item?: Subscription;
  entries?: Subscription;
  element?: Subscription;
}

export const PayrollEntryEditor = (props: PayrollEntryEditorProps) => {
  const ctx = useContext(AlertDialogContext);

  const [effective, setEffective] = useState<Date>();
  const [employee, setEmployee] = useState<PayrollPerEntry>();
  const [entries, setEntries] = useState<PayrollEntry[]>([]);
  const [elements, setElements] = useState<PayrollElementCbx[]>([]);

  const {t} = useTranslation('payroll');
  const detailRef = useRef<FormDetailListRef<PayrollEntry>>(null);
  const sub$ = useRef<Subscriptions>({});

  const employeeId: number = props.employeeId ? +props.employeeId : 0;

  useEffect(() => {
    const effective = (props.location?.state as any)?.effective ?? today();
    setEffective(effective);
    sub$.current.element = PayrollElementSvc.listCbx({includeValues: true}).subscribe(res => setElements(res));
    return () => {
      for (const [, s] of Object.entries(sub$.current)) s?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (effective == null) return;
    getHeader(employeeId, effective).then(item => {
      setEmployee(item?.employee);
      setEntries(item?.entries ?? []);
    });
  }, [employeeId, effective]);

  function getHeader(employeeId: number, effective?: Date): Promise<PayrollPerEntryRes | undefined> {
    return new Promise(resolve => {
      sub$.current.header?.unsubscribe();
      sub$.current.header = PayrollEntrySvc.getEmployee(employeeId, {effective}).subscribe(res => resolve(res));
    });
  }

  function getItem(entryId: string, effective: Date | undefined): Promise<PayrollEntry | undefined> {
    return new Promise(resolve => {
      sub$.current.item?.unsubscribe();
      sub$.current.item = PayrollEntrySvc.getOne(entryId, {effective}).subscribe(res => resolve(res));
    });
  }

  async function insertItem(data: PayrollEntry) {
    PayrollEntrySvc.insert(employeeId, data).subscribe(() => {
      showToast(t('common:message.insert-success'));
      sub$.current.entries?.unsubscribe();
      sub$.current.entries = PayrollEntrySvc.getEntries(employeeId).subscribe(res => setEntries(res));
    });
  }

  async function handleAdd(item: PayrollEntry) {
    const [cont, data] = await detailRef.current?.openDialog(item) ?? [false, undefined];
    if (!cont) return;

    PayrollEntrySvc.insert(employeeId, data!).subscribe(() => {
      showToast(t('common:message.insert-success'));
      sub$.current.entries?.unsubscribe();
      sub$.current.entries = PayrollEntrySvc.getEntries(employeeId).subscribe(res => setEntries(res));
    });
  }

  async function handleEdit(entryId: string | undefined, item: PayrollEntry, index: number) {
    if (!entryId) return;
    const [, , addtl] = await detailRef.current?.openDialog(item, {readOnly: true}) ?? [false, undefined, undefined];
    if (!addtl?.isModified) return;

    getItem(entryId, effective).then(item => {
      if (!item) return;
      setEntries(entries.map((d, i) => i === index ? item : d));
    });
  }

  async function handleDelete(entryId: string | undefined, item: PayrollEntry) {
    if (!entryId) return;
    const confirm = await ctx.confirmDelete({
      i18nMessage: 'message.confirm-permanent-delete', params: {item: item.element_name}
    });
    if (!confirm) return;

    PayrollEntrySvc.delete(entryId).subscribe(() => {
      showToast(t('common:message.delete-success'));
      sub$.current.entries?.unsubscribe();
      sub$.current.entries = PayrollEntrySvc.getEntries(employeeId).subscribe(res => setEntries(res));
    });
  }

  function handleEmployeeChange(item: PayrollPerEntry) {
    props.navigate?.('../' + item.employee_id);
  }

  function goBack() {
    props.navigate?.('/payroll/payroll-entry');
  }

  function actions(item: PayrollEntry, index: number) {
    const el = [];
    if (item.entry_id) {
      el.push(<IconButton key={2} role="edit" onClick={() => handleEdit(item.entry_id, item, index)} />);
    } else {
      el.push(<IconButton key={2} role="add-circle" onClick={() => handleAdd(item)} />);
    }
    el.push(<IconButton key={3} role="delete" disabled={item.entry_id == null}
                        onClick={() => handleDelete(item.entry_id, item)} />);
    return el;
  }

  return (
    <div className="s-wrap">
      <div className="s-sidebar">
        <h2 className="s-sidebar-title">{t('master:header.employee-list')}</h2>
        <section>
          <PayrollEntryEmployeeList activeEmployeeId={employeeId} onItemClick={handleEmployeeChange} />
        </section>
      </div>
      <article className="s-main">
        <ContentTitle
          title={[
            {label: t('header.payroll-process'), url: '/payroll/payroll-process'},
            {label: t('header.entries'), url: '/payroll/payroll-entry'},
            employee?.employee_name ? {label: employee?.employee_name} : undefined,
          ]}
          actions={<InputEffective value={effective} onChange={value => setEffective(value)} />}
        />

        <section className="content content-form">
          {/* == Basic Details == */}
          <div className="form-title"><h1>{t('common:title.basic-details')}</h1></div>

          <div className="form-payroll-entry-employee">
            <PayrollEntryEmployeeForm item={employee} />
          </div>

          {/* == Entries == */}
          <FormDetailList
            ref={detailRef}
            name={COMPONENT_NAME.PAYROLL_ENTRY}
            title={t('header.entries')}
            formTitle={t('header.entry')}
            addButtonLabel={t('button.add-entry')}

            columnId="entry_id"
            columns={[
              {name: 'element_name', label: t('label.element')},
              {name: 'value_from', className: 'col-fit',
                content: (item, value) => {
                  const hasValue =  value === 'pay-per-entry';
                  const tooltip = hasValue ? t('label.entry-value') : t('label.default-from-pay-element-link');
                  const icon = hasValue ? 'checklist' : 'link';
                  return <Tooltip title={tooltip ?? ''}><Icon color={hasValue ? 'primary' : 'disabled'}>{icon}</Icon></Tooltip>;
                }},
              {name: 'effective_start', type: 'date', label: t('common:label.effective-start'), className: 'text-center'},
              {name: 'effective_end', type: 'date', label: t('common:label.effective-end'), className: 'text-center'},
              {name: 'values', label: t('label.input-values'),
                content: (item) => item.values?.map(d => d.value_name)?.join(', ')
              },
            ]}
            items={entries}
            onInsert={insertItem}
            actions={actions}

            dialogClassName="dialog-lg"
            dialogContent={item => (
              <PayrollEntryForm employeeId={employeeId} item={item} elements={elements} allEntries={entries} />
            )}
          />

          <div className="form-actions">
            <SecondaryButton onClick={goBack}>{t('common:button.back')}</SecondaryButton>
          </div>
        </section>
      </article>
    </div>
  );
};
