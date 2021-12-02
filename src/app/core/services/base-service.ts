/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {parseISO} from 'date-fns';
import _ from 'lodash';
import {PageResponse, SearchCriteria} from '../models';

const YYYY_MM_DD = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
const YYYY_MM_DD_HH_MM = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
const YYYY_MM_DD_HH_MM_SS = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/;

export class BaseService {
  protected static criteriaParams(criteria?: SearchCriteria): Record<string, any> {
    const p: Record<string, any> = {'page': (criteria?.pageNo ?? 0) + 1};
    if (criteria?.perPage) p['per-page'] = criteria.perPage;
    if (criteria?.searchText) p['q'] = criteria?.searchText;
    if (criteria?.filters?.length) p['filters'] = JSON.stringify(criteria.filters);
    if (criteria?.sorts?.length) p['sorts'] = criteria.sorts.join(',');
    return p;
  }

  protected static paginationResponse<T>(res: any): PageResponse<T> {
    return {
      pageNo: res?.['meta']?.['current_page'] ? res['meta']['current_page'] - 1 : undefined,
      perPage: res?.['meta']?.['per_page'],
      totalRow: res?.['meta']?.['total_row'],
      rows: this.jsonResponse(res?.['rows']),
    };
  }

  protected static jsonResponse<T>(item: any): T | undefined {
    if (item == null) return undefined;

    if (Array.isArray(item)) {
      return item.map(d => this.jsonResponse(d)) as any;
    } else if (typeof item === 'object') {
      const ret: Record<string, any> = {};
      Object.keys(item).forEach(k => {
        const v = item[k];
        if (k.startsWith('is_') && [v === 0 || v === 1]) { // boolean
          ret[k] = v === 1;
        } else {
          ret[k] = this.jsonResponse(v);
        }
      });
      return ret as any;
    } else if (this.isDateTimeSecondString(item) || this.isDateTimeString(item) || this.isDateString(item)) {
      return item.startsWith('1000-01-01') || item.startsWith('9000-12-31') ? undefined : parseISO(item) as any;
    } else if (this.isNumericString(item)) {
      return +item as any;
    } else {
      return item;
    }
  }

  private static isNumericString(obj: unknown): boolean {
    if (_.isNumber(obj)) return true;
    return +(obj as any) + '' === obj;
  }

  private static isDateString(obj: unknown): boolean {
    if (!_.isString(obj)) return false;
    return YYYY_MM_DD.test(obj);
  }

  private static isDateTimeString(obj: unknown): boolean {
    if (!_.isString(obj)) return false;
    return YYYY_MM_DD_HH_MM.test(obj);
  }

  private static isDateTimeSecondString(obj: unknown): boolean {
    if (!_.isString(obj)) return false;
    return YYYY_MM_DD_HH_MM_SS.test(obj);
  }

}
