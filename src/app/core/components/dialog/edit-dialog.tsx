/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {cls} from 'app/utils';
import React, {
  cloneElement,
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, SecondaryButton} from '../button/button';
import {EditFormRef} from '../form/form-model';
import {Dialog, DialogRef} from './dialog';

export type EditDialogRef<T> = {
  open: (item?: T, options?: Record<string, any>) => Promise<DialogResult<T | undefined>>;
};

export type EditDialogProps<T> = {
  title?: string;
  className?: string;
  beforeSubmit?: (item: T | undefined, data: T, options?: Record<string, any>) => Promise<[boolean, Record<string, any> | undefined]>;
  content?: (item?: T) => ReactElement;
};

export const EditDialog = forwardRef(<T,>(
  props: EditDialogProps<T>, ref: Ref<EditDialogRef<T>>
) => {
  const [readOnly, setReadOnly] = useState(false);
  const [content, setContent] = useState<ReactNode>();
  const [isAdd, setIsAdd] = useState(true);
  const {t} = useTranslation('common');

  const existing = useRef<T>();
  const options = useRef<Record<string, any>>();
  const openResolve = useRef<(value: DialogResult<T | undefined>) => void>();
  const formRef = useRef<EditFormRef<T>>();
  const dialogRef = useRef<DialogRef<boolean>>(null);

  useImperativeHandle(ref, () => ({
    open: async (item, opt) => {
      existing.current = item;
      options.current = opt;

      const readOnly = opt?.readOnly as boolean ?? false;
      setReadOnly(readOnly);
      setIsAdd(item == null);

      const contentEl = props.content?.(item);
      const content = (contentEl != null) ? cloneElement(contentEl, {ref: (el: any) => {
        formRef.current = el;
        setTimeout(() => formRef.current?.setReadOnly?.(readOnly));
      }}) : undefined;
      setContent(content);

      dialogRef.current?.show();
      return await new Promise(resolve => openResolve.current = resolve);
    },
  }));

  async function handleClose(ok: boolean) {
    if (!ok) {
      await dialogRef.current?.close();
      const addtl = {} as Record<string, any>;
      if (formRef.current?.isModified != null) addtl.isModified = formRef.current.isModified();
      openResolve.current?.([false, undefined, addtl]);
      return;
    }

    const data = await formRef.current?.submit?.();
    const [valid, addtl] = (data != null)
      ? (await props.beforeSubmit?.(existing.current, data, options.current) ?? [true, undefined])
      : [false, undefined];
    if (!valid) return;

    await dialogRef.current?.close();
    openResolve.current?.([valid, data, addtl]);
  }

  return (
    <Dialog ref={dialogRef} fullWidth maxWidth="sm" className={cls('edit-dialog', props.className)}
            closeOnLostFocus={false} aria-labelledby="edit-dialog-title"
    >
      <DialogTitle id="edit-dialog-title">
        {t(isAdd ? 'title.add' : (readOnly ? 'title.view': 'title.edit')) + ' ' + (props.title ?? '')}
      </DialogTitle>

      <form noValidate>
        <DialogContent>{content}</DialogContent>

        <DialogActions>
          <SecondaryButton onClick={async () => await  handleClose(false)}>
            {t(readOnly ? 'button.close' : 'button.cancel')}
          </SecondaryButton>
          {!readOnly && <Button role="save" onClick={async () => await handleClose(true)}>
            {t('button.save')}
          </Button>}
        </DialogActions>
      </form>
    </Dialog>
  );
});

export type DialogResult<T> = [boolean, T, Record<string, any> | undefined];
