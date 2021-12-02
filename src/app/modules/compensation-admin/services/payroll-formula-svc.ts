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
import {PayrollElement} from '../models/payroll-element';
import {FormulaResult, PayrollFormula, PayrollFormulaCbx} from '../models/payroll-formula';

export class PayrollFormulaSvc extends BaseService {
  private static http: Http = new Http();

  static getPage(criteria?: SearchCriteria, params?: RequestParams): Observable<PageResponse<PayrollFormula>> {
    const url = `${API_HOST}/api/v1/payroll-formulas`;
    const p = {...this.criteriaParams(criteria), ...params};
    return this.http.get(url, p).pipe(map(res => this.paginationResponse(res)));
  }

  static listCbx(params?: RequestParams): Observable<PayrollFormulaCbx[]> {
    const url = `${API_HOST}/api/v1/payroll-formulas/list-cbx`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res?.rows) ?? []));
  }

  static getOne(formulaId: string, params?: RequestParams): Observable<PayrollFormula | undefined> {
    const url = `${API_HOST}/api/v1/payroll-formulas/${formulaId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static insert(item: PayrollFormula): Observable<InsertResponse<string>> {
    const url = `${API_HOST}/api/v1/payroll-formulas`;
    return this.http.post(url, item);
  }

  static update(formulaId: string, item: PayrollFormula, params?: RequestParams): Observable<UpdateResponse> {
    const url = `${API_HOST}/api/v1/payroll-formulas/${formulaId}`;
    return this.http.put(url, item, params);
  }

  static delete(formulaId: string): Observable<DeleteResponse> {
    const url = `${API_HOST}/api/v1/payroll-formulas/${formulaId}`;
    return this.http.delete(url);
  }

  static getOneFormulaResult(resultId: string, params?: RequestParams): Observable<PayrollElement | undefined> {
    const url = `${API_HOST}/api/v1/payroll-formulas/results/${resultId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static insertFormulaResult(formulaId: string, item: FormulaResult): Observable<InsertResponse<string>> {
    const url = `${API_HOST}/api/v1/payroll-formulas/${formulaId}/results`;
    return this.http.post(url, item);
  }

  static updateFormulaResult(resultId: string, item: FormulaResult, params?: RequestParams): Observable<UpdateResponse> {
    const url = `${API_HOST}/api/v1/payroll-formulas/results/${resultId}`;
    return this.http.put(url, item, params);
  }

  static deleteFormulaResult(resultId: string): Observable<DeleteResponse> {
    const url = `${API_HOST}/api/v1/payroll-formulas/results/${resultId}`;
    return this.http.delete(url);
  }

}
