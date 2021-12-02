/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {PageData} from 'app/core/components';
import {List, ListItem} from 'app/core/components/list/list';
import {PageResponse, SearchCriteria, SearchOptionList} from 'app/core/models';
import {COMPONENT_NAME} from 'config';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Observable, Subscription} from 'rxjs';
import {PayrollGroupSvc} from '../../../compensation-admin';
import {LOV} from '../../../master';
import {DepartmentSvc, GradeSvc, LocationSvc, OfficeSvc, PositionSvc, ProjectSvc} from '../../../work-structure';
import {PayrollPerEntry} from '../../models/payroll-entry';
import {PayrollEntrySvc} from '../../services/payroll-entry-svc';

type PayrollEntryEmployeeListProps = {
  activeEmployeeId?: number;
  onItemClick?: (item: PayrollPerEntry, index: number) => void;
};

type Subscriptions = {
  history?: Subscription;
  office?: Subscription;
  location?: Subscription;
  department?: Subscription;
  project?: Subscription;
  position?: Subscription;
  grade?: Subscription;
  payGroup?: Subscription;
};

export const PayrollEntryEmployeeList = (props: PayrollEntryEmployeeListProps) => {

  const [offices, setOffices] = useState<SearchOptionList[]>([]);
  const [locations, setLocations] = useState<SearchOptionList[]>([]);
  const [departments, setDepartments] = useState<SearchOptionList[]>([]);
  const [projects, setProjects] = useState<SearchOptionList[]>([]);
  const [positions, setPositions] = useState<SearchOptionList[]>([]);
  const [grades, setGrades] = useState<SearchOptionList[]>([]);
  const [payrollGroups, setPayrollGroups] = useState<SearchOptionList[]>([]);

  const {t} = useTranslation('payroll');
  const sub$ = useRef<Subscriptions>({});

  useEffect(() => {
    sub$.current.office = OfficeSvc.listIdLabel().subscribe(res => setOffices(res));
    sub$.current.location = LocationSvc.listIdLabel().subscribe(res => setLocations(res));
    sub$.current.department = DepartmentSvc.listIdLabel().subscribe(res => setDepartments(res));
    sub$.current.project = ProjectSvc.listIdLabel().subscribe(res => setProjects(res));
    sub$.current.position = PositionSvc.listIdLabel().subscribe(res => setPositions(res));
    sub$.current.grade = GradeSvc.listIdLabel().subscribe(res => setGrades(res));
    sub$.current.payGroup = PayrollGroupSvc.listIdLabel().subscribe(res => setPayrollGroups(res));
    return () => {
      for (const [, s] of Object.entries(sub$.current)) s?.unsubscribe();
    };
  }, []);

  const PEOPLE_GROUPS = LOV.PEOPLE_GROUP;
  const EMPLOYEE_CATEGORY = LOV.EMPLOYEE_CATEGORY;

  function fetchData(criteria?: SearchCriteria): Observable<PageResponse<PayrollPerEntry>> {
    return PayrollEntrySvc.getEmployees(criteria, {includeEntries: false});
  }

  return (
    <PageData
      name={COMPONENT_NAME.PAYROLL_ENTRY}
      fetchData={fetchData}
      searchOptions={[
        {name: '_.nik', label: t('master:label.employee-no')},
        {name: '_.full_name', label: t('master:label.employee-name')},
        {name: 'pos.id', label: t('master:label.position'), options: positions},
        {name: 'dep.id', label: t('master:label.department'), options: departments},
        {name: 'prj.id', label: t('master:label.project'), options: projects},
        {name: 'ofc.id', label: t('master:label.office'), options: offices},
        {name: 'loc.id', label: t('master:label.location'), options: locations},
        {name: 'grd.id', label: t('master:label.grade'), options: grades},
        {name: '_.pay_group_id', label: t('label.payroll-group'), options: payrollGroups},
        {name: '_.people_group', label: t('master:label.people-group'), options: PEOPLE_GROUPS},
        {name: '_.employee_category', label: t('master:label.employee-category'), options: EMPLOYEE_CATEGORY},
      ]}
      sorts={['employee_no']}
      render={data => (
        <List className="tab-list mt-2 mb-2">
          {data.map((item, i) => (
            <ListItem
              key={i}
              label={item.employee_name}
              subLabel={item.employee_no + (item.position_name ? ' - ' : '') + (item.position_name ?? '')}
              active={props.activeEmployeeId === item.employee_id}
              onClick={() => props.onItemClick?.(item, i)}
            />
          ))}
        </List>
      )}
    />
  );
};
