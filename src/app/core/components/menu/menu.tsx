/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Avatar, Icon} from '@material-ui/core';
import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple';
import {cls} from 'app/utils';
import React, {ReactNode, Ref, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import './menu.scss';
import {NavLink} from './nav-link';

export type Menu = {
  icon?: string,
  name?: string,
  avatar?: {src?: string, letter?: string},
  label?: string,
  i18nLabel?: string,
  url?: string,
  badge?: ReactNode,
  separator?: boolean,
  items?: Menu[],
};

type MenuProps = {
  className?: string;
  items: Menu[];
};

export const MenuBar = (props: MenuProps) => {
  return (
    <nav className={cls('menu-bar', props.className)}>
      <ul>
        {props.items?.map((item, i) => (
          <MenuItem key={i} menu={item} level={0} badgePosition="before" />
        ))}
      </ul>
    </nav>
  );
};

export const SidebarMenu = (props: MenuProps) => {
  return (
    <nav className={cls('sidebar-menu', props.className)}>
      <ul>
        {props.items?.map((item, i) => (
          <MenuItem key={i} menu={item} level={0} />
        ))}
      </ul>
    </nav>
  );
};

type MenuItemProps = {
  menu: Menu;
  level: number;
  badgePosition?: 'before' | 'after';
};

export const MenuItem = (props: MenuItemProps) => {

  let className = 'menu-item menu-item-lv' + (props.level ?? 0);
  if (props.menu.name) className += ' ' + props.menu.name;
  if (props.menu.separator) className += ' separator';

  return (
    <li className={className}>
      <MenuContent
        menu={props.menu}
        level={props.level ?? 0}
        badgePosition={props.badgePosition}
      />

      {props.menu.items &&
      <ul className="sub-menu">
        {props.menu.items.map((item, i) => (
          <MenuItem key={i} menu={item} level={(props.level ?? 0) + 1} />
        ))}
      </ul>}
    </li>
  );
};

type MenuContentProps = {
  menu: Menu;
  level: number;
  badgePosition?: 'before' | 'after';
};

const MenuContent = (props: MenuContentProps) => {
  const {t} = useTranslation();

  const rippleRef: Ref<any> = useRef(null);
  const onRippleStart = (e: any) => { if (e.button === 0) rippleRef.current?.start(e); };
  const onRippleStop = (e: any) => { rippleRef.current?.stop(e); };

  const badgePosition = props.badgePosition ?? 'after';

  const content: ReactNode[] = [];
  if (props.menu.avatar) {
    content.push(
      <Avatar key="avatar" className="menu-avatar" src={props.menu.avatar.src}>
        {props.menu.avatar.letter}
      </Avatar>
    );
  }
  if (props.menu.icon) {
    content.push(
      <Icon key="icon" className="menu-icon">{props.menu.icon}</Icon>
    );
  }
  if (props.menu.badge && badgePosition === 'before') {
    content.push(
      <span key="badge" className="menu-badge">{props.menu.badge}</span>
    );
  }
  if (props.menu.i18nLabel || props.menu.label) {
    content.push(
      <span key="label" className="menu-label">
        {props.menu.i18nLabel ? t(props.menu.i18nLabel) : props.menu.label}
        {props.menu.badge && badgePosition === 'before' &&
        <span className="menu-badge">{props.menu.badge}</span>
        }
      </span>
    );
  }
  return (
    <div className={'menu-item-inner menu-item-inner-lv' + (props.level ?? 0)}
         onMouseDown={onRippleStart} onMouseUp={onRippleStop}
    >
      {props.menu.url
        ? <NavLink className="menu-link" to={props.menu.url}>{content}</NavLink>
        : <span className="menu-link" tabIndex={-1}>{content}</span>
      }
      <TouchRipple ref={rippleRef} />
    </div>
  );
};
