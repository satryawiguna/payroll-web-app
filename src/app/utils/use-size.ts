/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {RefObject, useEffect, useState} from 'react';

type Dimension = {width: number, height: number};

export function useSize(ref: RefObject<any>) {
  const [dimension, setDimension] = useState<Dimension>({width: 0, height: 0});

  useEffect(() => {
    function getDimension(): Dimension {
      return {
        width: ref.current?.offsetWidth,
        height: ref.current?.offsetHeight,
      };
    }

    function handleResize() {
      setDimension(getDimension());
    }

    if (ref.current != null) {
      setDimension(getDimension());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return dimension;
}
