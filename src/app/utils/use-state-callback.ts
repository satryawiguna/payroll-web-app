/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {SetStateAction, useCallback, useEffect, useRef, useState} from 'react';

type DispatchWithCallback<S> = (value: S, callback?: (value?: S) => void) => void;

export function useStateCallback<S>(initialState: S | (() => S)): [S, DispatchWithCallback<SetStateAction<S>>] {
  const [state, _setState] = useState(initialState);

  const callbackRef = useRef<(value?: S) => void>();
  const isFirstCall = useRef(true);

  const setState = useCallback((value: SetStateAction<S>, callback?: (value?: S) => void) => {
    callbackRef.current = callback;
    _setState(value);
  }, []);

  useEffect(() => {
    if (isFirstCall.current) {
      isFirstCall.current = false;
      return;
    }
    callbackRef.current?.(state);
  }, [state]);

  return [state, setState];
}
