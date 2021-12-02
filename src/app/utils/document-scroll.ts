/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import * as _ from 'lodash';
import {useEffect, useState} from 'react';

export function useThrottledDocumentScroll(cb: (prevScrollTop: number, currScrollTop: number, isScrollDown: boolean) => any) {
  const [, setScrollPosition] = useState(0);

  useEffect(() => {
    let prevScrollTop = 0;

    const throttledScroll = _.throttle(() => {
      const {scrollTop: currScrollTop} = document.documentElement ?? document.body;
      setScrollPosition(prevPos => {
        prevScrollTop = prevPos;
        return currScrollTop;
      });
      cb(prevScrollTop, currScrollTop, prevScrollTop < currScrollTop);
    }, 100);

    window.addEventListener('scroll', throttledScroll);
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [cb]);
}
