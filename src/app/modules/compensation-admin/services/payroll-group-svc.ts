/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {DeleteResponse, InsertResponse, PageResponse, SearchCriteria, UpdateResponse} from 'app/core/models';
import {BaseService, Http, RequestParams} from 'app/core/services';
import {API_HOST} from 'config';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PayrollGroup, PayrollGroupCbx} from '../models/payroll-group';

export class PayrollGroupSvc extends BaseService {
  private static http: Http = new Http();

  static getPage(criteria?: SearchCriteria, params?: RequestParams): Observable<PageResponse<PayrollGroup>> {
    const url = `${API_HOST}/api/v1/payroll-groups`;
    const p = {...this.criteriaParams(criteria), ...params};
    return this.http.get(url, p).pipe(map(res => this.paginationResponse(res)));
  }

  static listCbx(params?: RequestParams): Observable<PayrollGroupCbx[]> {
    const url = `${API_HOST}/api/v1/payroll-groups/list-cbx`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res?.rows) ?? []));
  }

  static listIdLabel(params?: RequestParams): Observable<{id: string, label: string}[]> {
    return this.listCbx(params)
      .pipe(map(res => res.map(d => ({id: d.pay_group_id, label: d.pay_group_name}))));
  }

  static getOne(payGroupId: string, params?: RequestParams): Observable<PayrollGroup | undefined> {
    const url = `${API_HOST}/api/v1/payroll-groups/${payGroupId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static insert(item: PayrollGroup): Observable<InsertResponse<string>> {
    const url = `${API_HOST}/api/v1/payroll-groups`;
    return this.http.post(url, item);
  }

  static update(payGroupId: string, item: PayrollGroup, params?: RequestParams): Observable<UpdateResponse> {
    const url = `${API_HOST}/api/v1/payroll-groups/${payGroupId}`;
    return this.http.put(url, item, params);
  }

  static delete(payGroupId: string): Observable<DeleteResponse> {
    const url = `${API_HOST}/api/v1/payroll-groups/${payGroupId}`;
    return this.http.delete(url);
  }

}
