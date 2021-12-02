/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {RouteComponentProps} from '@reach/router';
import {Button, DataTable, DataTableRef} from 'app/core/components';
import {ContentTitle} from 'app/core/layouts';
import {FilterCriteria, SearchOptionList} from 'app/core/models';
import {TableAction, TableLink} from 'app/modules/common';
import {DepartmentSvc, GradeSvc, LocationSvc, OfficeSvc, PositionSvc, ProjectSvc} from 'app/modules/work-structure';
import {BOT, COMPONENT_NAME} from 'config';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Subscription} from 'rxjs';
import {showToast} from '../../../../utils';
import {LOV, lovLabel} from '../../../master';
import {ElementLink} from '../../models/element-link';
import {ElementLinkSvc} from '../../services/element-link-svc';
import {PayrollElementSvc} from '../../services/payroll-element-svc';
import {PayrollGroupSvc} from '../../services/payroll-group-svc';

type Subscriptions = {
  history?: Subscription;
  element?: Subscription;
  office?: Subscription;
  location?: Subscription;
  department?: Subscription;
  project?: Subscription;
  position?: Subscription;
  grade?: Subscription;
  payGroup?: Subscription;
};

export const ElementLinkPage = (props: RouteComponentProps) => {

  const [elements, setElements] = useState<SearchOptionList[]>([]);
  const [offices, setOffices] = useState<SearchOptionList[]>([]);
  const [locations, setLocations] = useState<SearchOptionList[]>([]);
  const [departments, setDepartments] = useState<SearchOptionList[]>([]);
  const [projects, setProjects] = useState<SearchOptionList[]>([]);
  const [positions, setPositions] = useState<SearchOptionList[]>([]);
  const [grades, setGrades] = useState<SearchOptionList[]>([]);
  const [payrollGroups, setPayrollGroups] = useState<SearchOptionList[]>([]);

  const {t} = useTranslation('payroll');
  const tableRef = useRef<DataTableRef<ElementLink>>(null);
  const filtersRef = useRef<{searchText: string|undefined, filters: FilterCriteria[]}>();
  const sub$ = useRef<Subscriptions>({});

  useEffect(() => {
    sub$.current.element = PayrollElementSvc.listIdLabel().subscribe(res => setElements(res));
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

  function handleHistoryChange(effective: Date | undefined, item: ElementLink, index: number) {
    sub$.current.history?.unsubscribe();
    sub$.current.history = ElementLinkSvc.getOne(item.link_id!, {effective}).subscribe(res => {
      if (res != null) tableRef.current?.replaceItem(index, res);
    });
  }

  function handleAdd() {
    const state: Record<string, any> = {};
    filtersRef.current?.filters?.forEach(filter => {
      if (filter.value) state[filter.field] = filter.value;
    });
    props.navigate?.('add', {state: state});
  }

  function handleUpdate(item: ElementLink, segment: string) {
    props.navigate?.(`${segment}/${item.link_id}`, {state: {effective: item.effective_start ?? BOT}});
  }

  function deleteItem(confirm: boolean, item: ElementLink) {
    if (!confirm) return;
    ElementLinkSvc.delete(item.link_id!).subscribe(() => {
      showToast(t('common:message.delete-success'));
      tableRef.current?.refresh();
    });
  }

  return (
    <article>
      <ContentTitle
        title={[{label: t('header.element-link')}]}
        actions={<Button role="add" onClick={handleAdd}>{t('common:button.add')}</Button>}
      />

      <section className="content content-list">
        <DataTable
          name={COMPONENT_NAME.ELEMENT_LINK}
          ref={tableRef}
          filterChange={(searchText, filters) => filtersRef.current = {searchText, filters}}
          fetchData={criteria => ElementLinkSvc.getPage(criteria)}
          columns={[
            {name: 'element_name', label: t('label.element-name'),
              content: (item, value) => (
                <TableLink content={value} itemIsReadOnly={item.is_read_only} onClick={segment => handleUpdate(item, segment)} />
              )},
            {name: 'classification_name', label: t('label.classification-name')},
            {name: 'office_name', label: t('master:label.office'), content: (item, value) => value ?? '-' + t('common:label.all') + '-'},
            {name: 'location_name', label: t('master:label.location'), content: (item, value) => value ?? '-' + t('common:label.all') + '-'},
            {name: 'department_name', label: t('master:label.department'), content: (item, value) => value ?? '-' + t('common:label.all') + '-'},
            {name: 'project_name', label: t('master:label.project'), content: (item, value) => value ?? '-' + t('common:label.all') + '-'},
            {name: 'position_name', label: t('master:label.position'), content: (item, value) => value ?? '-' + t('common:label.all') + '-'},
            {name: 'grade_name', label: t('master:label.grade'), content: (item, value) => value ?? '-' + t('common:label.all') + '-'},
            {name: 'pay_group_name', label: t('label.payroll-group'), content: (item, value) => value ?? '-' + t('common:label.all') + '-'},
            {name: 'people_group', label: t('master:label.people-group'), content: (item, value) => lovLabel('PEOPLE_GROUP', value) ?? '-' + t('common:label.all') + '-'},
            {name: 'employee_category', label: t('master:label.employee-category'), content: (item, value) => lovLabel('EMPLOYEE_CATEGORY', value) ?? '-' + t('common:label.all') + '-'},
            {name: 'effective_start', type: 'date', label: t('common:label.effective-start'), className: 'text-center'},
            {name: 'effective_end', type: 'date', label: t('common:label.effective-end'), className: 'text-center'},
            {name: 'description', label: t('common:label.description')},
          ]}
          searchOptions={[
            {name: 'element_id', placement: 'before', label: t('label.element'), options: elements, className: 'input-sm'},
            {name: 'department_id', placement: 'after', label: t('master:label.department'), options: departments},
            {name: 'project_id', placement: 'after', label: t('master:label.project'), options: projects},
            {name: 'office_id', placement: 'after', label: t('master:label.office'), options: offices},
            {name: 'location_id', placement: 'after', label: t('master:label.location'), options: locations},
            {name: 'position_id', placement: 'after', label: t('master:label.position'), options: positions},
            {name: 'grade_id', placement: 'after', label: t('master:label.grade'), options: grades},
            {name: 'pay_group_id', placement: 'after', label: t('label.payroll-group'), options: payrollGroups},
            {name: 'people_group', placement: 'after', label: t('master:label.people-group'), options: PEOPLE_GROUPS},
            {name: 'employee_category', placement: 'after', label: t('master:label.employee-category'), options: EMPLOYEE_CATEGORY},
          ]}
          sorts={['processing_priority', 'element_code']}
          actions={(item, index) => (
            <TableAction
              confirmLabel={item.element_name} readOnly={item.is_read_only}
              onEdit={segment => handleUpdate(item, segment)} onDelete={confirm => deleteItem(confirm, item)}
              history={{
                name: COMPONENT_NAME.ELEMENT_LINK,
                id: item.link_id,
                onClick: effective => handleHistoryChange(effective, item, index),
              }}
            />
          )}
        />
      </section>
    </article>
  );
};
