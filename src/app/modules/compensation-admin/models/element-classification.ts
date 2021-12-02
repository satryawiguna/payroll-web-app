/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

export type ElementClassification = {
  classification_id?: string;
  is_read_only?: boolean;
  classification_name?: string;
  default_priority?: number;
  description?: string;
};

export type ElementClassificationCbx = {
  classification_id: string;
  classification_name: string;
  default_priority: number;
};
