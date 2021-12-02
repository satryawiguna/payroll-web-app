/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Checkbox} from '@material-ui/core';
import {RouteComponentProps} from '@reach/router';
import {DataTable, DataTableColumn, DataTableRef} from 'app/core/components';
import {PageResponse, SearchCriteria, SearchOptionList} from 'app/core/models';
import {COMPONENT_NAME} from 'config';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {ContentTitle} from '../../../../core/layouts';
import {TableLink} from '../../../common';
import {PayrollElementCbx, PayrollGroupSvc} from '../../../compensation-admin';
import {LOV} from '../../../master';
import {DepartmentSvc, GradeSvc, LocationSvc, OfficeSvc, PositionSvc, ProjectSvc} from '../../../work-structure';
import {PayrollEntryValue, PayrollPerEntry} from '../../models/payroll-entry';
import {PayrollProcessSvc} from '../../services/payroll-process-svc';

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

export const PayrollNewProcessPage = (props: RouteComponentProps) => {

  const [offices, setOffices] = useState<SearchOptionList[]>([]);
  const [locations, setLocations] = useState<SearchOptionList[]>([]);
  const [departments, setDepartments] = useState<SearchOptionList[]>([]);
  const [projects, setProjects] = useState<SearchOptionList[]>([]);
  const [positions, setPositions] = useState<SearchOptionList[]>([]);
  const [grades, setGrades] = useState<SearchOptionList[]>([]);
  const [payrollGroups, setPayrollGroups] = useState<SearchOptionList[]>([]);
  const [elements, setElements] = useState<PayrollElementCbx[]>([]);

  const {t} = useTranslation('payroll');
  const tableRef = useRef<DataTableRef<PayrollPerEntry>>(null);
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

  function fetchData(criteria?: SearchCriteria): Observable<PageResponse<Record<string, any>>> {
    return PayrollProcessSvc.getNewProcess(criteria).pipe(map(({elements, ...res}) => {
      setElements(elements ?? []);
      return {...res, rows: res.rows?.map(r => {
          const row = {...r} as Record<string, any>;
          elements?.forEach(el => {
            row['el-' + el.element_id] = r.entries?.find(d => d.element_id === el.element_id)?.values;
          });
          return row;
        }) ?? []};
    }));
  }

  function maritalStatus(item: PayrollPerEntry, value: string): string {
    let status = value?.substring(0, 1)?.toUpperCase();
    if (status == null) return '-';
    if (item.child_count) status += '/' + item.child_count;
    return status;
  }

  const columns: DataTableColumn<any>[] = [
    {name: 'employee_no', label: t('master:label.employee-no'),
      content: (item, value) => (
        <TableLink content={value} onClick={() => props.navigate?.(`employee/${item.employee_id}`)} />
      )},
    {name: 'employee_name', label: t('master:label.employee-name')},
    {name: 'position_name', label: t('master:label.position')},
    {name: 'marital_status', label: t('master:label.marital-status'), className: 'text-center text-wrap', content: maritalStatus},
  ];
  elements.forEach(el => {
    columns.push({
      name: 'el-' + el.element_id,
      className: 'text-center text-wrap',
      headerClass: ['col-vert no-border', ''],
      label: () => [
        <span key="lbl">{el.element_name}</span>,
        <Checkbox key="chk" className="check" />
      ],
      content: item => {
        const values = item['el-' + el.element_id] as PayrollEntryValue[];
        if (!values?.length) return '-';
        return <Checkbox />;
      }});
  });
  columns.push({name: '', content: () => ''}); // gap

  return (
    <article className="page-payroll-entry">
      <ContentTitle title={[
        {label: t('header.payroll-process'), url: '/payroll/payroll-process'},
        {label: t('header.new-process')},
      ]} />

      <section className="content content-form">
        <div className="form-title"><h1>{t('common:title.basic-details')}</h1></div>
        
      </section>

      <section className="content content-list">
        <DataTable
          name={COMPONENT_NAME.PAYROLL_ENTRY}
          ref={tableRef}
          fetchData={fetchData}
          columns={columns}
          checkable={true}
          searchOptions={[
            {name: '_.nik', label: t('master:label.employee-no')},
            {name: '_.full_name', label: t('master:label.employee-name')},
            {name: 'pos.id', label: t('master:label.position'), options: positions},
            {name: 'dep.id', placement: 'after', label: t('master:label.department'), options: departments},
            {name: 'prj.id', placement: 'after', label: t('master:label.project'), options: projects},
            {name: 'ofc.id', placement: 'after', label: t('master:label.office'), options: offices},
            {name: 'loc.id', placement: 'after', label: t('master:label.location'), options: locations},
            {name: 'grd.id', label: t('master:label.grade'), options: grades},
            {name: '_.pay_group_id', label: t('label.payroll-group'), options: payrollGroups},
            {name: '_.people_group', label: t('master:label.people-group'), options: PEOPLE_GROUPS},
            {name: '_.employee_category', label: t('master:label.employee-category'), options: EMPLOYEE_CATEGORY},
          ]}
          sorts={['employee_no']}
        />
      </section>
    </article>
  );
};
