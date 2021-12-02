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
import {Button, DataTable, DataTableRef, EditDialog, EditDialogRef} from 'app/core/components';
import {ContentTitle} from 'app/core/layouts';
import {TableAction, TableLink} from 'app/modules/common';
import {showToast} from 'app/utils';
import {COMPONENT_NAME} from 'config';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Subscription} from 'rxjs';
import {PayrollElementCbx} from '../../models/payroll-element';
import {SalaryBasis} from '../../models/salary-basis';
import {PayrollElementSvc} from '../../services/payroll-element-svc';
import {SalaryBasisSvc} from '../../services/salary-basis-svc';
import {SalaryBasisForm} from './salary-basis-form';

type Subscriptions = {
  element?: Subscription;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SalaryBasisPage = (props: RouteComponentProps) => {
  const {t} = useTranslation('payroll');
  const [elements, setElements] = useState<PayrollElementCbx[]>([]);

  const tableRef = useRef<DataTableRef<SalaryBasis>>(null);
  const dialogRef = useRef<EditDialogRef<SalaryBasis>>(null);
  const sub$ = useRef<Subscriptions>({});

  useEffect(() => {
    sub$.current.element = PayrollElementSvc.listCbx({includeValues: true}).subscribe(res => setElements(res ?? []));
    return () => {
      for (const [, s] of Object.entries(sub$.current)) s?.unsubscribe();
    };
  }, []);

  function handleInsert() {
    dialogRef.current?.open()?.then(([cont, data]) => {
      if (!cont) return;
      SalaryBasisSvc.insert(data!).subscribe(() => {
        showToast(t('common:message.insert-success'));
        tableRef.current?.refresh();
      });
    });
  }

  function handleUpdate(item: SalaryBasis, index: number) {
    dialogRef.current?.open(item, {readOnly: item.is_read_only})?.then(([cont, data]) => {
      if (!cont) return;
      SalaryBasisSvc.update(item.salary_basis_id!, data!).subscribe(() => {
        showToast(t('common:message.update-success'));
        const el = elements.find(d => d.element_id === data!.element_id);
        const iv = el?.values?.find(d => d.input_value_id === data!.input_value_id);
        tableRef.current?.replaceItem(index, {
          ...item, ...data,
          element_name: el?.element_name,
          input_value_name: iv?.value_name,
        });
      });
    });
  }

  function deleteItem(confirm: boolean, item: SalaryBasis) {
    if (!confirm) return;
    SalaryBasisSvc.delete(item.salary_basis_id!).subscribe(() => {
      showToast(t('common:message.delete-success'));
      tableRef.current?.refresh();
    });
  }

  return (
    <article>
      <ContentTitle
        title={[{label: t('header.salary-basis')}]}
        actions={<Button role="add" onClick={handleInsert}>{t('common:button.add')}</Button>}
      />

      <section className="content content-list">
        <DataTable
          name={COMPONENT_NAME.SALARY_BASIS}
          ref={tableRef}
          fetchData={criteria => SalaryBasisSvc.getPage(criteria)}
          columns={[
            {name: 'salary_basis_name', label: t('label.salary-basis-name'),
              content: (item, value, index) => (
                <TableLink content={value} subContent={item.salary_basis_code} itemIsReadOnly={item.is_read_only}
                           onClick={() => handleUpdate(item, index)} />
              )},
            {name: 'element_name', label: t('label.element-name')},
            {name: 'input_value_name', label: t('label.value-name')},
            {name: 'description', label: t('common:label.description')},
          ]}
          searchOptions={[
            {name: 'salary_basis_code', label: t('label.salary-basis-code')},
            {name: 'salary_basis_name', label: t('label.salary-basis-name')},
          ]}
          sorts={['salary_basis_code']}
          actions={(item, index) => (
            <TableAction confirmLabel={item.salary_basis_name} readOnly={item.is_read_only}
                         onEdit={() => handleUpdate(item, index)} onDelete={confirm => deleteItem(confirm, item)} />
          )}
        />
      </section>

      <EditDialog
        ref={dialogRef}
        title={t('header.salary-basis')}
        content={item => <SalaryBasisForm item={item} elements={elements} />}
      />
    </article>
  );
};
