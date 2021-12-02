/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple';
import {cls} from 'app/utils';
import React, {PropsWithChildren, ReactNode, Ref, useRef} from 'react';
import './list.scss';

type ListProps = {
  className?: string;
};

export const List = (props: PropsWithChildren<ListProps>) => {
  return (
    <nav className={cls('list',  props.className)}>
      <ul>{props.children}</ul>
    </nav>
  );
};

type ListItemProps = {
  label?: ReactNode;
  subLabel?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const ListItem = (props: ListItemProps) => {

  const rippleRef: Ref<any> = useRef(null);
  const onRippleStart = (e: any) => { if (e.button === 0) rippleRef.current?.start(e); };
  const onRippleStop = (e: any) => { rippleRef.current?.stop(e); };

  const content = [] as ReactNode[];
  if (props.label || props.subLabel) {
    content.push(
      <div key="text" className="list-item-text">
        {props.label && <div className="primary">{props.label}</div>}
        {props.subLabel && <div className="secondary">{props.subLabel}</div>}
      </div>
    );
  }

  return (
    <li className={cls('list-item', props.active ? 'active' : '')}>
      {props.onClick != null
        ? <a href="#" className="list-item-inner"
             onMouseDown={onRippleStart} onMouseUp={onRippleStop}
             onClick={e => {e.preventDefault(); props.onClick?.();}}
          >
            {content}
            <TouchRipple ref={rippleRef} />
          </a>
        : <div className="list-item-inner">{content}</div>
      }
    </li>
  );
};
