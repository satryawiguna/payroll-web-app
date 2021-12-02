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
import {NotFound} from 'app/page';
import React from 'react';
import {PayrollEntryEditor, PayrollEntryPage, PayrollNewProcessPage, PayrollProcessPage} from '.';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Payroll = (props: RouteComponentProps) => {
  return (
    <Router primary={false} className="container">
      <PayrollEntryPage path="/payroll-entry" />
      <PayrollEntryEditor path="/payroll-entry/:action/:employeeId" />

      <PayrollProcessPage path="/payroll-process" />
      <PayrollNewProcessPage path="/payroll-process/new-process" />

      <Redirect from="/" to="payroll-process" noThrow />
      <NotFound path="/*" />
    </Router>
  );
};
