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
import {AlertDialogContext, Button, DataTable, DataTableRef, EditDialog, EditDialogRef} from 'app/core/components';
import {ContentTitle} from 'app/core/layouts';
import {TableAction, TableLink} from 'app/modules/common';
import {showToast} from 'app/utils';
import {BOT, COMPONENT_NAME} from 'config';
import React, {useContext, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Subscription} from 'rxjs';
import {PayrollGroup} from '../../models/payroll-group';
import {PayrollGroupSvc} from '../../services/payroll-group-svc';
import {PayrollGroupForm} from './payorll-group-form';

type Subscriptions = {
  history?: Subscription;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PayrollGroupPage = (props: RouteComponentProps) => {
  const ctx = useContext(AlertDialogContext);
  const {t} = useTranslation('payroll');

  const tableRef = useRef<DataTableRef<PayrollGroup>>(null);
  const dialogRef = useRef<EditDialogRef<PayrollGroup>>(null);
  const sub$ = useRef<Subscriptions>({});

  useEffect(() => {
    return () => {
      for (const [, s] of Object.entries(sub$.current)) s?.unsubscribe();
    };
  }, []);

  function handleHistoryChange(effective: Date | undefined, item: PayrollGroup, index: number) {
    sub$.current.history?.unsubscribe();
    sub$.current.history = PayrollGroupSvc.getOne(item.pay_group_id!, {effective}).subscribe(res => {
      if (res != null) tableRef.current?.replaceItem(index, res);
    });
  }

  function handleInsert() {
    dialogRef.current?.open()?.then(([cont, data]) => {
      if (!cont) return;
      PayrollGroupSvc.insert(data!).subscribe(() => {
        showToast(t('common:message.insert-success'));
        tableRef.current?.refresh();
      });
    });
  }

  async function beforeUpdate(item?: PayrollGroup, existing?: PayrollGroup): Promise<[boolean, Record<string, any> | undefined]> {
    if (existing?.pay_group_id == null) return [true, undefined];
    return await ctx.confirmChangeInsert(existing?.effective_start, item?.effective_start);
  }

  function handleUpdate(item: PayrollGroup, index: number) {
    dialogRef.current?.open(item, {readOnly: item.is_read_only})?.then(([cont, data, addtl]) => {
      if (!cont) return;
      const params = {...addtl, effective: item?.effective_start ?? BOT};
      PayrollGroupSvc.update(item.pay_group_id!, data!, params).subscribe(() => {
        showToast(t('common:message.update-success'));
        tableRef.current?.replaceItem(index, {...item, ...data});
      });
    });
  }

  function deleteItem(confirm: boolean, item: PayrollGroup) {
    if (!confirm) return;
    PayrollGroupSvc.delete(item.pay_group_id!).subscribe(() => {
      showToast(t('common:message.delete-success'));
      tableRef.current?.refresh();
    });
  }

  return (
    <article>
      <ContentTitle
        title={[{label: t('header.payroll-group')}]}
        actions={<Button role="add" onClick={handleInsert}>{t('common:button.add')}</Button>}
      />

      <section className="content content-list">
        <DataTable
          name={COMPONENT_NAME.PAYROLL_GROUP}
          ref={tableRef}
          fetchData={criteria => PayrollGroupSvc.getPage(criteria)}
          columns={[
            {name: 'pay_group_name', label: t('label.payroll-group-name'),
              content: (item, value, index) => (
                <TableLink content={value} itemIsReadOnly={item.is_read_only} onClick={() => handleUpdate(item, index)} />
              )},
            {name: 'effective_start', type: 'date', label: t('common:label.effective-start'), className: 'text-center'},
            {name: 'effective_end', type: 'date', label: t('common:label.effective-end'), className: 'text-center'},
            {name: 'description', label: t('common:label.description')},
          ]}
          sorts={['pay_group_name']}
          actions={(item, index) => (
            <TableAction
              confirmLabel={item.pay_group_name} readOnly={item.is_read_only}
              onEdit={() => handleUpdate(item, index)} onDelete={confirm => deleteItem(confirm, item)}
              history={{
                name: COMPONENT_NAME.PAYROLL_GROUP,
                id: item.pay_group_id,
                onClick: effective => handleHistoryChange(effective, item, index),
              }}
            />
          )}
        />
      </section>

      <EditDialog
        ref={dialogRef}
        title={t('header.payroll-group')}
        beforeSubmit={beforeUpdate}
        content={item => <PayrollGroupForm item={item} />}
      />
    </article>
  );
};
