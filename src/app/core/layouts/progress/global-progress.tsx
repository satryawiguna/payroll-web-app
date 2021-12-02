/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import React, {FC, useEffect, useState} from 'react';
import {RequestCounter} from '../../services';

export const GlobalProgress: FC = () => {
  const [value,  setValue] = useState(0);

  useEffect(() => {
    let progressIntv: NodeJS.Timeout;
    let n = 20.0;

    RequestCounter.Instance.setCountListener((count) => {
      if (count === 0) {
        n = 20.0;
        if (progressIntv != null) clearTimeout(progressIntv);
        setValue(100);
        setTimeout(() => setValue(0), 500);
        return;
      }
      if (count > 0 && n === 20.0) {
        progressing();
      }
    });

    function progressing() {
      if (progressIntv != null) clearTimeout(progressIntv);
      progressIntv = setInterval(() => {
        n = n - (n / 6);
        setValue((prev) => {
          const newValue = prev + n;
          if (newValue > 95) {
            clearInterval(progressIntv);
            n = 20;
            return 95;
          }
          return newValue;
        });
      }, 300);
    }
  }, []);

  return (
    <div className="global-progress">
      <div className="progress-bar" style={{visibility: (value > 0) ? 'visible' : 'hidden'}}>
        <div className="progress-value" style={{width: value + '%'}}>
          <div className="progress-value-inner" />
        </div>
      </div>
    </div>
  );
};
