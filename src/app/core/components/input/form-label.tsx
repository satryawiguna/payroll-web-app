/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {useMediaQuery} from '@material-ui/core';
import _ from 'lodash';
import React, {PropsWithChildren} from 'react';
import {InputLabel} from './input-label';
import {InputAdornmentProps} from './input-model';

export type FormLabelProps<V> = {
  name?: string | string[];
  className?: string | string[];
  label?: string | string[];
  value?: V | (V | undefined)[];
  readOnly?: boolean;
  prefix?: InputAdornmentProps<any> | InputAdornmentProps<any>[];
  suffix?: InputAdornmentProps<any> | InputAdornmentProps<any>[];
};

export const FormLabel = <V,>(
  {name, className, label, value, ...props}: PropsWithChildren<FormLabelProps<V>>
) => {
  const isLargeScreen = !useMediaQuery('(max-width: 1199.98px)');

  const values = (_.isArray(value) ? value : [value]) as (V | undefined)[];
  const names = (_.isArray(name) ? name : (name ? values.map((v, i) => name + '-' + i) : []));
  const labels = _.isArray(label) ? label : [label];
  const classNames = _.isArray(className) ? className : (className ? values.map(() => className) : []);

  const el = (<>
    {label != null ? <label className="form-label" htmlFor={names[0]}>{isLargeScreen ? labels[0] : labels.join('/')}:</label> : undefined}
    <div className="form-control">
      <div className="form-control-inner">
        {values.map((value, i) => [
          (isLargeScreen && i > 0 && labels[i])
            ? <label key={'l-' + i} className="form-label" htmlFor={names[i]}>{labels[i]}:</label>
            : undefined,
          <InputLabel {...props} key={'k-' + i} name={names[i]} className={classNames[i]} value={value} />,
        ])}
      </div>
    </div>
  </>);
  return isLargeScreen ? el : <div className="form-control-wrap">{el}</div>;
};
