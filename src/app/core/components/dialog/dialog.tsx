/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Dialog as MaterialDialog, DialogProps as MaterialDialogProps, Paper, PaperProps} from '@material-ui/core';
import {cls} from 'app/utils';
import React, {createContext, forwardRef, Ref, useImperativeHandle, useRef, useState} from 'react';
import Draggable from 'react-draggable';
import {AlertDialogData} from './alert-dialog';
import {ChangeInsertDialogResult} from './change-insert-confirm-dialog';
import {DeleteConfirmDialogData} from './delete-confirm-dialog';

export type ConfirmChangeInsertResult = [boolean, {mode?: ChangeInsertDialogResult}];

export type AlertDialogContextType = {
  confirmDelete: (content: DeleteConfirmDialogData) => Promise<boolean>,
  confirmChangeInsert: (effective: Date | undefined, newEffective: Date | undefined) => Promise<ConfirmChangeInsertResult>,
  alert: (content: AlertDialogData) => Promise<void>,
  alertInvalid: (content: AlertDialogData) => Promise<void>,
};

export const AlertDialogContext = createContext<AlertDialogContextType>({
  confirmDelete: () => Promise.resolve(false),
  confirmChangeInsert: () => Promise.resolve([false, {}]),
  alert: () => Promise.resolve(),
  alertInvalid: () => Promise.resolve(),
});

export type DialogRef<T> = {
  show: (open?: boolean) => void;
  open: () => Promise<T | undefined>;
  close: (result?: T) => Promise<void>;
};

export type DialogProps = Omit<MaterialDialogProps, 'open'> & {
  closeOnLostFocus?: boolean;
};

export const Dialog = forwardRef(<T,>(
  {children, closeOnLostFocus, ...dialogProps}: DialogProps, ref: Ref<DialogRef<T>>
) => {
  const [open, setOpen] = useState(false);
  const openResolve = useRef<(value?: T) => void>();

  useImperativeHandle(ref, () => ({
    show: (open?: boolean) => {
      openResolve.current = undefined;
      setOpen(open ?? true);
    },

    open: () => {
      setOpen(true);
      return new Promise(resolve => openResolve.current = resolve);
    },

    close: (result?: T) => {
      return handleClose(result);
    }
  }));

  async function handleClose(result?: T): Promise<void> {
    setOpen(false);
    openResolve.current?.(result);
  }

  return (
    <MaterialDialog
      {...dialogProps}
      className={cls(dialogProps.className, 'draggable-dialog')}
      PaperComponent={DraggablePaper}
      open={open}
      onClose={() => {
        if (closeOnLostFocus == null || closeOnLostFocus) {
          handleClose(undefined);
        }
      }}
      aria-labelledby="confirm-dialog-title"
    >
      {children}
    </MaterialDialog>
  );
});

const DraggablePaper = (props: PaperProps) => {
  const ref = useRef(null);
  return (
    <Draggable nodeRef={ref} handle=".MuiDialogTitle-root" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper ref={ref} {...props} />
    </Draggable>
  );
};
