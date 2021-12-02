/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {useMediaQuery} from '@material-ui/core';
import {cls} from 'app/utils';
import {TFunction} from 'i18next';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {SearchOption, SearchOptionType} from '../../models';
import {InputDate, InputDateProps} from '../input/input-date';
import {InputChangeEvent} from '../input/input-model';
import {InputNumber, InputNumberProps} from '../input/input-number';
import {InputSelect, InputSelectProps} from '../input/input-select';
import {InputText, InputTextProps} from '../input/input-text';

export type SearchControlProps<V> = SearchOption & {
  value: V;
  placeholder?: string;
  prefixLabel?: string;
  onChange: (field: string, valueType: 'value' | 'operator', value: V | undefined) => void
};

export const SearchControl = <V,>(props: SearchControlProps<V>) => {
  const {t} = useTranslation('common');
  const isLargeScreen = !useMediaQuery('(max-width: 1199.98px)');

  const el = (<>
    <label className="form-label" htmlFor={`search_${props.name}`}>{props.label}:</label>
    <div className="form-control">
      <div className="form-control-inner">
        <SearchInput
          id={`search_${props.name}`}
          name={props.name}
          label={undefined}
          placeholder={props.placeholder}
          type={getInputType(props.type, props.options != null)}
          className={cls('search-input', props.className)}
          options={props.options}
          getOptionLabel={d => d.label ?? t(d.i18nLabel!)}
          value={props.value}
          onChange={(e: InputChangeEvent<V>) => props.onChange(props.name, 'value', e.target.value)}
          prefix={{
            list: getListOperators(props.type, t, props.options != null),
            label: props.prefixLabel,
            getListKey: (option) => option['id'],
            getListLabel: (option) => option['label'],
            onChange: e => props.onChange(props.name, 'operator', e.target.value?.['id'])
          }}
        />
      </div>
    </div>
  </>);
  return isLargeScreen ? el : <div className="form-control-wrap">{el}</div>;
};

export type InputType = 'text' | 'number' | 'select' | 'date';

export type SearchInputProps<V, O extends Record<string, any>> =
  (InputTextProps | InputNumberProps | InputSelectProps<O, V> | InputDateProps) & {
  type: InputType,
};

export const SearchInput = <V, O extends Record<string, any>>(
  {type, ...inputProps}: SearchInputProps<V, O>
) => {
  const getOptionLabel = (inputProps as any).getOptionLabel;
  delete (inputProps as any).getOptionLabel;

  switch (type) {
    case 'select':
      return <InputSelect {...inputProps as InputSelectProps<O, V>} getOptionLabel={getOptionLabel} />;
    case 'date':
      return <InputDate {...inputProps as InputDateProps} />;
    case 'number':
      return <InputNumber {...inputProps as InputNumberProps} />;
    default:
      return <InputText {...inputProps as InputTextProps} />;
  }
};

function getInputType(type: SearchOptionType | undefined, hasList: boolean): InputType {
  if (hasList) return 'select';
  if (type === 'number') return 'number';
  if (type === 'date') return 'date';
  return 'text';
}

function getListOperators(type: SearchOptionType | undefined, t: TFunction, hasList: boolean): Record<string, any>[] {
  if (hasList) {
    return [
      {id: '=',  label: t('label.equal')},
      {id: '<>', label: t('label.not-equal')},
    ];
  } else if (type === 'number' || type === 'date') {
    return [
      {id: '=',  label: t('label.equal')},
      {id: '<>', label: t('label.not-equal')},
      {id: '<',  label: t('label.less-than')},
      {id: '<=', label: t('label.less-than-equal')},
      {id: '>',  label: t('label.greater-than')},
      {id: '>=', label: t('label.greater-than-equal')},
    ];
  } else {
    return [
      {id: '~',  label: t('label.contain')},
      {id: '=',  label: t('label.equal')},
      {id: '<>', label: t('label.not-equal')},
    ];
  }
}
