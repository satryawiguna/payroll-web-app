/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {DialogActions, DialogContent, DialogTitle, Icon} from '@material-ui/core';
import React, {forwardRef, Ref, useImperativeHandle, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from '../button/button';
import {DeleteConfirmDialogData} from './delete-confirm-dialog';
import {Dialog, DialogRef} from './dialog';

export type AlertDialogData = {
  title?: string;
  icon?: string;
  message?: string,
  i18nMessage?: string;
  params?: Record<string, any>
};

export type AlertDialogRef = {
  open: (content: AlertDialogData) => Promise<void>;
}

export type AlertDialogProps = {
};

export const AlertDialog = forwardRef((props: AlertDialogProps, ref: Ref<AlertDialogRef>) => {
  const [state, setState] = useState<AlertDialogData>();
  const {t} = useTranslation('common');
  const dialogRef = useRef<DialogRef<void>>(null);

  useImperativeHandle(ref, () => ({
    open: async (content: AlertDialogData) => {
      setState(content);
      await dialogRef.current?.open();
    }
  }));

  function getMessage(content?: DeleteConfirmDialogData): string {
    if (content?.message) return content?.message;
    if (!content?.i18nMessage) return '';
    return t(content.i18nMessage, {...content?.params, interpolation: {escapeValue: false}});
  }

  return (
    <Dialog ref={dialogRef}>
      <DialogTitle>{state?.title ?? t('title.alert')}</DialogTitle>

      <DialogContent>
        <div className="alert-dialog-content">
          <div className="dialog-icon">
            <Icon>{state?.icon ?? 'error_outline'}</Icon>
          </div>
          <div className="dialog-message" dangerouslySetInnerHTML={{__html: getMessage(state)}} />
        </div>
      </DialogContent>

      <DialogActions className="alert-dialog-actions">
        <Button color="default" variant="text" onClick={() => dialogRef.current?.close()}>
          {t('button.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
});
