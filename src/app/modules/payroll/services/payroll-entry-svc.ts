/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {DeleteResponse, InsertResponse, SearchCriteria, UpdateResponse} from 'app/core/models';
import {BaseService, Http, RequestParams} from 'app/core/services';
import {API_HOST} from 'config';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PayrollEntry, PayrollPerEntryPageRes, PayrollPerEntryRes} from '../models/payroll-entry';

export class PayrollEntrySvc extends BaseService {
  private static http: Http = new Http();

  static getEmployees(criteria?: SearchCriteria, options?: {includeEntries?: boolean}): Observable<PayrollPerEntryPageRes> {
    const url = `${API_HOST}/api/v1/payroll-entries/employees`;
    const p = {
      ...this.criteriaParams(criteria),
      'include-entries': options?.includeEntries,
    };
    return this.http.get(url, p).pipe(map(res => {
      const ret = this.paginationResponse(res) as PayrollPerEntryPageRes;
      ret.elements = this.jsonResponse(res?.elements);
      return ret;
    }));
  }

  static getEmployee(employeeId: number, params?: RequestParams): Observable<PayrollPerEntryRes | undefined> {
    const url = `${API_HOST}/api/v1/payroll-entries/employees/${employeeId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static getOne(entryId: string, params?: RequestParams): Observable<PayrollEntry | undefined> {
    const url = `${API_HOST}/api/v1/payroll-entries/${entryId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static getEntries(employeeId: number, params?: RequestParams): Observable<PayrollEntry[]> {
    const url = `${API_HOST}/api/v1/payroll-entries/employees/${employeeId}/entries`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res?.rows) ?? []));
  }

  static insert(employeeId: number, item: PayrollEntry): Observable<InsertResponse<string>> {
    const url = `${API_HOST}/api/v1/payroll-entries/employees/${employeeId}`;
    return this.http.post(url, item);
  }

  static update(entryId: string, item: PayrollEntry): Observable<UpdateResponse> {
    const url = `${API_HOST}/api/v1/payroll-entries/${entryId}`;
    return this.http.put(url, item);
  }

  static delete(entryId: string): Observable<DeleteResponse> {
    const url = `${API_HOST}/api/v1/payroll-entries/${entryId}`;
    return this.http.delete(url);
  }

  static getOneValue(valueId: string, params?: RequestParams): Observable<PayrollEntry | undefined> {
    const url = `${API_HOST}/api/v1/payroll-entries/values/${valueId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static updateValue(valueId: string, item: PayrollEntry, params?: RequestParams): Observable<UpdateResponse> {
    const url = `${API_HOST}/api/v1/payroll-entries/values/${valueId}`;
    return this.http.put(url, item, params);
  }

}
