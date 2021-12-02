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
import {BalanceFeed, PayrollBalance} from '../models/payroll-balance';

export class PayrollBalanceSvc extends BaseService {
  private static http: Http = new Http();

  static getPage(criteria?: SearchCriteria): Observable<PageResponse<PayrollBalance>> {
    const url = `${API_HOST}/api/v1/payroll-balances`;
    const p = this.criteriaParams(criteria);
    return this.http.get(url, p).pipe(map(res => this.paginationResponse(res)));
  }

  static getOne(balanceId: string, params?: RequestParams): Observable<PayrollBalance | undefined> {
    const url = `${API_HOST}/api/v1/payroll-balances/${balanceId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static insert(item: PayrollBalance): Observable<InsertResponse<string>> {
    const url = `${API_HOST}/api/v1/payroll-balances`;
    return this.http.post(url, item);
  }

  static update(balanceId: string, item: PayrollBalance): Observable<UpdateResponse> {
    const url = `${API_HOST}/api/v1/payroll-balances/${balanceId}`;
    return this.http.put(url, item);
  }

  static delete(balanceId: string): Observable<DeleteResponse> {
    const url = `${API_HOST}/api/v1/payroll-balances/${balanceId}`;
    return this.http.delete(url);
  }

  static getOneBalanceFeed(feedId: string, params?: RequestParams): Observable<PayrollBalance | undefined> {
    const url = `${API_HOST}/api/v1/payroll-balances/feeds/${feedId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static insertBalanceFeed(balanceId: string, item: BalanceFeed): Observable<InsertResponse<string>> {
    const url = `${API_HOST}/api/v1/payroll-balances/${balanceId}/feeds`;
    return this.http.post(url, item);
  }

  static updateBalanceFeed(feedId: string, item: BalanceFeed, params?: RequestParams): Observable<UpdateResponse> {
    const url = `${API_HOST}/api/v1/payroll-balances/feeds/${feedId}`;
    return this.http.put(url, item, params);
  }

  static deleteBalanceFeed(feedId: string): Observable<DeleteResponse> {
    const url = `${API_HOST}/api/v1/payroll-balances/feeds/${feedId}`;
    return this.http.delete(url);
  }

}
