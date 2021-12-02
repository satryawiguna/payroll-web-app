/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import _ from 'lodash';
import React from 'react';

export type Modify<T, R> = Omit<T, keyof R> & R

export const globalVars: GlobalVars | undefined = undefined;

export type GlobalVars = {
  sowConfirmDialog: (confirm: boolean) => void;
};

export function cls(...names: (string | undefined)[]) {
  let ret = '';
  for (const n of names) {
    if (n) ret += ' ' + n;
  }
  return ret;
}

export function jsxString(component?: any): string | undefined {
  if (!component) return undefined;
  if (_.isString(component)) return component;

  let ret = '';
  const props = (_.isArray(component) ? component.map(c => c.props) : [component.props]);
  for (const prop of props) {
    const str = jsxString(prop?.children);
    if (str) ret += str;
  }
  return ret;
}

export function lazy<T extends React.ComponentType<any>, I extends { [K2 in K]: T }, K extends keyof I>(
  factory: () => Promise<I>,
  name: K
): I {
  return Object.create({
    [name]: React.lazy(() => factory().then(module => ({default: module[name]})))
  });
}
