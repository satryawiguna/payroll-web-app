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
  Button,
  Icon,
  IconButton,
  InputAdornment as MuiInputAdornment,
  Menu,
  MenuItem,
  PropTypes,
  Tooltip
} from '@material-ui/core';
import _ from 'lodash';
import React, {ReactNode, useState} from 'react';
import {InputAdornmentProps} from './input-model';

export const InputAdornment = <T,>(props: InputAdornmentProps<T>) => {
  const [tooltipState, setTooltipState] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function handleOnClick(event: React.MouseEvent<HTMLElement>) {
    props.onClick?.(event);
    setAnchorEl(event.currentTarget);
  }

  function handleOnPopupClose(item?: T) {
    setAnchorEl(null);
    if (item == null) return;
    props.onChange?.({target: {name: props.name, value: item}});
  }

  return (
    <Tooltip
      disableHoverListener
      title={props.tooltip ?? ''}
      open={tooltipState}
      onMouseEnter={() => setTooltipState(true)}
      onMouseLeave={() => setTooltipState(false)}
      onClick={() => setTooltipState(false)}
    >
      <MuiInputAdornment className={props.className} position={props.position ?? 'end'}>
        <AdornmentContent
          icon={props.icon}
          label={props.label}
          color={props.color}
          clickable={props.onClick != null || Boolean(props.list?.length)}
          onClick={handleOnClick}
        />
        {props.list?.length &&
          <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => handleOnPopupClose()}>
            {props.list.map((l, i) => (
              <MenuItem key={i} onClick={() => handleOnPopupClose(l)}>
                <span className="text-center" style={{minWidth: '3em', marginLeft: '-12px'}}>
                  {props.getListKey?.(l)}
                </span>
                <span style={{minWidth: '100px'}}>{props.getListLabel?.(l)}</span>
              </MenuItem>
            ))}
          </Menu>
        }
      </MuiInputAdornment>
    </Tooltip>
  );
};

type AdornmentContentProps = {
  icon?: string;
  label?: string;
  color?: PropTypes.Color;
  clickable?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

const AdornmentContent = (props: AdornmentContentProps) => {
  if (props.clickable) {
    if (props.icon && props.label) {
      return (
        <Button type="button" color={props.color} onClick={(event) => props.onClick?.(event)}>
          <Icon>{props.icon}</Icon>{props.label}
        </Button>
      );
    } else if (props.icon) {
      return (
        <IconButton type="button" color={props.color} onClick={(event) => props.onClick?.(event)}>
          <Icon>{props.icon}</Icon>{props.label}
        </IconButton>
      );
    } else {
      return (
        <Button type="button" color={props.color} onClick={(event) => props.onClick?.(event)}>
          {props.label}
        </Button>
      );
    }
  } else {
    if (props.icon && props.label) {
      return <><Icon className="adornment-icon">{props.icon}</Icon>props.label</>;
    } else if (props.icon) {
      return <Icon className="adornment-icon">{props.icon}</Icon>;
    } else {
      return <>{props.label}</>;
    }
  }
};

export function createAdornments<T>(
  position: 'start' | 'end',
  props?: InputAdornmentProps<T> | InputAdornmentProps<T>[]
): ReactNode | undefined {
  if (!props) return undefined;
  if (!_.isArray(props)) props = [props];

  const el = props.map((prop, i) => (
    <InputAdornment {...prop} key={i} position={position} />
  )) as ReactNode[];

  return el.length ? el : undefined;
}
