import {DialogActions, DialogContent, DialogTitle, Icon} from '@material-ui/core';
import React, {forwardRef, Ref, useImperativeHandle, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from '../button/button';
import {Dialog, DialogRef} from './dialog';

export type DeleteConfirmDialogData = {
  message?: string,
  i18nMessage?: string,
  params?: Record<string, any>;
};

export type DeleteConfirmDialogRef = {
  open: (content: DeleteConfirmDialogData) => Promise<boolean>;
}

export type DeleteConfirmDialogProps = {
  title?: string;
};

export const DeleteConfirmDialog = forwardRef((props: DeleteConfirmDialogProps, ref: Ref<DeleteConfirmDialogRef>) => {
  const [state, setState] = useState<DeleteConfirmDialogData>();
  const {t} = useTranslation('common');
  const dialogRef = useRef<DialogRef<boolean>>(null);

  useImperativeHandle(ref, () => ({
    open: async (content: DeleteConfirmDialogData) => {
      setState(content);
      return await dialogRef.current?.open() ?? false;
    }
  }));

  function getMessage(content?: DeleteConfirmDialogData): string {
    if (content?.message) return content?.message;
    const i18nMessage = content?.i18nMessage ?? 'message.confirm-permanent-delete';
    return t(i18nMessage, {...content?.params, interpolation: {escapeValue: false}});
  }

  return (
    <Dialog ref={dialogRef}>
      <DialogTitle>{props.title ?? t('title.confirm-delete')}</DialogTitle>

      <DialogContent>
        <div className="alert-dialog-content">
          <div className="dialog-icon">
            <Icon>report</Icon>
          </div>
          <div className="dialog-message" dangerouslySetInnerHTML={{__html: getMessage(state)}} />
        </div>
      </DialogContent>

      <DialogActions className="alert-dialog-actions">
        <Button color="default" variant="text" onClick={() => dialogRef.current?.close(false)}>
          {t('button.cancel')}
        </Button>
        <Button color="warn" variant="text" onClick={() => dialogRef.current?.close(true)}>
          {t('button.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
});
