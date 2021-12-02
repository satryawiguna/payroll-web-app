/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {DB_DATE_FORMAT, DB_DATETIME_FORMAT, DB_TIME_FORMAT, showToastError} from 'app/utils';
import {format, getHours, getMinutes, getSeconds, getYear} from 'date-fns';
import i18next from 'i18next';
import _ from 'lodash';
import {EMPTY, Observable} from 'rxjs';
import {ajax, AjaxError, AjaxResponse} from 'rxjs/ajax';
import {catchError, finalize, map, take} from 'rxjs/operators';
import {RequestCounter} from './request-counter';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type RequestParams = Record<string, any>;
export type RequestData = Record<string, any>;

export class Http {

  get(url: string, params?: RequestParams): Observable<any> {
    return this.request('GET', url, undefined, params);
  }

  post(url: string, data: RequestData, params?: RequestParams): Observable<any> {
    return this.request('POST', url, data, params);
  }

  put(url: string, data: RequestData, params?: RequestParams): Observable<any> {
    return this.request('PUT', url, data, params);
  }

  delete(url: string, params?: RequestParams): Observable<any> {
    return this.request('DELETE', url, undefined, params);
  }

  private request<T>(method: HttpMethod, url: string, data?: RequestData, params?: RequestParams): Observable<T> {
    RequestCounter.Instance.add();

    if (params == null) params = {};
    params['XDEBUG_SESSION_START'] = 'PHPSTORM';
    const urlParams = urlWithParams(url, params);
    const headers = getRequestHeaders();
    const payload = jsonRequest(data);

    let obs: Observable<AjaxResponse<any>>;
    switch (method) {
      case 'GET':
        obs = ajax.get(urlParams, headers);
        break;
      case 'POST':
        obs = ajax.post(urlParams, payload, headers);
        break;
      case 'PUT':
        obs = ajax.put(urlParams, payload, headers);
        break;
      case 'DELETE':
        obs = ajax.delete(urlParams, headers);
        break;
    }

    return obs.pipe(
      take(1),
      map(res => res.response),
      catchError(err => onError(err)),
      finalize(() => RequestCounter.Instance.remove()),
    );
  }
}

function urlWithParams(url: string, params?: RequestParams): string {
  if (!params) return url;
  const reqParams = requestParams(params);
  const sParams = Object.entries(reqParams).map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');
  return sParams ? url + '?' + sParams : url;
}

function requestParams(params: RequestParams): Record<string, string> {
  if (!params) return {};
  const ret: Record<string, string> = {};
  Object.keys(params).forEach(k => {
    const v = params[k];
    if (v == null) {
      ret[k.toString()] = '';
    } else if (_.isDate(v)) {
      ret[k.toString()] = format(v, DB_DATE_FORMAT);
    } else if (typeof v === 'object') {
      ret[k.toString()] = JSON.stringify(jsonRequest(v));
    } else {
      ret[k.toString()] = '' + v;
    }
  });
  return ret;
}

function jsonRequest(item: any): any {
  if (item == null) return null;
  if (_.isArray(item)) {
    return item.map(d => jsonRequest(d));
  } else if (_.isDate(item)) {
    const d = item as Date;
    if (getYear(d) === 0) {
      return format(d, DB_TIME_FORMAT);
    } else if (getHours(d) === 0 && getMinutes(d) === 0 && getSeconds(d) === 0) {
      return format(d, DB_DATE_FORMAT);
    } else {
      return format(d, DB_DATETIME_FORMAT);
    }
  } else if (typeof item === 'object') {
    const ret: Record<string, any> = {};
    Object.keys(item).forEach(k => {
      const v = item[k];
      ret[k] = jsonRequest(v);
    });
    return ret;
  } else {
    return item;
  }
}

function getRequestHeaders(): Record<string, string> {
  return {
    'Authorization': 'Bearer ' + getStoredToken(),
    'content-Type': 'application/json',
  };
}

function getStoredToken(): string {
  return 'dummy';
}

function onError(err: AjaxError): Observable<unknown> {
  let msg = err.response?.key ? i18next.t(err.response.key) : err.response?.message;
  if (msg == null) msg = i18next.t('common:error.general');
  console.warn('Error:', msg);
  showToastError(msg, err.response?.message, err.response?.trace);
  return EMPTY;
}
