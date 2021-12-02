/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Icon} from '@material-ui/core';
import {RouteComponentProps} from '@reach/router';
import {Button, DataTable, DataTableRef} from 'app/core/components';
import {ContentTitle} from 'app/core/layouts';
import {TableAction, TableLink} from 'app/modules/common';
import {LOV, lovLabel} from 'app/modules/master';
import {BOT, COMPONENT_NAME} from 'config';
import React, {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Subscription} from 'rxjs';
import {showToast} from '../../../../utils';
import {PayrollFormula} from '../../models/payroll-formula';
import {PayrollFormulaSvc} from '../../services/payroll-formula-svc';

type Subscriptions = {
  history?: Subscription;
};

export const PayrollFormulaPage = (props: RouteComponentProps) => {
  const {t} = useTranslation('payroll');
  const tableRef = useRef<DataTableRef<PayrollFormula>>(null);
  const sub$ = useRef<Subscriptions>({});

  useEffect(() => {
    return () => {
      for (const [, s] of Object.entries(sub$.current)) s?.unsubscribe();
    };
  }, []);

  function handleHistoryChange(effective: Date | undefined, item: PayrollFormula, index: number) {
    sub$.current.history?.unsubscribe();
    sub$.current.history = PayrollFormulaSvc.getOne(item.formula_id!, {effective}).subscribe(res => {
      if (res != null) tableRef.current?.replaceItem(index, res);
    });
  }

  function handleUpdate(item: PayrollFormula, segment: string) {
    props.navigate?.(`${segment}/${item.formula_id}`, {state: {effective: item.effective_start ?? BOT}});
  }

  function deleteItem(confirm: boolean, item: PayrollFormula) {
    if (!confirm) return;
    PayrollFormulaSvc.delete(item.formula_id!).subscribe(() => {
      showToast(t('common:message.delete-success'));
      tableRef.current?.refresh();
    });
  }

  return (
    <article>
      <ContentTitle
        title={[{label: t('header.payroll-formula')}]}
        actions={<Button role="add" onClick={() => props.navigate?.('add')}>{t('common:button.add')}</Button>}
      />

      <section className="content content-list">
        <DataTable
          name={COMPONENT_NAME.PAYROLL_FORMULA}
          ref={tableRef}
          fetchData={criteria => PayrollFormulaSvc.getPage(criteria)}
          columns={[
            {name: 'formula_name', label: t('label.formula-name'),
              content: (item, value) => (
                <TableLink content={value} subContent={item.formula_def} itemIsReadOnly={item.is_read_only}
                           onClick={segment => handleUpdate(item, segment)} />
              )},
            {name: 'element_name', label: t('label.element-name')},
            {name: 'formula_type', label: t('label.formula-type'),
              content: (item, value) => (
                <div className="d-flex">
                  <Icon key={1} className="cell-muted mr-1">{(value === 'SP') ? 'settings_suggest' : 'functions'}</Icon>
                  <span key={2}>{lovLabel('FORMULA_TYPES', item.formula_type)}</span>
                </div>
              )},
            {name: 'result_elements', label: t('label.result-elements'),
              content: (item) => (
                <span className="trim-350">
                  {(item.result_elements as string)?.split(',')?.map(d => d?.trim())?.filter(d => Boolean(d)).map((d, i) => {
                    const el = d === item.element_name ? <>{d}<span className="text-muted ml-1">({t('common:label.itself')})</span></> : d;
                    return <span key={i}>{(i > 0) ? ', ' : ''}{el}</span>;
                  })}
                </span>
              )},
            {name: 'effective_start', type: 'date', label: t('common:label.effective-start'), className: 'text-center'},
            {name: 'effective_end', type: 'date', label: t('common:label.effective-end'), className: 'text-center'},
            {name: 'description', label: t('common:label.description')},
          ]}
          searchOptions={[
            {name: 'formula_name', label: t('label.formula-name')},
            {name: 'formula_type', label: t('label.formula-type'), options: LOV['FORMULA_TYPES']},
          ]}
          sorts={['formula_name']}
          actions={(item, index) => (
            <TableAction
              confirmLabel={item.formula_name} readOnly={item.is_read_only}
              onEdit={segment => handleUpdate(item, segment)} onDelete={confirm => deleteItem(confirm, item)}
              history={{
                name: COMPONENT_NAME.PAYROLL_FORMULA,
                id: item.formula_id,
                onClick: effective => handleHistoryChange(effective, item, index),
              }}
            />
          )}
        />
      </section>
    </article>
  );
};
