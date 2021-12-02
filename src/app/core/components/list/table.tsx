/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Checkbox, Icon} from '@material-ui/core';
import {cls, DB_DATE_FORMAT, formatDate} from 'app/utils';
import {format, parseISO} from 'date-fns';
import _ from 'lodash';
import React, {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {DataType} from '../input/input-model';
import {DataTableColumn} from './data-table-model';

export type TableProps<T> = {
  className?: string;
  columns: (DataTableColumn<T> | undefined)[];
  checkable?: boolean;
  allChecked?: boolean | undefined;
  isChecked?: (index: number | undefined) => boolean;
  onCheck?: (checked: boolean, index: number | undefined) => void;
  data: T[];
  actions?: (item: T, index: number) => ReactNode;
};

export const Table = <T,>({
  checkable, allChecked, isChecked, onCheck, data, actions, ...props}: TableProps<T>
) => {
  const {t} = useTranslation('common');
  const columns = props.columns?.filter(c => c != null) as DataTableColumn<T>[] ?? [];

  return (
    <div className={cls('data-table-wrap',  props.className)}>
      <div className="table-responsive">
        <table className="table data-table data-table-hover">
          <thead>
            {buildHeaderRow(columns, checkable, allChecked, onCheck, actions != null)}
          </thead>
          <tbody>
          {data.map((r: any, i) => (
            <tr key={i}>
              {checkable &&
                <th key="chk" className="check-content col-fit">
                  <Checkbox className="check" checked={isChecked?.(i)} onChange={e => onCheck?.(e.target.checked, undefined)} />
                </th>
              }
              {columns.map((c, j) => (
                <td key={`${i}-${j}`} className={cls('col-' + (c.type ?? 'string'), c.className)}>
                  {c.content
                    ? c.content(r, cellContent(r?.[c.name], c.type), i)
                    : (cellContent(r?.[c.name ?? ''], c.type) ?? '-')
                  }
                </td>
              ))}
              {(actions != null) &&
                <td className="table-actions">{actions?.(r, i)}</td>
              }
            </tr>
          ))}
          {!data.length &&
            <tr className="no-data">
              <td colSpan={props.columns?.filter(d => d != null)?.length ?? 1} className="text-center">{t('message.no-data')}</td>
              <td className="table-actions" />
            </tr>
          }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export function cellContent(value: any, type?: DataType): ReactNode {
  if (value == null || value === '') return undefined;

  if (type === 'date' || _.isDate(value)) {
    const d = _.isDate(value) ? value : parseISO('' + value);
    const s = format(d, DB_DATE_FORMAT);
    if (s === '1000-01-01' || s === '9000-12-31') return undefined;
    return formatDate(d);

  } else if (type === 'check-none') {
    return value ? <Icon>check</Icon> : undefined;
  }

  return value;
}

function buildHeaderRow<T>(columns: DataTableColumn<T>[], checkable?: boolean, allChecked?: boolean,
                           onCheck?: (checked: boolean, index: number | undefined) => void, hasActions?: boolean): ReactNode {
  const [rowCount, cols] = getHeaderContent(columns);
  const ret = [];

  for (let rowNum = 0; rowNum < rowCount; rowNum++) {
    const els = [];
    if (rowNum === 0 && checkable) {
      els.push(
        <th key="chk" rowSpan={rowCount} className="check-header col-fit">
          <Checkbox className="check" checked={allChecked} onChange={e => onCheck?.(e.target.checked, undefined)}/>
        </th>
      );
    }
    cols.forEach((contentArray, colNum) => {
      const multiRow = Array.isArray(contentArray);
      const content = multiRow ? contentArray[rowNum] : contentArray;
      if (rowNum >= 1 && (!multiRow || content == null)) return;

      const props = columns[colNum];
      const headerClass = Array.isArray(props.headerClass) ? props.headerClass[rowNum] : props.headerClass;
      els.push(
        <th
          key={colNum}
          rowSpan={multiRow ? 1 : rowCount}
          className={cls('col-' + (props.type ?? 'string'), props.className, headerClass)}
          style={props.headerStyle}
        >
          {content}
        </th>
      );
    });

    if (hasActions) {
      els.push(<th key="actions" rowSpan={rowCount} className="table-actions"/>);
    }
    ret.push(<tr key={rowNum}>{els}</tr>);
  }
  return ret;
}

function getHeaderContent<T>(columns: DataTableColumn<T>[]): [number, ReactNode[]] {
  const ret: ReactNode[] = [];
  let rowCount = 1;

  for (const c of columns) {
    const content = (typeof c.label === 'function') ? c.label() : c.label;
    if (Array.isArray(content) && content.length > rowCount) {
      rowCount = content.length;
    }
    ret.push(content);
  }
  return [rowCount, ret];
}
