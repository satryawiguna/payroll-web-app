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
import {ContentTitle} from 'app/core/layouts';
import {parseISO} from 'date-fns';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {PayslipDoc} from './payslip-doc';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PayslipReport = (props: RouteComponentProps) => {
  const {t} = useTranslation('payroll');

  const [employeeId] = useState(1);
  const [periodStart] = useState(parseISO('2021-04-01'));
  const [periodEnd] = useState(parseISO('2021-04-30'));

  return (
    <article>
      <ContentTitle>{t('header.payslip')}</ContentTitle>
      <section className="content">
        <div className="payslip-doc-wrap">
          <PayslipDoc employeeId={employeeId} periodStart={periodStart} periodEnd={periodEnd} />
        </div>
      </section>
    </article>
  );
};
