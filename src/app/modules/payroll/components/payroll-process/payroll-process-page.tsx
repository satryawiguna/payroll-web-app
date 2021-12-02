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
import {Button, DataTable, DataTableRef, SecondaryButton} from 'app/core/components';
import {ContentTitle} from 'app/core/layouts';
import {COMPONENT_NAME} from 'config';
import React, {useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {formatNumber} from '../../../../utils';
import {TableLink} from '../../../common';
import {PayrollProcessSum} from '../../models/payroll-process';
import {PayrollProcessSvc} from '../../services/payroll-process-svc';

export const PayrollProcessPage = (props: RouteComponentProps) => {
  const {t} = useTranslation('payroll');
  const tableRef = useRef<DataTableRef<PayrollProcessSum>>(null);

  return (
    <article>
      <ContentTitle
        title={[{label: t('header.payroll-process')}]}
        actions={[
          <SecondaryButton color="primary" key="entry" icon="tune" onClick={() => props.navigate?.('/payroll/payroll-entry')}>
            {t('button.payroll-entry')}
          </SecondaryButton>,
          <SecondaryButton color="warn" key="retro" icon="settings_backup_restore" onClick={() => props.navigate?.('new-retro')}>
            {t('button.retro-pay')}
          </SecondaryButton>,
          <Button key="new" role="add" onClick={() => props.navigate?.('new-process')}>
            {t('button.new-process')}
          </Button>,
        ]}
      />

      <section className="content content-list">
        <DataTable
          name={COMPONENT_NAME.PAYROLL_PROCESS}
          ref={tableRef}
          fetchData={criteria => PayrollProcessSvc.getSummary(criteria)}
          columns={[
            {name: 'batch_name', label: t('label.batch-name'),
              content: (item, value) => (
                <TableLink content={value} onClick={() => props.navigate?.('view/' + item.process_id)} />
              )},
            {name: 'period_start', label: t('label.payroll-period')},
            {name: 'process_date', type: 'date', label: t('common:label.process-date')},
            {name: 'total_count', label: t('common:label.processed-count'), content: (item) => (
                formatNumber(item.success_count) + '/' + formatNumber(item.total_count)
              )},
            {name: 'failed_count', type: 'number', label: t('common:label.failed-count')},
            {name: 'process_status', label: t('common:label.process-status')},
            {name: 'description', label: t('common:label.description')},
          ]}
        />
      </section>
    </article>
  );
};
