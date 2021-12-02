/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {CSSProperties, ReactNode} from 'react';
import {DataType} from '../input/input-model';

export type DataTableColumn<T> = {
  name: keyof T;
  label?: string | (() => ReactNode);
  type?: DataType;
  decimalRound?: number;
  content?: (item: T, value: any, index: number) => ReactNode;
  className?: string;
  headerClass?: string | string[];
  headerStyle?: CSSProperties;
};
