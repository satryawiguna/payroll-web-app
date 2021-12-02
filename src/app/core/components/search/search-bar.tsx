/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import React, {forwardRef, Ref, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {InputAdornmentProps, InputChangeEvent} from '../input/input-model';
import {InputText} from '../input/input-text';

export type SearchInputBarProps = {
  value: string | undefined;
  onReset: () => void;
  onSearch: (value?: string) => void;
  onAdvancedClick: (event: React.MouseEvent<HTMLElement>) => void;
  hasAdvancedFilter: boolean;
  filterCount: number
};

export const SearchBar = forwardRef((
  {onSearch, onReset, ...props}: SearchInputBarProps, ref: Ref<HTMLDivElement>
) => {
  const [value, setValue] = useState<string>();
  const obs$ = useRef<Subject<string | undefined>>();
  const {t} = useTranslation('common');

  useEffect(() => setValue(props.value), [props.value]);

  useEffect(() => {
    obs$.current = new Subject<string | undefined>();
    const sub$ = obs$.current?.pipe(debounceTime(300)).subscribe(value => {
      onSearch(value);
    });
    return () => sub$.unsubscribe();
  }, []);

  function handleOnChange(event: InputChangeEvent<string>) {
    setValue(event.target.value);
    obs$.current?.next(event.target.value);
  }

  function handleOnKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      onSearch(value);
    }
  }

  const suffix: InputAdornmentProps<any>[] = [];
  if (props.value) {
    suffix.push({icon: 'clear', className: 'btn-clear', tooltip: t('button.clear'), onClick: onReset});
  }
  suffix.push({icon: 'search', tooltip: t('button.search'), onClick: () => onSearch(value)});

  return (
    <div ref={ref} className="search-bar">
      <InputText
        className="search-input"
        placeholder={t('label.search')}
        value={props.value}
        onChange={handleOnChange}
        onKeyPress={handleOnKeyPress}
        prefix={props.hasAdvancedFilter ? {
          icon: getFilterIcon(props.filterCount),
          tooltip: t('button.advanced-search'),
          color: (props.filterCount > 0) ? 'primary' : undefined,
          onClick: props.onAdvancedClick,
        } : undefined}
        suffix={suffix}
      />
    </div>
  );
});

function getFilterIcon(filterCount: number) {
  if (filterCount === 0) return 'filter_none';
  if (filterCount < 8) return `filter_${filterCount}`;
  return 'filter_9_plus';
}
