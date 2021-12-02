/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Link, LinkProps} from '@reach/router';
import React, {PropsWithoutRef, RefAttributes} from 'react';

export type NavLinkProps = PropsWithoutRef<LinkProps<any>> & RefAttributes<HTMLAnchorElement>;

export const NavLink = (props: NavLinkProps) => (
  <Link {...props} getProps={({isPartiallyCurrent}) => {
    if (!isPartiallyCurrent) return {};
    return {className: props.className ? props.className + ' active' : 'active'};
  }} />
);
