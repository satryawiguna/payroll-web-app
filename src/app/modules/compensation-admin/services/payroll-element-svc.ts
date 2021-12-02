/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {
  DeleteResponse,
  FilterCriteria,
  InsertResponse,
  PageResponse,
  SEARCH_OPERATOR,
  SearchCriteria,
  UpdateResponse
} from 'app/core/models';
import {BaseService, Http, RequestParams} from 'app/core/services';
import {API_HOST} from 'config';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {InputValue, PayrollElement, PayrollElementCbx} from '../models/payroll-element';

export class PayrollElementSvc extends BaseService {
  private static http: Http = new Http();

  static getPage(criteria?: SearchCriteria, params?: RequestParams): Observable<PageResponse<PayrollElement>> {
    const url = `${API_HOST}/api/v1/payroll-elements`;
    const p = {...this.criteriaParams(criteria), ...params};
    return this.http.get(url, p).pipe(map(res => this.paginationResponse(res)));
  }

  static listCbx(options?: {excludeId?: string, includeValues?: boolean}, params?: RequestParams)
    : Observable<PayrollElementCbx[]> {
    const url = `${API_HOST}/api/v1/payroll-elements/list-cbx`;
    const p = {
      'filters': (options?.excludeId != null) ? JSON.stringify([{
          field: 'element_id',
          operator: SEARCH_OPERATOR.NOT_IN,
          value: [options?.excludeId],
        }] as FilterCriteria[]) : undefined,
      'include-values': options?.includeValues,
      ...params,
    };
    return this.http.get(url, p).pipe(map(res => this.jsonResponse(res?.rows) ?? []));
  }

  static listIdLabel(options?: {excludeId?: string, includeValues?: boolean}, params?: RequestParams)
    : Observable<{id: string, label: string}[]> {
    return this.listCbx(options, params)
      .pipe(map(res => res.map(d => ({id: d.element_id!, label: d.element_name}))));
  }

  static getOne(elementId: string, params?: RequestParams): Observable<PayrollElement | undefined> {
    const url = `${API_HOST}/api/v1/payroll-elements/${elementId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static insert(item: PayrollElement): Observable<InsertResponse<string>> {
    const url = `${API_HOST}/api/v1/payroll-elements`;
    return this.http.post(url, item);
  }

  static update(elementId: string, item: PayrollElement, params?: RequestParams): Observable<UpdateResponse> {
    const url = `${API_HOST}/api/v1/payroll-elements/${elementId}`;
    return this.http.put(url, item, params);
  }

  static delete(elementId: string): Observable<DeleteResponse> {
    const url = `${API_HOST}/api/v1/payroll-elements/${elementId}`;
    return this.http.delete(url);
  }

  static getOneInputValue(inputValueId: string, params?: RequestParams): Observable<InputValue | undefined> {
    const url = `${API_HOST}/api/v1/payroll-elements/values/${inputValueId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static insertInputValue(elementId: string, item: InputValue): Observable<InsertResponse<string>> {
    const url = `${API_HOST}/api/v1/payroll-elements/${elementId}/values`;
    return this.http.post(url, item);
  }

  static updateInputValue(inputValueId: string, item: InputValue, params?: RequestParams): Observable<UpdateResponse> {
    const url = `${API_HOST}/api/v1/payroll-elements/values/${inputValueId}`;
    return this.http.put(url, item, params);
  }

  static deleteInputValue(inputValueId: string): Observable<DeleteResponse> {
    const url = `${API_HOST}/api/v1/payroll-elements/values/${inputValueId}`;
    return this.http.delete(url);
  }

}
