/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  Icon,
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
  PropTypes,
  Tooltip
} from '@material-ui/core';
import {cls, Modify} from 'app/utils';
import i18next from 'i18next';
import React, {forwardRef, ReactNode, Ref, useEffect, useState} from 'react';

export type ButtonRole = 'refresh' | 'add' | 'add-circle' | 'save' | 'print' | 'back' | 'view' | 'edit' | 'delete' | 'more';
export type ButtonColor = PropTypes.Color | 'warn';

export type ButtonProps = Modify<Omit<MuiButtonProps, 'ref'>, {
  color?: ButtonColor,
  role?: ButtonRole,
  icon?: string
}>;

export const Button = forwardRef((props: ButtonProps, ref: Ref<never>) => {
  const [icon, setIcon] = useState<ReactNode>();

  useEffect(() => setIcon(createIcon(props.icon, props.role)), [props.icon, props.role]);

  return (
    <MuiButton
      {...props}
      ref={ref}
      type={props.type ?? 'button'}
      className={cls('app-button', (props.color && !isPropTypeColor(props.color)) ? `btn-${props.color}` : '')}
      variant={props.variant ?? 'contained'}
      color={propTypeColor(props.color) ?? 'primary'}
      startIcon={props.startIcon ?? icon}
    >
      {props.children}
    </MuiButton>
  );
});

export const SecondaryButton = forwardRef((props: ButtonProps, ref: Ref<never>) => {
  const [icon, setIcon] = useState<ReactNode>();

  useEffect(() => setIcon(createIcon(props.icon, props.role)), [props.icon, props.role]);

  return (
    <MuiButton
      {...props}
      ref={ref}
      type={props.type ?? 'button'}
      className={cls('app-secondary-button', buttonClassName(props))}
      variant="outlined"
      color={propTypeColor(props.color)}
      startIcon={props.startIcon ?? icon}
    >
      {props.children}
    </MuiButton>
  );
});

export type IconButtonProps = Modify<Omit<MuiIconButtonProps, 'ref'>, {
  role?: ButtonRole;
  icon?: string;
  tooltip?: string;
}>;

export const IconButton = forwardRef((
  {role, icon, tooltip: propsTooltip, ...props}: IconButtonProps, ref: Ref<never>
) => {
  const button = (
    <MuiIconButton
      {...props}
      ref={ref}
      type={props.type ?? 'button'}
      className={cls(props.className, 'app-icon-button', buttonClassName(props))}
      color={propTypeColor(props.color)}
    >
      {createIcon(icon, role)}{props.children}
    </MuiIconButton>
  );
  const tooltip = !props.disabled ? (propsTooltip ?? getLabelNameFromRole(role)) : undefined;
  return tooltip
    ? <Tooltip title={tooltip}>{button}</Tooltip>
    : button;
});

const BUTTON_TYPES: Record<ButtonRole, {icon: string, i18nLabel: string}> = {
  'refresh':    {icon: 'refresh', i18nLabel: 'common:button.refresh'},
  'add':        {icon: 'add', i18nLabel: 'common:button.add'},
  'add-circle': {icon: 'add_circle_outline', i18nLabel: 'common:button.add'},
  'save':       {icon: 'save', i18nLabel: 'common:button.save'},
  'print':      {icon: 'print', i18nLabel: 'common:button.print'},
  'back':       {icon: 'arrow_back', i18nLabel: 'common:button.back'},
  'view':       {icon: 'visibility', i18nLabel: 'common:button.view'},
  'edit':       {icon: 'edit', i18nLabel: 'common:button.edit'},
  'delete':     {icon: 'delete', i18nLabel: 'common:button.delete'},
  'more':       {icon: 'more_vert', i18nLabel: 'common:button.more'},
};

function createIcon(iconName?: string, role?: ButtonRole | undefined): ReactNode | undefined {
  if (!iconName) iconName = getIconNameFromRole(role);
  if (iconName) return <Icon>{iconName}</Icon>;
  return undefined;
}

function getIconNameFromRole(role: ButtonRole | undefined): string|undefined {
  if (!role) return undefined;
  return BUTTON_TYPES[role]?.icon;
}

function getLabelNameFromRole(role: ButtonRole | undefined): string|undefined {
  if (!role) return undefined;
  const lbl = BUTTON_TYPES[role]?.i18nLabel;
  return i18next.t(lbl);
}

function propTypeColor(color: ButtonColor|undefined): PropTypes.Color|undefined {
  if (isPropTypeColor(color)) return color as PropTypes.Color;
  return undefined;
}

function isPropTypeColor(color: ButtonColor|undefined): boolean {
  return color === 'inherit' || color === 'primary' || color === 'secondary' || color === 'default';
}

function buttonClassName(props: ButtonProps): string {
  const classNames = [];
  if (props.color && !isPropTypeColor(props.color)) classNames.push(`btn-${props.color}`);
  if (props.role) classNames.push(`btn-${props.role}`);
  return classNames.join(' ');
}
