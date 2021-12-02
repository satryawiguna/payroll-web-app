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
import {Footer, GlobalProgress, Loading, NavHeader} from 'app/core/layouts';
import React, {Fragment, Suspense} from 'react';
import {useTranslation} from 'react-i18next';
import {Home, NotFound} from '../page';
import {lazy} from '../utils';

const {CompensationAdmin} = lazy(() => import('app/modules/compensation-admin'), 'CompensationAdmin');
const {Payroll} = lazy(() => import('app/modules/payroll'), 'Payroll');
const {Report} = lazy(() => import('app/modules/report'), 'Report');
const {About} = lazy(() => import('app/page'), 'About');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Main = (props: RouteComponentProps) => {
  const {t} = useTranslation('common');
  return (
    <Fragment>
      <GlobalProgress />
      <NavHeader />

      <Suspense fallback={
        <div className="main-loading-container">
          <Loading message={t('message.please-wait')} />
        </div>
      }>
        <Router primary={false} component="main" id="route-lv1" className="main">
          <Redirect from="/" to="/home" noThrow />
          <Home path="/home" />
          <About path="/about" />

          <CompensationAdmin path="/compensation-admin/*" />
          <Payroll path="/payroll/*" />
          <Report path="/report/*" />

          <NotFound path="/*" />
        </Router>
      </Suspense>

      <Footer />
    </Fragment>
  );
};
