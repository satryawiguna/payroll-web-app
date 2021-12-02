/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import React, {FC} from 'react';
import {Menu, MenuBar} from '../../components';
import './nav-header.scss';

const menus: Menu[] = [
  {i18nLabel: 'common:menu.dashboard', url: '/home'},
  {i18nLabel: 'common:menu.payroll-process', url: '/payroll'},
  {i18nLabel: 'common:menu.compensation-admin', url: '/compensation-admin'},
  {i18nLabel: 'common:menu.report', url: '/report'},
];

export const NavHeader: FC = () => {
  return (
    <header className="header">
      <div className="header-bar">
        <div className="container">

          {/* Logo & Title */}
          <div className="app-logo">
            <img src="/img/logo.png" alt="Logo" />
          </div>
          <div className="app-title">
            <span className="title-1">Smart</span><span className="title-2">Biz</span>
            <span className="small">Payroll</span>
          </div>

          <MenuBar className="main-menu" items={menus} />

          <div className="flex-grow-1" />

          {/* Utility Menu */}
          <MenuBar className="utility-menu" items={[
            {name: 'notification', badge: 5, icon: 'notifications'},
            {label: 'Adi Sayoga', avatar: {letter: 'AS'}, url: '/login'},
          ]} />
        </div>
      </div>
    </header>
  );
};
