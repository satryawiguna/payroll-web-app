/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {TFunction} from 'i18next';
import React from 'react';
import {FieldError} from 'react-hook-form';
import {useTranslation} from 'react-i18next';

export type InputErrorProps = {
  errors?: (FieldError | undefined)[];
};

export const InputError = (props: InputErrorProps) => {
  const {t} = useTranslation();
  return (
    <p className="input-error">{errorMessage(t, ...props.errors ?? [])}</p>
  );
};

export function errorMessage(t: TFunction, ...errors: (FieldError | undefined)[]): string | undefined {
  if (!errors.length) return undefined;
  return errors.map(error => {
    if (error?.type === 'required') {
      return t('common:error.required-input');
    }
    return error?.type;
  }).filter((msg, i, a) => msg != null && a.indexOf(msg) === i).join(', ');
}
