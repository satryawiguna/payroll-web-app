/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

export class RequestCounter {
  private static _instance: RequestCounter;
  private count: number = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private listener?: (count: number) => void;

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  add() {
    this.count += 1;
    this.listener?.(this.count);
  }

  remove() {
    this.count -= 1;
    this.listener?.(this.count);
  }

  setCountListener(listener: (count: number) => void) {
    this.listener = listener;
  }
}
