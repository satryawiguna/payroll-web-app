/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {BaseService, Http, RequestParams} from 'app/core/services';
import {API_HOST} from 'config';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ProjectCbx} from '../models/project';

export class ProjectSvc extends BaseService {
  private static http: Http = new Http();

  static listCbx(params?: RequestParams): Observable<ProjectCbx[]> {
    const url = `${API_HOST}/api/v1/projects/list-cbx`;
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res?.rows) ?? []));
  }

  static listIdLabel(params?: RequestParams): Observable<{id: number, label: string}[]> {
    return this.listCbx(params)
      .pipe(map(res => res.map(d => ({id: d.project_id, label: d.project_name}))));
  }
}
