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
import {Footer} from 'app/core/layouts';
import React, {Fragment} from 'react';
import './login-page.scss';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const LoginPage = (props: RouteComponentProps) => {
  return (
    <Fragment>
      <header className="login-header">Lojin</header>
      <article className="login-content">

      </article>
      <Footer />
    </Fragment>
  );
};
