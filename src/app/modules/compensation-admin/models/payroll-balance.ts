/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

export type PayrollBalance = {
  balance_id?: string;
  is_read_only?: boolean;
  balance_name?: string;
  balance_feed_type?: BalanceFeedType;
  description?: string;
  feeds?: BalanceFeed[];
};

export type BalanceFeedType = 'E' | 'C'; // E: By element | C: By classification

export type BalanceFeed = {
  feed_id?: string;
  is_read_only?: boolean;
  effective_start?: Date;
  effective_end?: Date;
  classification_id?: string;
  classification_name?: string;
  element_id?: string;
  element_name?: string;
  add_subtract?: AddSubtract;
};

export type AddSubtract = '+' | '-'; // +: Add | -: Subtract
