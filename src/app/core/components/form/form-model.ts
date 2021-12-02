/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

export type EditFormRef<T> = {
  submit?: () => Promise<T | undefined>;
  setReadOnly?: (readOnly?: boolean) => void;
  isModified?: () => boolean;
};
