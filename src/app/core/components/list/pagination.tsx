/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Icon, IconButton, MenuItem, Select} from '@material-ui/core';
import {cls} from 'app/utils';
import {DEFAULT_PER_PAGE, PAGES_TO_SHOW} from 'config';
import React, {useRef} from 'react';
import {useTranslation} from 'react-i18next';
import './pagination.scss';

export type PaginationProp = {
  pageNo?: number;
  perPage?: number;
  pagesToShow?: number;
  totalRow?: number;
  onPageChange?: (page: number, perPage: number) => void;
};

export const Pagination = (props: PaginationProp) => {
  const {t} = useTranslation('common');
  const elRef = useRef<HTMLDivElement>(null);

  const pageNo = props.pageNo ?? 0;
  const perPage = props.perPage ?? DEFAULT_PER_PAGE;
  const totalRow = props.totalRow ?? 0;
  const pagesToShow = props.pagesToShow ?? PAGES_TO_SHOW;
  const page = calculatePage(pageNo, perPage, totalRow, pagesToShow);

  const prevPageIsDisabled = pageNo <= 0;
  const nextPageIsDisabled = pageNo >= page.totalPage - 1;

  const width = elRef.current?.offsetWidth ?? 0;
  const compactView = width < 300;

  function onFirstPageClick() {
    onPageChange(0);
  }

  function onPrevPageClick() {
    if (!prevPageIsDisabled) onPageChange(pageNo - 1);
  }

  function onNextPageClick() {
    if (!nextPageIsDisabled) onPageChange(pageNo + 1);
  }

  function onLastPageClick() {
    onPageChange(page.totalPage - 1);
  }

  function onPageChange(page: number) {
    // setPageNo(page);
    props.onPageChange?.(page, props.perPage ?? DEFAULT_PER_PAGE);
  }

  return (
    <div ref={elRef} className={cls('pagination-wrap', compactView ? 'compact' : '')}>
      <ul className="pagination">
        <li className="first-page">
          <IconButton type="button" className="page-no" onClick={onFirstPageClick} disabled={prevPageIsDisabled}>
            <Icon>first_page</Icon>
          </IconButton>
        </li>
        <li className="prev-page">
          <IconButton type="button" className="page-no" onClick={onPrevPageClick} disabled={prevPageIsDisabled}>
            <Icon>chevron_left</Icon>
          </IconButton>
        </li>
        {!compactView
          ? page.pages.map((p, i) => {
              if (pageNo !== p) {
                return <IconButton key={i} className="page-no" onClick={() => onPageChange(p)}>{p + 1}</IconButton>;
              } else {
                return <span key={i} className="page-no active"><span className="page-no-inner">{p + 1}</span></span>;
              }
            })
          : <span className="page-no active"><span className="page-no-inner">{pageNo + 1}</span></span>
        }
        <li className="next-page">
          <IconButton type="button" className="page-no" onClick={onNextPageClick} disabled={nextPageIsDisabled}>
            <Icon>chevron_right</Icon>
          </IconButton>
        </li>
        <li className="last-page">
          <IconButton type="button" className="page-no" onClick={onLastPageClick} disabled={nextPageIsDisabled}>
            <Icon>last_page</Icon>
          </IconButton>
        </li>
      </ul>

      {!compactView &&
      <div className="page-info">
        <div className="d-none d-sm-block text-muted ml-2 text-right">
          {page.startRow} - {page.endRow} {t('label.page-of')} {props.totalRow}
        </div>
        <div className="d-none d-sm-block text-muted ml-2 mr-2">
          / {t('label.per-page')}:
        </div>
        <PerPage value={page.perPage} onChange={value => props.onPageChange?.(pageNo, value)} />
      </div>}
    </div>
  );
};

const PerPage = (props: {value: number, onChange: (perPage: number) => void}) => {
  return (
    <Select value={props.value} onChange={e => props.onChange(e.target.value as number ?? 0)}>
      <MenuItem value={3}>3</MenuItem>
      <MenuItem value={5}>5</MenuItem>
      <MenuItem value={10}>10</MenuItem>
      <MenuItem value={15}>15</MenuItem>
      <MenuItem value={20}>20</MenuItem>
      <MenuItem value={30}>30</MenuItem>
      <MenuItem value={50}>50</MenuItem>
      <MenuItem value={100}>100</MenuItem>
      <MenuItem value={200}>200</MenuItem>
      <MenuItem value={300}>300</MenuItem>
    </Select>
  );
};

type Page = {
  startRow: number;
  endRow: number;
  pages: number[];
  perPage: number;
  totalPage: number;
}

function calculatePage(pageNo: number, perPage: number, totalRow: number, pagesToShow: number): Page {
  const startRow = totalRow > 0 ? perPage * pageNo + 1 : 0;
  const n = startRow + perPage - 1;
  const endRow = (n < totalRow) ? n : totalRow;
  const totalPage = Math.ceil(totalRow / perPage);
  const pages = (totalPage > 0) ? generatePages(pageNo, pagesToShow, totalPage) : [];
  return {
    startRow: startRow,
    endRow: endRow,
    pages: pages,
    perPage: perPage,
    totalPage: totalPage,
  };
}

function generatePages(pageNo: number, pagesToShow: number, totalPage: number) {
  const maxPage = totalPage - 1;
  let start = pageNo - Math.ceil(pagesToShow / 2) + 1;
  if (start < 0) start = 0;
  let end = start + pagesToShow - 1;
  if (end > maxPage) {
    end = maxPage;
    start = end - pagesToShow;
    if (start < 0) start = 0;
  }
  const pages: number[] = [];
  for (start; start <= end; start++) {
    pages.push(start);
  }
  return pages;
}
