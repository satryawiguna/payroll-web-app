/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Loading} from 'app/core/layouts';
import {lazy} from 'app/utils';
import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './config/init';
import reportWebVitals from './reportWebVitals';

const {App} = lazy(() => import('app/app'), 'App');

console.log('%c🐒 Hello wonderful person...', 'font: italic x-large serif; color: #0288d1; padding: 8px 0');

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<Loading message="Please Wait..." />}>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
