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
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Home = (props: RouteComponentProps) => {
  return (
    <div className="container">
      <article>
        <ContentTitle>Dashboard</ContentTitle>
      </article>
    </div>
  );
};
