/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Link} from '@reach/router';
import {jsxString} from 'app/utils';
import React, {PropsWithChildren, ReactNode, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Breadcrumb} from './breadcrumb-model';
import './content-title.scss';

type ContentTitleProps = {title?: (Breadcrumb | undefined)[], actions?: ReactNode};

export const ContentTitle = (props: PropsWithChildren<ContentTitleProps>) => {
  const {t} = useTranslation('common');

  useEffect(() => {
    const appTitle = t('title.app');
    document.title = getTitle(appTitle, props.title, props.children) ?? '';
  }, [props.children, props.title, t]);

  return (
    <div className="content-title">
      <div className="content-title-inner">
        {props.title && <NavBreadcrumb items={props.title ?? []} />}
        {props.children && <h1>{props.children}</h1>}
      </div>
      {props.actions && <div className="actions">{props.actions}</div>}
    </div>
  );
};

type NavBreadcrumbProps = {
  items: (Breadcrumb | undefined)[];
};

export const NavBreadcrumb = (props: NavBreadcrumbProps) => {
  return (
    <ul className="breadcrumb">
      {props.items.filter(item => item != null).map((item, i) => (
        <li key={i} className={(props.items.length > 1 && props.items.length - 1 === i) ? 'active' : ''}>
          {item!.url ? <Link to={item!.url}>{item!.label}</Link>
                    : <span>{item!.label}</span>}
        </li>
      ))}
    </ul>
  );
};

function getTitle(appTitle: string, breadcrumb?: (Breadcrumb | undefined)[], children?: ReactNode): string | undefined {
  let subTitle;
  if (breadcrumb?.length) {
    subTitle = breadcrumb.filter(b => b != null).map(b => b!.label).filter(Boolean).join(' - ');
  } else {
    subTitle = jsxString(children);
  }
  return subTitle ? `${subTitle} - ${appTitle}` : appTitle;
}
