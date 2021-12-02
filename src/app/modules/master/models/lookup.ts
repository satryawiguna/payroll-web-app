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

export type LovType = 'DATA_TYPES' | 'FORMULA_TYPES' | 'BALANCE_FEED_TYPE' | 'ADD_SUBTRACT'
                    | 'PEOPLE_GROUP' | 'EMPLOYEE_CATEGORY';

export type LovItem = {id: string | number, label?: string, i18nLabel?: string};

export const LOV: Record<LovType, LovItem[]> = {
  DATA_TYPES: [
    {id: 'N', i18nLabel: 'common:label.numeric'},
    {id: 'C', i18nLabel: 'common:label.character'},
    {id: 'D', i18nLabel: 'common:label.date'},
  ],
  FORMULA_TYPES: [
    {id: 'FX', i18nLabel: 'common:label.simple-formula'},
    {id: 'SP', i18nLabel: 'common:label.stored-procedure'},
  ],
  BALANCE_FEED_TYPE: [
    {id: 'C', i18nLabel: 'payroll:label.classification'},
    {id: 'E', i18nLabel: 'payroll:label.element'},
  ],
  ADD_SUBTRACT: [
    {id: '+', i18nLabel: 'common:label.add'},
    {id: '-', i18nLabel: 'common:label.subtract'},
  ],
  PEOPLE_GROUP: [
    {id: '1', i18nLabel: 'master:label.head-office'},
    {id: '2', i18nLabel: 'master:label.branch-office'},
  ],
  EMPLOYEE_CATEGORY: [
    {id: 'F', i18nLabel: 'master:label.full-time'},
    {id: 'P', i18nLabel: 'master:label.part-time'},
    {id: 'C', i18nLabel: 'master:label.contract'},
    {id: 'O', i18nLabel: 'master:label.outsource'},
  ],
};

export function lovLabel(type: LovType, key: string | undefined): string | undefined {
  if (key == null) return undefined;
  const lov = LOV[type];
  const item = lov?.find(l => l.id == key); // not exact
  if (item == null) return undefined;
  return item.label ? item.label : (item.i18nLabel ? i18next.t(item.i18nLabel) : undefined);
}
