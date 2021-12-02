/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

export class LocalStorage {

  static get(key: string, fromSession: boolean = false): any | undefined {
    return this.getStorage(fromSession).getItem(key);
  }

  static getAsJson(key: string, fromSession: boolean = false): Record<string, any> | undefined {
    const value = this.getStorage(fromSession).getItem(key);
    if (!value) return undefined;
    try {
      return JSON.parse(value);
    } catch (e) {
      return undefined;
    }
  }

  static store(key: string, value: any, fromSession: boolean = false) {
    this.getStorage(fromSession).setItem(key, value);
  }

  private static getStorage(fromSession: boolean): Storage {
    return fromSession ? sessionStorage : localStorage;
  }
}
