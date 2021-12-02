/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {PageResponse, SearchCriteria} from 'app/core/models';
import {BaseService, Http} from 'app/core/services';
import {API_HOST} from 'config';
import {EMPTY, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PayrollPerEntryPageRes} from '../models/payroll-entry';
import {PayrollProcessSum} from '../models/payroll-process';

export class PayrollProcessSvc extends BaseService {
  private static http: Http = new Http();

  static getSummary(criteria?: SearchCriteria): Observable<PageResponse<PayrollProcessSum>> {
    /*const url = `${API_HOST}/api/v1/payroll-process`;
    const p = this.criteriaParams(criteria);
    return this.http.get(url, p).pipe(map(res => this.paginationResponse(res)));*/
    return EMPTY;
  }

  static getNewProcess(criteria?: SearchCriteria): Observable<PayrollPerEntryPageRes> {
    const url = `${API_HOST}/api/v1/payroll-process/new-process`;
    const p = this.criteriaParams(criteria);
    return this.http.get(url, p).pipe(map(res => {
      const ret = this.paginationResponse(res) as PayrollPerEntryPageRes;
      ret.elements = this.jsonResponse(res?.elements);
      return ret;
    }));
  }

}
