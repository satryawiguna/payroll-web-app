/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

export type PayrollProcessSum = {
  process_id?: number;
  batch_name?: string;
  process_date?: Date;
  period_start?: Date;
  period_end?: Date;
  success_count?: number;
  failed_count?: number;
  total_count?: number;
  process_status?: string;
  description?: string;
};
