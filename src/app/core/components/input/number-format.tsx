/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import React from 'react';
import ReactNumberFormat, {NumberFormatValues} from 'react-number-format';

export type NumberFormatProps = {
  thousandSeparator?: boolean;
  inputRef?: (instance: ReactNumberFormat | null) => void;
  onChange?: (event: {target: {name?: string, value?: string}}) => void;
  name?: string;
  prefix?: string;
}

export const NumberFormat = ({inputRef, onChange, ...props}: NumberFormatProps) => {
  function handleOnValueChange(values: NumberFormatValues) {
    onChange?.({target: {name: props.name, value: values.value}});
  }

  return (
    <ReactNumberFormat {...props}
      isNumericString
      thousandSeparator={props.thousandSeparator ?? true}
      getInputRef={inputRef}
      onValueChange={handleOnValueChange}
    />
  );
};
