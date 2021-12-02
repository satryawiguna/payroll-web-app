/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {BaseService, Http} from 'app/core/services/index';
import {API_HOST, COMPONENT_NAME} from 'config';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HistoryItem} from '../models/history-item';

export class TrackingHistorySvc extends BaseService {
  private static http: Http = new Http();

  static getHistories<ID>(name: COMPONENT_NAME, id: ID): Observable<HistoryItem[]> {
    const url = `${API_HOST}/api/v1/tracking-history/${name}/${id}`;
    return this.http.get(url).pipe(map(res => this.jsonResponse(res?.rows) ?? []));
  }
}
