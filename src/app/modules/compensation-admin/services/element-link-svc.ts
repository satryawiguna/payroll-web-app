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
import {ElementLink, LinkValue} from '../models/element-link';

export class ElementLinkSvc extends BaseService {
  private static http: Http = new Http();

  static getPage(criteria?: SearchCriteria, params?: Record<string, any>): Observable<PageResponse<ElementLink>> {
    const url = `${API_HOST}/api/v1/element-links`;
    const p = {...this.criteriaParams(criteria), ...params};
    return this.http.get(url, p).pipe(map(res => this.paginationResponse(res)));
  }

  static getOne(linkId: string, params?: Record<string, any>): Observable<ElementLink | undefined> {
    const url = `${API_HOST}/api/v1/element-links/${linkId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static insert(item: ElementLink): Observable<InsertResponse<string>> {
    const url = `${API_HOST}/api/v1/element-links`;
    return this.http.post(url, item);
  }

  static update(linkId: string, item: ElementLink, params?: Record<string, any>): Observable<UpdateResponse> {
    const url = `${API_HOST}/api/v1/element-links/${linkId}`;
    return this.http.put(url, item, params);
  }

  static delete(linkId: string): Observable<DeleteResponse> {
    const url = `${API_HOST}/api/v1/element-links/${linkId}`;
    return this.http.delete(url);
  }

  static getOneLinkValue(valueId: string, params?: RequestParams): Observable<LinkValue | undefined> {
    const url = `${API_HOST}/api/v1/element-links/values/${valueId}`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }

  static insertLinkValue(linkId: string, item: LinkValue): Observable<InsertResponse<string>> {
    const url = `${API_HOST}/api/v1/element-links/${linkId}/values`;
    return this.http.post(url, item);
  }

  static updateLinkValue(valueId: string | undefined, item: LinkValue, params?: RequestParams): Observable<UpdateResponse> {
    const url = `${API_HOST}/api/v1/element-links/values/${valueId}`;
    return this.http.put(url, item, params);
  }

  static deleteLinkValue(valueId: string): Observable<DeleteResponse> {
    const url = `${API_HOST}/api/v1/element-links/values/${valueId}`;
    return this.http.delete(url);
  }

}
