/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import React from 'react';

export const Loading = (props: {message: string}) => {
  return (
    <div className="loading-container">
      <div className="loading-inner">
        <div className="loading-indicator" />
        {props.message}
      </div>
    </div>
  );
};
