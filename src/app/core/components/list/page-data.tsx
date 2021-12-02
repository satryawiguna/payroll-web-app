/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Divider} from '@material-ui/core';
import {LocalStorage} from 'app/utils';
import {DEFAULT_PER_PAGE} from 'config';
import React, {forwardRef, ReactNode, Ref, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Observable, Subscription} from 'rxjs';
import {FilterCriteria, PageResponse, SearchCriteria, SearchOption} from '../../models';
import {Search} from '../search/search';
import {Pagination} from './pagination';

export type PageDataProps<T extends Record<string, any>> = {
  name?: string;
  type?: 'list' | 'table';
  prefix?: ReactNode,
  suffix?: ReactNode,
  filterChange?: (searchText: string | undefined, filters: FilterCriteria[]) => void,
  fetchData?: (criteria: SearchCriteria) => Observable<PageResponse<T>>,
  searchOptions?: SearchOption[];
  sorts?: string[],
  render: (data: T[], page: PageInfo) => ReactNode
};

export type PageInfo = {
  pageNo: number,
  perPage: number,
  totalRow: number
};

export type PageDataRef<T> = {
  refresh: () => void;
  replaceItem: (index: number, item: T) => void;
};

export const PageData = forwardRef(<T,>(
  props: PageDataProps<T>, ref: Ref<PageDataRef<T>>
) => {
  const [initialSearch, setInitialSearch] = useState<[string | undefined, FilterCriteria[]]>([undefined, []]);
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState<PageInfo>({pageNo: 0, perPage: DEFAULT_PER_PAGE, totalRow: 0});

  const filtersRef = useRef<{searchText: string | undefined, filters: FilterCriteria[]}>({searchText: undefined, filters: []});
  const sub$ = useRef<Subscription>();

  useImperativeHandle(ref, () => ({refresh, replaceItem}));

  useEffect(() => {
    const {searchText, filters, pageNo, perPage} = loadState(props.name);

    setInitialSearch([searchText, filters]);
    filtersRef.current = {searchText, filters};
    props.filterChange?.(searchText, filters);

    setPage({pageNo, perPage, totalRow: 0});

    fetchData(pageNo, perPage, searchText, filters);
    return () => sub$.current?.unsubscribe();
  }, []);

  function replaceItem(index: number, item: T) {
    setData(data.map((d, i) => i === index ? item : d));
  }

  function onSearch(searchText: string | undefined, filters: FilterCriteria[]) {
    filtersRef.current = {searchText, filters};
    props.filterChange?.(searchText, filters);
    storeSearch(props.name, searchText, filters);

    const pageNo = 0;
    setPage({...page, pageNo});
    storePageInfo(props.name, pageNo, page.perPage);

    fetchData(pageNo, page.pageNo, searchText, filters);
  }

  function onPageChange(pageNo: number, perPage: number) {
    setPage({...page, pageNo, perPage});
    storePageInfo(props.name, pageNo, perPage);
    fetchData(pageNo, perPage, filtersRef.current.searchText, filtersRef.current.filters);
  }

  function refresh() {
    fetchData(page.pageNo, page.perPage, filtersRef.current.searchText, filtersRef.current.filters);
  }

  function fetchData(pageNo: number, perPage: number, searchText: string | undefined, filters: FilterCriteria[]) {
    if (!props.fetchData) return;

    const criteria = {
      pageNo: pageNo,
      perPage: perPage,
      searchText: searchText,
      filters: filters,
      sorts: props.sorts,
    } as SearchCriteria;

    sub$.current?.unsubscribe();
    sub$.current = props.fetchData(criteria).subscribe(res => {
      setData(res.rows ?? []);
      setPage({pageNo: res.pageNo ?? 0, perPage: res.perPage ?? 0, totalRow: res.totalRow ?? 0});
    });
  }

  return (<>
    <div className="content-actions">
      {props.prefix}
      {props.prefix && onSearch && <Divider orientation="vertical" />}

      <Search options={props.searchOptions} initialSearch={initialSearch} onSearch={onSearch} />

      {(props.prefix || onSearch) && props.suffix && <Divider orientation="vertical" />}
      {props.suffix}
    </div>

    {props.render(data, page)}

    <Pagination {...page} onPageChange={onPageChange} />
  </>);
});

function loadState(name: string | undefined): Record<string, any> {
  const item = name ? LocalStorage.getAsJson(name, true) ?? {} : {};
  const pageNo = item.pageNo ? +item.pageNo : 0;
  const perPage = loadPerPage(name) ?? DEFAULT_PER_PAGE;
  return {
    searchText: item.searchText,
    filters: item.filters ?? [],
    pageNo: pageNo,
    perPage: perPage,
  };
}

function loadPerPage(name: string | undefined): number | undefined {
  if (name) {
    const item = LocalStorage.getAsJson(name);
    return item && item.rowsPerPage ? +item.rowsPerPage : undefined;
  } else {
    const perPage = LocalStorage.get('rows-per-page');
    return perPage ? +perPage : undefined;
  }
}

function storeSearch(name: string | undefined, searchText: string | undefined, filters: FilterCriteria[]) {
  if (!name) return;
  const item = name ? LocalStorage.getAsJson(name, true) ?? {} : {};
  item.searchText = searchText;
  item.filters = filters;
  LocalStorage.store(name, JSON.stringify(item), true);
}

function storePageInfo(name: string | undefined, pageNo: number, perPage: number) {
  if (!name) return;

  const sessionItem = name ? LocalStorage.getAsJson(name, true) ?? {} : {};
  sessionItem.pageNo = pageNo;
  LocalStorage.store(name, JSON.stringify(sessionItem), true);

  const item = name ? LocalStorage.getAsJson(name) ?? {} : {};
  item.rowsPerPage = perPage;
  LocalStorage.store(name, JSON.stringify(item));
}
