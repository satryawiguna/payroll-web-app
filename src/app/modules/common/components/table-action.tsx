/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {AlertDialogContext, IconButton, NavLink, TrackingHistory} from 'app/core/components';
import {HistoryItem} from 'app/core/models';
import {COMPONENT_NAME} from 'config';
import React, {ReactNode, useContext} from 'react';

export type TableActionProps<ID> = {
  confirmLabel?: any;
  onEdit?: (segment: string) => void;
  onView?: (segment: string) => void;
  onDelete?: (confirm: boolean) => void;
  history?: {
    id: ID,
    name: COMPONENT_NAME,
    onClick?: (effective: Date | undefined, histories: HistoryItem[]) => void,
  };
  readOnly?: boolean;
};

export const TableAction = <ID,>(props: TableActionProps<ID>) => {
  const ctx = useContext(AlertDialogContext);
  const segment = props.readOnly ? 'view' : 'edit';

  function handleOnDelete() {
    ctx.confirmDelete?.({params: {item: props.confirmLabel}}).then(confirm => {
      props.onDelete?.(confirm);
    });
  }

  return (<>
    {props.history != null && <TrackingHistory {...props.history} />}
    {props.onEdit && <IconButton role={segment} onClick={() => props.onEdit?.(segment)} />}
    {props.onView && <IconButton role="view" onClick={() => props.onView?.(segment)} />}
    {props.onDelete && <IconButton role="delete" disabled={props.readOnly} onClick={handleOnDelete} />}
  </>);
};

export type TableLinkProps = {
  content: ReactNode;
  subContent?: ReactNode;
  onClick: (segment: string) => void;
  itemIsReadOnly?: boolean;
};

export const TableLink = (props: TableLinkProps) => {
  const segment = props.itemIsReadOnly ? 'view' : 'edit';
  return (<>
    <div className="cell-primary cell-lg">
      <NavLink to="#" onClick={(e) => {e.preventDefault(); props.onClick?.(segment);}}>{props.content}</NavLink>
    </div>
    {props.subContent &&
      <div className="cell-sm cell-muted">{props.subContent}</div>
    }
  </>);
};
