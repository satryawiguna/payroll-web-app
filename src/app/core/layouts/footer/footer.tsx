/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Icon, Link} from '@material-ui/core';
import {BUILD_VERSION, BUILD_YEAR, PARENT_SITE} from 'config';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {NavLink} from '../../components';
import './footer.scss';

export const Footer: FC = () => {
  const {t} = useTranslation('common');
  return (
    <footer className="footer">
      <div className="container">
        <ul>
          <li>{t('title.app')} v{BUILD_VERSION}</li>
          <li>{t('label.copyright', {year: BUILD_YEAR})}</li>
          <li>
            <Link target="_blank" href={`${PARENT_SITE}/user-guide`}>{t('label.user-guide')} <Icon>open_in_new</Icon></Link>
          </li>
          <li>
            <NavLink to="/about">{t('label.about-app')}</NavLink>
          </li>
        </ul>
      </div>
    </footer>
  );
};
