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
import React, {forwardRef, Ref, useImperativeHandle, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from '../button/button';
import {Dialog, DialogRef} from './dialog';

export type ChangeInsertDialogResult = 'correction' | 'change-insert' | undefined;

export type ChangeInsertDialogRef = {
  open: () => Promise<ChangeInsertDialogResult>;
}

export type ChangeInsertDialogProps = {
};

export const ChangeInsertDialog = forwardRef((props: ChangeInsertDialogProps, ref: Ref<ChangeInsertDialogRef>) => {
  const {t} = useTranslation('common');
  const dialogRef = useRef<DialogRef<ChangeInsertDialogResult>>(null);

  useImperativeHandle(ref, () => ({
    open: async () => {
      return await dialogRef.current?.open() ?? undefined;
    }
  }));

  return (
    <Dialog ref={dialogRef}>
      <DialogTitle>{t('title.confirm-update')}</DialogTitle>

      <DialogContent>
        <div className="alert-dialog-content">
          <div className="dialog-icon">
            <Icon>info</Icon>
          </div>
          <div className="dialog-message" dangerouslySetInnerHTML={{__html: t('message.confirm-change-insert')}} />
        </div>
      </DialogContent>

      <DialogActions className="alert-dialog-actions">
        <Button variant="text" color="default" onClick={() => dialogRef.current?.close(undefined)}>
          {t('button.cancel')}
        </Button>
        <Button variant="text" color="primary" onClick={() => dialogRef.current?.close('correction')}>
          {t('button.correction')}
        </Button>
        <Button variant="text" color="primary" onClick={() => dialogRef.current?.close('change-insert')}>
          {t('button.change-insert')}
        </Button>
      </DialogActions>
    </Dialog>
  );
});
