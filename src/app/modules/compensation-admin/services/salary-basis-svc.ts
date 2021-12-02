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
import {SalaryBasis} from '../models/salary-basis';

export class SalaryBasisSvc extends BaseService {
  private static http: Http = new Http();

  static getPage(criteria?: SearchCriteria, params?: RequestParams): Observable<PageResponse<SalaryBasis>> {
    const url = `${API_HOST}/api/v1/salary-basis`;
    const p = {...this.criteriaParams(criteria), ...params};
    return this.http.get(url, p).pipe(map(res => this.paginationResponse(res)));
  }

  static getOne(salaryBasisId: string, params?: RequestParams): Observable<SalaryBasis | undefined> {
    const url = `${API_HOST}/api/v1/salary-basis/${salaryBasisId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static insert(item: SalaryBasis): Observable<InsertResponse<string>> {
    const url = `${API_HOST}/api/v1/salary-basis`;
    return this.http.post(url, item);
  }

  static update(salaryBasisId: string, item: SalaryBasis): Observable<UpdateResponse> {
    const url = `${API_HOST}/api/v1/salary-basis/${salaryBasisId}`;
    return this.http.put(url, item);
  }

  static delete(salaryBasisId: string): Observable<DeleteResponse> {
    const url = `${API_HOST}/api/v1/salary-basis/${salaryBasisId}`;
    return this.http.delete(url);
  }

}
