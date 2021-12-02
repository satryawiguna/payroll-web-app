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
import {Button, DataTable, DataTableRef} from 'app/core/components';
import {ContentTitle} from 'app/core/layouts';
import {TableAction, TableLink} from 'app/modules/common';
import {lovLabel} from 'app/modules/master';
import {COMPONENT_NAME} from 'config';
import React, {useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {showToast} from '../../../../utils';
import {PayrollBalance} from '../../models/payroll-balance';
import {PayrollBalanceSvc} from '../../services/payroll-balance-svc';

export const PayrollBalancePage = (props: RouteComponentProps) => {
  const {t} = useTranslation('payroll');
  const tableRef = useRef<DataTableRef<PayrollBalance>>(null);

  function handleUpdate(item: PayrollBalance, segment: string) {
    props.navigate?.(`${segment}/${item.balance_id}`);
  }

  function deleteItem(confirm: boolean, item: PayrollBalance) {
    if (!confirm) return;
    PayrollBalanceSvc.delete(item.balance_id!).subscribe(() => {
      showToast(t('common:message.delete-success'));
      tableRef.current?.refresh();
    });
  }

  return (
    <article>
      <ContentTitle
        title={[{label: t('header.payroll-balance')}]}
        actions={<Button role="add" onClick={() => props.navigate?.('add')}>{t('common:button.add')}</Button>}
      />

      <section className="content content-list">
        <DataTable
          name={COMPONENT_NAME.PAYROLL_BALANCE}
          ref={tableRef}
          fetchData={criteria => PayrollBalanceSvc.getPage(criteria)}
          columns={[
            {name: 'balance_name', label: t('label.balance-name'),
              content: (item, value) => (
                <TableLink content={value} itemIsReadOnly={item.is_read_only} onClick={segment => handleUpdate(item, segment)} />
              )},
            {name: 'balance_feed_type', label: t('label.balance-feed-type'),
              content: (item, value) => (
                lovLabel('BALANCE_FEED_TYPE', value)
              )},
            {name: 'description', label: t('common:label.description')},
          ]}
          sorts={['balance_name']}
          actions={item => (
            <TableAction
              confirmLabel={item.balance_name} readOnly={item.is_read_only}
              onEdit={segment => handleUpdate(item, segment)} onDelete={confirm => deleteItem(confirm, item)}
            />
          )}
        />
      </section>
    </article>
  );
};
