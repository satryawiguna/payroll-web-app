/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

export type SearchOption = {
  name: string;
  type?: SearchOptionType;
  className?: string;
  placement?: 'popup' | 'before' | 'after';
  label?: string;
  options?: SearchOptionList[];
};

export type SearchOptionType = 'string' | 'number' | 'date';

export type SearchOptionList = {
  id: string | number,
  label?: string;
  i18nLabel?: string;
}

export type SearchCriteria = {
  pageNo?: number;
  perPage?: number;
  searchText?: string;
  filters?: FilterCriteria[];
  sorts?: string[];
};

export type FilterCriteria = {
  field: string;
  operator?: SEARCH_OPERATOR;
  value?: any;
  operation?: SEARCH_OPERATION;
  items?: FilterCriteria[];
}

export enum SEARCH_OPERATOR {
  CONTAIN = 'like',
  EQUAL = '=',
  NOT_EQUAL = '<>',
  LESS_THAN = '<',
  LESS_THAN_EQUAL = '<=',
  GREATER_THAN = '>',
  GREATER_THAN_EQUAL = '>=',
  IN = 'in',
  NOT_IN = 'not in',
}

export enum SEARCH_OPERATION {
  AND = 'and',
  OR = 'or'
}
