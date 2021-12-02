/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

export type PayrollGroup = {
  pay_group_id?: string;
  is_read_only?: boolean;
  effective_start?: Date;
  effective_end?: Date;
  pay_group_name?: string;
  description?: string;
};

export type PayrollGroupCbx = {
  pay_group_id: string;
  pay_group_name: string;
};
