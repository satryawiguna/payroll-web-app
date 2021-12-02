/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import React, {forwardRef, ReactNode, Ref} from 'react';
import {DataTableColumn} from './data-table-model';
import './data-table.scss';
import {PageData, PageDataProps, PageDataRef} from './page-data';
import {Table} from './table';

export type DataTableProps<T extends Record<string, any>> = Omit<PageDataProps<T>, 'render'> & {
  columns: DataTableColumn<T>[];
  columnId?: string;
  checkable?: boolean;
  allChecked?: boolean;
  isChecked?: (index: number | undefined) => boolean;
  onCheck?: (checked: boolean, index: number | undefined) => void;
  actions?: (item: T, index: number) => ReactNode;
};

export type DataTableRef<T> = PageDataRef<T>;

export const DataTable = forwardRef(<T extends Record<string, any>>({
  columns, actions, ...props}: DataTableProps<T>, ref: Ref<DataTableRef<T>>
) => {
  return (
    <PageData
      {...props}
      ref={ref}
      render={(data) => (
        <Table
          columns={columns}
          checkable={props.checkable}
          allChecked={props.allChecked}
          isChecked={props.isChecked}
          onCheck={props.onCheck}
          data={data}
          actions={actions}
        />
      )}
    />
  );
});
