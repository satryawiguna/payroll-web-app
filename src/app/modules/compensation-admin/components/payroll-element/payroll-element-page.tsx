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
import {BOT, COMPONENT_NAME} from 'config';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Subscription} from 'rxjs';
import {SearchOptionList} from '../../../../core/models';
import {showToast} from '../../../../utils';
import {PayrollElement} from '../../models/payroll-element';
import {PayrollFormula} from '../../models/payroll-formula';
import {ElementClassificationSvc} from '../../services/element-classification-svc';
import {PayrollElementSvc} from '../../services/payroll-element-svc';

type Subscriptions = {
  history?: Subscription;
  classification?: Subscription;
}

export const PayrollElementPage = (props: RouteComponentProps) => {
  const [classifications, setClassifications] = useState<SearchOptionList[]>([]);
  const {t} = useTranslation('payroll');
  const tableRef = useRef<DataTableRef<PayrollElement>>(null);
  const sub$ = useRef<Subscriptions>({});

  useEffect(() => {
    sub$.current.classification = ElementClassificationSvc.listIdLabel().subscribe(res => setClassifications(res));
    return () => {
      for (const [, s] of Object.entries(sub$.current)) s?.unsubscribe();
    };
  }, []);

  function handleHistoryChange(effective: Date | undefined, item: PayrollElement, index: number) {
    sub$.current.history?.unsubscribe();
    sub$.current.history = PayrollElementSvc.getOne(item.element_id!, {effective}).subscribe(res => {
      if (res != null) tableRef.current?.replaceItem(index, res);
    });
  }

  function handleUpdate(item: PayrollFormula, segment: string) {
    props.navigate?.(`${segment}/${item.element_id}`, {state: {effective: item.effective_start ?? BOT}});
  }

  function deleteItem(confirm: boolean, item: PayrollElement) {
    if (!confirm) return;
    PayrollElementSvc.delete(item.element_id!).subscribe(() => {
      showToast(t('common:message.delete-success'));
      tableRef.current?.refresh();
    });
  }

  return (
    <article>
      <ContentTitle
        title={[{label: t('header.payroll-element')}]}
        actions={<Button role="add" onClick={() => props.navigate?.('add')}>{t('common:button.add')}</Button>}
      />

      <section className="content content-list">
        <DataTable
          name={COMPONENT_NAME.PAYROLL_ELEMENT}
          ref={tableRef}
          fetchData={criteria => PayrollElementSvc.getPage(criteria)}
          columns={[
            {name: 'element_name', label: t('label.element-name'),
              content: (item, value) => (
                <TableLink content={value} subContent={item.element_code} itemIsReadOnly={item.is_read_only}
                           onClick={segment => handleUpdate(item, segment)} />
              )},
            {name: 'classification_name', label: t('label.classification')},
            {name: 'processing_priority', type: 'number', label: t('label.processing-priority'), className: 'text-center'},
            {name: 'is_recurring', type: 'check-none', label: t('label.recurring'), className: 'text-center'},
            {name: 'is_once_per_period', type: 'check-none', label: t('label.once-each-period'), className: 'text-center'},
            {name: 'input_value_names', label: t('label.input-values')},
            {name: 'effective_start', type: 'date', label: t('common:label.effective-start'), className: 'text-center'},
            {name: 'effective_end', type: 'date', label: t('common:label.effective-end'), className: 'text-center'},
            {name: 'description', label: t('common:label.description')},
          ]}
          searchOptions={[
            {name: 'element_code', label: t('label.element-code')},
            {name: 'element_name', label: t('label.element-name')},
            {name: 'classification_id', label: t('label.classification'), options: classifications},
          ]}
          sorts={['processing_priority', 'element_code']}
          actions={(item, index) => (
            <TableAction
              confirmLabel={item.element_name} readOnly={item.is_read_only}
              onEdit={segment => handleUpdate(item, segment)} onDelete={confirm => deleteItem(confirm, item)}
              history={{
                name: COMPONENT_NAME.PAYROLL_ELEMENT,
                id: item.element_id,
                onClick: effective => handleHistoryChange(effective, item, index),
              }}
            />
          )}
        />
      </section>
    </article>
  );
};
