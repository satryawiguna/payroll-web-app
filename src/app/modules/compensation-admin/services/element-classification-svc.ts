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
import {ElementClassification, ElementClassificationCbx} from '../models/element-classification';

export class ElementClassificationSvc extends BaseService {
  private static http: Http = new Http();

  static getPage(criteria?: SearchCriteria, params?: RequestParams): Observable<PageResponse<ElementClassification>> {
    const url = `${API_HOST}/api/v1/element-classifications`;
    const p = {...this.criteriaParams(criteria), ...params};
    return this.http.get(url, p).pipe(map(res => this.paginationResponse(res)));
  }

  static listCbx(params?: RequestParams): Observable<ElementClassificationCbx[]> {
    const url = `${API_HOST}/api/v1/element-classifications/list-cbx`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res?.rows) ?? []));
  }

  static listIdLabel(params?: RequestParams): Observable<{id: string, label: string}[]> {
    return this.listCbx(params)
      .pipe(map(res => res.map(d => ({id: d.classification_id, label: d.classification_name}))));
  }

  static getOne(classificationId: string, params?: RequestParams): Observable<ElementClassification | undefined> {
    const url = `${API_HOST}/api/v1/element-classifications/${classificationId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static insert(item: ElementClassification): Observable<InsertResponse<string>> {
    const url = `${API_HOST}/api/v1/element-classifications`;
    return this.http.post(url, item);
  }

  static update(classificationId: string, item: ElementClassification): Observable<UpdateResponse> {
    const url = `${API_HOST}/api/v1/element-classifications/${classificationId}`;
    return this.http.put(url, item);
  }

  static delete(classificationId: string): Observable<DeleteResponse> {
    const url = `${API_HOST}/api/v1/element-classifications/${classificationId}`;
    return this.http.delete(url);
  }

}
