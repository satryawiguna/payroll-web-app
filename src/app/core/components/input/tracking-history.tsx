/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Menu, MenuItem} from '@material-ui/core';
import {formatDate, Modify} from 'app/utils';
import {COMPONENT_NAME} from 'config';
import React, {MouseEvent, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Subscription} from 'rxjs';
import {HistoryItem} from '../../models';
import {TrackingHistorySvc} from '../../services/tracking-history-svc';
import {IconButton, IconButtonProps} from '../button/button';
import './tracking-history.scss';

export type TrackingHistoryProps<ID> = Modify<IconButtonProps, {
  name: COMPONENT_NAME;
  id: ID;
  onClick?: (effective: Date | undefined, histories: HistoryItem[]) => void;
}>;

export const TrackingHistory = <ID,>({name, id, onClick, ...props}: TrackingHistoryProps<ID>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const {t} = useTranslation('common');
  const sub$ = useRef<Subscription>();

  const open = Boolean(anchorEl);

  function getHistories() {
    sub$.current?.unsubscribe();
    sub$.current = TrackingHistorySvc.getHistories(name, id).subscribe(res => setItems(res));
  }

  function showPopup(event: MouseEvent<HTMLButtonElement>) {
    getHistories();
    setAnchorEl(event.currentTarget);
  }

  function closePopup(item?: HistoryItem) {
    setAnchorEl(undefined);
    if (item != null) {
      onClick?.(item?.effective_start ?? item?.effective_end, items);
    }
  }

  const noHistory = (items.length === 0)
                 || (items.length === 1 && items[0].effective_start == null && items[0].effective_end == null);

  return (
    <span>
      <IconButton {...props} className="btn-history" tooltip={t('label.history')} icon="access_time" onClick={showPopup} />
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        getContentAnchorEl={null} // set null agar menu tampil di bawah tombol
        PaperProps={{className: 'menu-history'}}
        open={open}
        onClose={() => closePopup(undefined)}
      >
        {noHistory
          ? <MenuItem onClick={() => closePopup(undefined)}>
              {t('label.no-history')}
            </MenuItem>
          : items.map((item, i) => (
            <MenuItem key={i} onClick={() => closePopup(item)}>
              <span>{formatDate(item.effective_start) ?? t('label.beginning')}</span><span>-</span>
              <span>{formatDate(item.effective_end) ?? t('label.end')}</span>
            </MenuItem>
          ))
        }
      </Menu>
    </span>
  );
};
