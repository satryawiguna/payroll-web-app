/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Popover} from '@material-ui/core';
import {useSize, useStateCallback} from 'app/utils';
import _ from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FilterCriteria, SEARCH_OPERATOR, SearchOption} from '../../models';
import {Button, SecondaryButton} from '../button/button';
import {SearchBar} from './search-bar';
import {SearchControl} from './search-control';
import './search.scss';

export type SearchForm = Record<string, {value: any, operator?: string}>;

export type SearchProps = {
  initialSearch?: [string | undefined, FilterCriteria[]];
  options?: SearchOption[];
  onSearch?: (search: string | undefined, filters: FilterCriteria[]) => void;
};

export const Search = ({initialSearch, options, onSearch}: SearchProps) => {
  const {t} = useTranslation('common');

  const [prevData, setPrevData] = useState<SearchForm>({});
  const [data, setData] = useStateCallback<SearchForm>({});

  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const searchBarRef = useRef<HTMLDivElement>(null);
  const {width: searchWidth} = useSize(searchBarRef);

  useEffect(() => {
    const searchForm = getInitialForm(initialSearch, options);
    setPrevData(searchForm);
    setData(searchForm);
  }, [initialSearch]);

  function doSearch(data: SearchForm) {
    setAnchorEl(undefined);

    setPrevData(data);
    if (onSearch) {
      const [search, filters] = getSearchCriteria(data, options);
      onSearch(search, filters);
    }
  }

  function reset() {
    const copy = _.cloneDeep(data);
    Object.keys(copy).forEach(k => copy[k].value = '');
    setData(copy);
    doSearch(copy);
  }

  function cancel() {
    setAnchorEl(undefined);
    setData(prevData);
  }

  function setItem(field: string, valueType: 'value' | 'operator', value: any, searchImmediately?: boolean) {
    setData((prev) => {
      if (valueType === 'value') {
        return {...prev, [field]: {value: value, operator: prev[field]?.operator}};
      } else {
        return {...prev, [field]: {value: prev[field]?.value, operator: value as string}};
      }
    }, data => {
      if (searchImmediately) doSearch(data as SearchForm);
    });
  }

  const optPopup = options?.filter(opt => opt.placement == null || opt.placement === 'popup') ?? [];
  const optBefore = options?.filter(opt => opt.placement === 'before') ?? [];
  const optAfter = options?.filter(opt => opt.placement === 'after') ?? [];

  let popupWidth: number | undefined = searchWidth - 32;
  if (popupWidth < 300) popupWidth = undefined;

  return (
    <div className="search-container">
      <div className="search-bar-wrap">
        {optBefore.length ? (
          optBefore.map((opt, i) => (
            <SearchControl
              {...opt}
              key={i}
              value={data[opt.name]?.value}
              prefixLabel={data[opt.name]?.operator ?? getOperatorKey(SEARCH_OPERATOR.CONTAIN)}
              onChange={(field, valueType, value) => setItem(field, valueType, value, true)}
            />
          ))
        ) : undefined}

        <SearchBar
          ref={searchBarRef}
          value={data['__search']?.value}
          onSearch={value => setItem('__search', 'value', value, true)}
          onReset={reset}
          onAdvancedClick={e => setAnchorEl(e.currentTarget)}
          hasAdvancedFilter={Boolean(optPopup.length)}
          filterCount={getFilterCount(prevData)}
        />
      </div>

      {optAfter.length ? (
        <div className="advanced-search">
          <div className="form-item">
            {optAfter.map((opt, i) => (
              <SearchControl
                {...opt}
                key={i}
                value={data[opt.name]?.value}
                prefixLabel={data[opt.name]?.operator ?? getOperatorKey(SEARCH_OPERATOR.CONTAIN)}
                onChange={(field, valueType, value) => setItem(field, valueType, value, true)}
              />
            ))}
          </div>
        </div>
      ) : undefined}

      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(undefined)}
               anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} transformOrigin={{vertical: 'top', horizontal: 'left'}}
               className="search-popup">
        <div className="search-popup-inner" style={{width: popupWidth}}>
          <div className="form-item">
            {optPopup.map((opt, i) => (
              <SearchControl
                {...opt}
                key={i}
                value={data[opt.name]?.value}
                prefixLabel={data[opt.name]?.operator ?? getOperatorKey(SEARCH_OPERATOR.CONTAIN)}
                onChange={setItem}
              />
            ))}
          </div>

          <div className="search-actions">
            <SecondaryButton onClick={cancel}>{t('button.cancel')}</SecondaryButton>
            <SecondaryButton onClick={reset} color="warn">{t('button.show-all')}</SecondaryButton>
            <Button onClick={() => doSearch(data)}>{t('button.search')}</Button>
          </div>
        </div>
      </Popover>
    </div>
  );
};

function getInitialForm(initialSearch?: [string | undefined, FilterCriteria[]], options?: SearchOption[]): SearchForm {
  const [search, filters] = initialSearch ?? [undefined, []];
  const data = {__search: {value: search ?? ''}} as SearchForm;
  options?.forEach(o => {
    const filter = filters.find(f => f.field === o.name);
    data[o.name] = {
      value: filter?.value ?? '',
      operator: getOperatorKey(filter?.operator),
    };
  });
  return data;
}

function getFilterCount(data: SearchForm): number {
  let count = 0;
  for (const [key, value] of Object.entries(data)) {
    if (key === '__search') continue;
    if (value.value) count++;
  }
  return count;
}

function getSearchCriteria(data: SearchForm, options?: SearchOption[]): [string | undefined, FilterCriteria[]] {
  const filters = [] as FilterCriteria[];
  options?.forEach(opt => {
    if (!data[opt.name]?.value) return;
    filters.push({
      field: opt.name,
      operator: getCriteriaOperator(opt, data[opt.name]?.operator),
      value: data[opt.name]?.value,
    });
  });
  return [data['__search']?.value, filters];
}

function getCriteriaOperator(opt: SearchOption, value: any): SEARCH_OPERATOR {
  switch (value) {
    case '~':  return SEARCH_OPERATOR.CONTAIN;
    case '=':  return SEARCH_OPERATOR.EQUAL;
    case '<>': return SEARCH_OPERATOR.NOT_EQUAL;
    case '<':  return SEARCH_OPERATOR.LESS_THAN;
    case '<=': return SEARCH_OPERATOR.LESS_THAN_EQUAL;
    case '>':  return SEARCH_OPERATOR.GREATER_THAN;
    case '>=': return SEARCH_OPERATOR.GREATER_THAN_EQUAL;
  }
  return getDefaultCriteriaOperator(opt);
}

function getDefaultCriteriaOperator(opt: SearchOption): SEARCH_OPERATOR {
  if (opt.options != null) {
    return SEARCH_OPERATOR.EQUAL;
  } else if (opt.type == null || opt.type === 'string') {
    return SEARCH_OPERATOR.CONTAIN;
  } else {
    return SEARCH_OPERATOR.EQUAL;
  }
}

function getOperatorKey(operator?: SEARCH_OPERATOR): string | undefined {
  switch (operator) {
    case SEARCH_OPERATOR.CONTAIN: return '~';
    case SEARCH_OPERATOR.EQUAL: return '=';
    case SEARCH_OPERATOR.NOT_EQUAL: return '<>';
    case SEARCH_OPERATOR.LESS_THAN: return '<';
    case SEARCH_OPERATOR.LESS_THAN_EQUAL: return '<=';
    case SEARCH_OPERATOR.GREATER_THAN: return '>';
    case SEARCH_OPERATOR.GREATER_THAN_EQUAL: return '>=';
  }
  return undefined;
}
