/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Redirect, RouteComponentProps, Router} from '@reach/router';
import {Menu, SidebarMenu} from 'app/core/components';
import {NotFound} from 'app/page';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {PayslipReport} from './components/payroll-report/payslip-report';

const menus: Menu[] = [
  {i18nLabel: 'payroll:header.payslip', icon: 'receipt', url: '/report/payslip'},
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Report = (props: RouteComponentProps) => {
  const {t} = useTranslation('common');

  return (
    <div className="container">
      <div className="s-wrap">
        <aside className="s-sidebar">
          <h2 className="s-sidebar-title">{t('menu.report')}</h2>

          <SidebarMenu items={menus} />
        </aside>

        <Router primary={false} className="s-main">
          <PayslipReport path="/payslip" />
          <Redirect from="/" to="payslip" noThrow />
          <NotFound path="/*" />
        </Router>
      </div>
    </div>
  );
};
