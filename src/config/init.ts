/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import {initReactI18next} from 'react-i18next';

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {escapeValue: false},
    ns: ['common', 'master', 'payroll'],
  });
