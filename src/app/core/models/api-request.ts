/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

export type PageResponse<T> = {
  pageNo?: number,
  perPage?: number,
  totalRow?: number,
  rows?: T[]
};

export type InsertResponse<ID> = {new_id: ID};
export type UpdateResponse = {count: number, new_history?: boolean};
export type DeleteResponse = {count: number};
