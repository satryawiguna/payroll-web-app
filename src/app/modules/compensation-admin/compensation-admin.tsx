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
import {
  ElementClassificationPage,
  ElementLinkEditor,
  ElementLinkPage,
  PayrollBalanceEditor,
  PayrollBalancePage,
  PayrollElementEditor,
  PayrollElementPage,
  PayrollFormulaEditor,
  PayrollFormulaPage,
  PayrollGroupPage,
  SalaryBasisPage
} from '.';

const menus: Menu[] = [
  {i18nLabel: 'payroll:header.payroll-element', icon: 'calendar_view_day', url: '/compensation-admin/payroll-element'},
  {i18nLabel: 'payroll:header.payroll-formula', icon: 'functions', url: '/compensation-admin/payroll-formula'},
  {i18nLabel: 'payroll:header.element-link', icon: 'link', url: '/compensation-admin/element-link'},
  {i18nLabel: 'payroll:header.payroll-balance', icon: 'compare_arrows', url: '/compensation-admin/payroll-balance'},
  {i18nLabel: 'payroll:header.element-classification', icon: 'space_dashboard', url: '/compensation-admin/element-classification', separator: true},
  {i18nLabel: 'payroll:header.payroll-group', icon: 'view_module', url: '/compensation-admin/payroll-group'},
  {i18nLabel: 'payroll:header.salary-basis', icon: 'request_page', url: '/compensation-admin/salary-basis'},
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CompensationAdmin = (props: RouteComponentProps) => {
  const {t} = useTranslation('payroll');

  return (
    <div className="container">
      <div className="s-wrap">
        <aside className="s-sidebar">
          <h2 className="s-sidebar-title">{t('header.compensation-admin')}</h2>

          <SidebarMenu items={menus} />
        </aside>

        <Router primary={false} className="s-main">
          <ElementClassificationPage path="/element-classification" />
          <PayrollGroupPage path="/payroll-group" />
          <SalaryBasisPage path="/salary-basis" />

          <PayrollElementPage path="/payroll-element" />
          <PayrollElementEditor path="/payroll-element/:action" />
          <PayrollElementEditor path="/payroll-element/:action/:elementId" />

          <PayrollFormulaPage path="/payroll-formula" />
          <PayrollFormulaEditor path="/payroll-formula/:action" />
          <PayrollFormulaEditor path="/payroll-formula/:action/:formulaId" />

          <ElementLinkPage path="/element-link" />
          <ElementLinkEditor path="/element-link/:action" />
          <ElementLinkEditor path="/element-link/:action/:linkId" />

          <PayrollBalancePage path="/payroll-balance" />
          <PayrollBalanceEditor path="/payroll-balance/:action" />
          <PayrollBalanceEditor path="/payroll-balance/:action/:balanceId" />

          <Redirect from="/" to="payroll-element" noThrow />
          <NotFound path="/*" />
        </Router>
      </div>
    </div>
  );
};
