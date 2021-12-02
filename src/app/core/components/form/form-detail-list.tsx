/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {COMPONENT_NAME} from 'config';
import React, {forwardRef, ReactElement, ReactNode, Ref, useImperativeHandle, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {HistoryItem} from '../../models';
import {IconButton, SecondaryButton} from '../button/button';
import {DialogResult, EditDialog, EditDialogRef} from '../dialog/edit-dialog';
import {TrackingHistory} from '../input/tracking-history';
import {DataTableColumn} from '../list/data-table-model';
import {Table} from '../list/table';

export type FormDetailListProps<T extends Record<string, any>, ID> = {
  name?: COMPONENT_NAME;
  title?: string;
  formTitle?: string;
  addButtonLabel?: string;
  addButtonDisabled?: boolean;
  columnId?: keyof T;
  columns: (DataTableColumn<T> | undefined)[];
  items: T[];
  getUniqueId?: (item: T) => ID | undefined;
  withHistory?: boolean;
  readOnly?: boolean;

  onHistoryChange?: (effective: Date | undefined, item: T, index: number) => void;
  beforeSubmit?: (item: T | undefined, data: T, options?: Record<string, any>) => Promise<[boolean, Record<string, any> | undefined]>
  onInsert?: (data: T) => void;
  onView?: (item: T, index: number, addtl?: Record<string, any>) => void,
  onUpdate?: (item: T, index: number, data: T, addtl?: Record<string, any>) => void;
  onDelete?: (item: T, index: number, addtl?: Record<string, any>) => void;

  actions?: (item: T, index: number) => ReactNode;
  dialogContent?: (item?: T) => ReactElement;
  dialogClassName?: string;
};

export type FormDetailListRef<T> = {
  openDialog: (item?: T, options?: Record<string, any>) => Promise<DialogResult<T | undefined>>;
}

export const FormDetailList = forwardRef(<T extends Record<string, any>, ID>(
  {items, ...props}: FormDetailListProps<T, ID>, ref: Ref<FormDetailListRef<T>>
) => {
  const {t} = useTranslation('common');
  const dialogRef = useRef<EditDialogRef<T>>(null);

  useImperativeHandle(ref, () => ({
    openDialog: (item, options) => dialogRef.current?.open(item, options) ?? Promise.resolve([false, undefined, undefined]),
  }));

  async function handleHistoryChange(effective: Date | undefined, item: T, index: number, histories: HistoryItem[]) {
    if (histories.length <= 1) return;
    props.onHistoryChange?.(effective, item, index);
  }

  async function handleAdd() {
    const options = {existingIds: getIds()};
    const [cont, data] = await dialogRef.current?.open(undefined, options) ?? [false, undefined];
    if (!cont) return;
    props.onInsert?.(data!);
  }

  async function handleView(item: T, index: number) {
    const [, , addtl] = await dialogRef.current?.open(item, {readOnly: true}) ?? [false, undefined, undefined];
    props.onView?.(item, index, addtl);
  }

  async function handleEdit(item: T, index: number) {
    const options = {existingIds: getIds(item)};
    const [cont, data, addtl] = await dialogRef.current?.open(item, options) ?? [false, undefined, undefined];
    if (!cont) return;
    props.onUpdate?.(item, index, data!, addtl);
  }

  function getIds(excludeItem?: T): ID[] {
    if (props.getUniqueId == null) return [];
    const ret: ID[] = [];
    items.forEach(d => {
      const id = props.getUniqueId!(d);
      if (id && !ret.includes(id)) {
        const excludeId = (excludeItem != null) ? props.getUniqueId!(excludeItem) : undefined;
        if (!excludeId || id !== excludeId) ret.push(id);
      }
    });
    return ret;
  }

  async function handleDelete(item: T, index: number) {
    props.onDelete?.(item, index);
  }

  function actions(item: T, index: number): ReactNode {
    if (props.actions != null) return props.actions(item, index);

    const el = [];
    if (props.withHistory && props.name) {
      el.push(
        <TrackingHistory key={1} name={props.name} id={props.columnId != null ? item[props.columnId] : undefined}
                         onClick={(effective, histories) => handleHistoryChange(effective, item, index, histories)} />
      );
    }
    if (!props.readOnly && props.onView != null) {
      el.push(<IconButton key={2} role="view" onClick={() => handleView(item, index)} />);
    }
    if (!props.readOnly && props.onUpdate != null) {
      el.push(<IconButton key={3} role="edit" onClick={() => handleEdit(item, index)} />);
    }
    if (!props.readOnly && props.onDelete != null) {
      el.push(<IconButton key={4} role="delete" disabled={(item as any)[props.columnId] == null}
                          onClick={() => handleDelete(item, index)} />);
    }
    return el;
  }

  return (<>
    <div className="form-title mt-4">
      <h1>{props.title}</h1>

      <div className="form-title-actions">
        {!props.readOnly && props.onInsert != null &&
          <SecondaryButton role="add" disabled={props.addButtonDisabled ?? false} onClick={() => handleAdd()}>
            {props.addButtonLabel ?? t('button.add')}
          </SecondaryButton>
        }
      </div>
    </div>

    <Table
      columns={props.columns}
      data={items}
      actions={actions}
    />

    <EditDialog
      ref={dialogRef}
      className={props.dialogClassName}
      title={props.formTitle ?? props.title}
      beforeSubmit={props.beforeSubmit}
      content={props.dialogContent}
    />
  </>);
});
