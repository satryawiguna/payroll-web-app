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
import {
  AlertDialogContext,
  Button,
  EditDialog,
  EditDialogRef,
  EditFormRef,
  FormDetailList,
  SecondaryButton,
  TrackingHistory
} from 'app/core/components';
import {ContentTitle} from 'app/core/layouts';
import {
  DepartmentCbx,
  DepartmentSvc,
  GradeCbx,
  GradeSvc,
  LocationCbx,
  LocationSvc,
  OfficeCbx,
  OfficeSvc,
  PositionCbx,
  PositionSvc,
  ProjectCbx,
  ProjectSvc
} from 'app/modules/work-structure';
import {showToast} from 'app/utils';
import {BOT, COMPONENT_NAME} from 'config';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Subscription} from 'rxjs';
import {LOV} from '../../../master';
import {ElementLink, LinkValue} from '../../models/element-link';
import {PayrollElement, PayrollElementCbx} from '../../models/payroll-element';
import {PayrollGroupCbx} from '../../models/payroll-group';
import {ElementLinkSvc} from '../../services/element-link-svc';
import {PayrollElementSvc} from '../../services/payroll-element-svc';
import {PayrollGroupSvc} from '../../services/payroll-group-svc';
import {ElementLinkForm} from './element-link-form';
import {ElementLinkValueForm} from './element-link-value-form';

type ElementLinkEditorProps = RouteComponentProps & {
  action?: string;
  linkId?: string;
};

type Subscriptions = {
  item?: Subscription;
  linkValue?: Subscription;
  element?: Subscription;
  office?: Subscription;
  location?: Subscription;
  department?: Subscription;
  project?: Subscription;
  position?: Subscription;
  grade?: Subscription;
  payGroup?: Subscription;
};

export const ElementLinkEditor = ({action, linkId, ...props}: ElementLinkEditorProps) => {
  const ctx = useContext(AlertDialogContext);

  const [item, setItem] = useState<ElementLink>();
  const [values, setValues] = useState<LinkValue[]>([]);

  const [elements, setElements] = useState<PayrollElementCbx[]>([]);
  const [offices, setOffices] = useState<OfficeCbx[]>([]);
  const [locations, setLocations] = useState<LocationCbx[]>([]);
  const [departments, setDepartments] = useState<DepartmentCbx[]>([]);
  const [projects, setProjects] = useState<ProjectCbx[]>([]);
  const [positions, setPositions] = useState<PositionCbx[]>([]);
  const [grades, setGrades] = useState<GradeCbx[]>([]);
  const [payrollGroups, setPayrollGroups] = useState<PayrollGroupCbx[]>([]);

  const {t} = useTranslation('payroll');

  const formRef = useRef<EditFormRef<ElementLink>>(null);
  const dialogRef = useRef<EditDialogRef<ElementLink>>(null);
  const sub$ = useRef<Subscriptions>({});

  useEffect(() => {
    sub$.current.element = PayrollElementSvc.listCbx({includeValues: true}).subscribe(res => {
      setElements(res);
      const stateElementId = (props.location?.state as any)?.element_id;
      if (linkId == null && stateElementId != null) {
        const el = res.find(d => d.element_id === stateElementId);
        if (el != null) setItem(prev => ({...prev, classification_name: el.classification_name}));
        handleElementChange(el);
      }
    });
    sub$.current.office = OfficeSvc.listCbx().subscribe(res => setOffices(res));
    sub$.current.location = LocationSvc.listCbx().subscribe(res => setLocations(res));
    sub$.current.department = DepartmentSvc.listCbx().subscribe(res => setDepartments(res));
    sub$.current.project = ProjectSvc.listCbx().subscribe(res => setProjects(res));
    sub$.current.position = PositionSvc.listCbx().subscribe(res => setPositions(res));
    sub$.current.grade = GradeSvc.listCbx().subscribe(res => setGrades(res));
    sub$.current.payGroup = PayrollGroupSvc.listCbx().subscribe(res => setPayrollGroups(res));
    return () => {
      for (const [, s] of Object.entries(sub$.current)) s?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const state = props.location?.state as any;
    const effective = state?.effective;
    if (linkId) {
      getItem(linkId, effective).then(item => {
        setItem(item);
        setValues(item?.values ?? []);
      });
    } else {
      const el = (state.element_id != null) ? elements.find(d => d.element_id === state.element_id) : undefined;
      handleElementChange(el);
      setItem(getItemFromState(state, el));
    }
  }, [linkId]);

  const PEOPLE_GROUPS = LOV.PEOPLE_GROUP;
  const EMPLOYEE_CATEGORY = LOV.EMPLOYEE_CATEGORY;

  function getItemFromState(state: any, element?: PayrollElement): ElementLink {
    return {
      element_id: state.element_id,
      element_name: element?.element_name,
      office_id: state.office_id,
      location_id: state.location_id,
      department_id: state.department_id,
      project_id: state.project_id,
      position_id: state.position_id,
      grade_id: state.grade_id,
      pay_group_id: state.pay_group_id,
      people_group: state.people_group,
      employee_category: state.employee_category,
    };
  }

  function getItem(linkId: string, effective?: Date): Promise<ElementLink | undefined> {
    return new Promise(resolve => {
      sub$.current.item?.unsubscribe();
      sub$.current.item = ElementLinkSvc.getOne(linkId, {effective}).subscribe(res => resolve(res));
    });
  }

  function handleHistoryChange(effective?: Date) {
    if (!linkId) return;
    getItem(linkId, effective).then(item => {
      setItem(item);
    });
  }

  async function handleInsert() {
    const data = await formRef.current?.submit?.() as ElementLink;
    if (data == null) return;

    data.values = values.filter(d => Boolean(d.link_value)).map(d => ({
      effective_start: d.effective_start,
      effective_end: d.effective_end,
      input_value_id: d.input_value_id,
      link_value: d.link_value,
      description: d.description,
    }));

    ElementLinkSvc.insert(data).subscribe(() => {
      showToast(t('common:message.insert-success'));
      props.navigate?.('..');
    });
  }

  async function beforeUpdate(item?: ElementLink, data?: ElementLink): Promise<[boolean, Record<string, any> | undefined]> {
    return await ctx.confirmChangeInsert(item?.effective_start, data?.effective_start);
  }

  async function handleUpdate() {
    const [cont, data, addtl] = await dialogRef.current?.open(item) ?? [false, undefined, undefined];
    if (!cont) return;

    const el = elements.find(d => d.element_id === data!.element_id);
    setItem({...item, ...data!,
      element_name: el?.element_name,
      classification_name: el?.classification_name,
      office_name: offices.find(d => d.office_id === data!.office_id)?.office_name,
      location_name: locations.find(d => d.location_id === data!.location_id)?.location_name,
      department_name: departments.find(d => d.department_id === data!.department_id)?.department_name,
      project_name: projects.find(d => d.project_id === data!.project_id)?.project_name,
      position_name: positions.find(d => d.position_id === data!.position_id)?.position_name,
      grade_name: grades.find(d => d.grade_id === data!.grade_id)?.grade_name,
      pay_group_name: payrollGroups.find(d => d.pay_group_id === data!.pay_group_id)?.pay_group_name,
    });

    const params = {...addtl, effective: item?.effective_start ?? BOT};
    ElementLinkSvc.update(linkId!, data!, params).subscribe(() => {
      showToast(t('common:message.update-success'));
    });
  }

  function handleElementChange(element?: PayrollElementCbx) {
    if (element == null) {
      setValues([]);
      return;
    }
    setValues(element?.values?.map(d => ({
      input_value_id: d.input_value_id,
      input_value_name: d.value_name,
      default_value: d.default_value,
    })) ?? []);
  }

  function handleValueHistoryChange(effective: Date | undefined, item: LinkValue, index: number) {
    sub$.current.linkValue?.unsubscribe();
    sub$.current.linkValue = ElementLinkSvc.getOneLinkValue(item.value_id!, {effective}).subscribe(res => {
      if (res == null) return;
      setValues(values.map((d, i) => (i === index) ? res : d));
    });
  }

  async function validateLinkValue(item: LinkValue | undefined, data: LinkValue)
    : Promise<[boolean, Record<string, any> | undefined]> {
    if (item?.value_id) {
      return await ctx.confirmChangeInsert(item?.effective_start, data.effective_start);
    }
    return [true, undefined];
  }

  function updateLinkValue(item: LinkValue, index: number, data: LinkValue, addtl?: Record<string, any>) {
    const updated = {...item, ...data};
    setValues(values.map((d, i) => (i === index) ? updated : d));

    if (linkId) {
      const params = {...addtl, effective: item?.effective_start ?? BOT};
      if (item.value_id != null) {
        ElementLinkSvc.updateLinkValue(item.value_id, data, params).subscribe(() => {
          showToast(t('common:message.update-success'));
        });
      } else {
        ElementLinkSvc.insertLinkValue(linkId, data).subscribe(res => {
          showToast(t('common:message.update-success'));
          updated.value_id = res.new_id;
          setValues(values.map((d, i) => (i === index) ? updated : d));
        });
      }
    }
  }

  async function deleteLinkValue(item: LinkValue) {
    const confirm = await ctx.confirmDelete({
      i18nMessage: linkId ? 'message.confirm-permanent-delete' : 'message.confirm-delete',
      params: {item: item.input_value_name}
    });
    if (!confirm) return;

    setValues(values.map(d => {
      if (d.input_value_id === item.input_value_id) {
        return {...d,
          value_id: undefined,
          effective_start: undefined,
          effective_end: undefined,
          link_value: undefined,
          description: undefined,
        };
      }
      return d;
    }));
    if (linkId) {
      ElementLinkSvc.deleteLinkValue(item.value_id!).subscribe(() => (
        showToast(t('common:message.delete-success'))
      ));
    }
  }

  function goBack() {
    props.navigate?.('/compensation-admin/element-link');
  }

  return (
    <article>
      <ContentTitle title={[
        {label: t('header.element-link'), url: '/compensation-admin/element-link'},
        {label: t('common:title.' + action)},
      ]} />

      <section className="content content-form">
        {item?.is_read_only && <div className="alert alert-warning">{t('common:message.item-is-read-only')}</div>}

        <form noValidate className="form-element-link" onSubmit={async e => {e.preventDefault(); await handleInsert();}}>

          {/* == Basic Details == */}
          <div className="form-title">
            <h1>{t('common:title.basic-details')}</h1>
            {linkId &&
              <div className="form-title-actions">
                <TrackingHistory name={COMPONENT_NAME.ELEMENT_LINK} id={linkId} onClick={handleHistoryChange} />
                {action !== 'view' && <SecondaryButton role="edit" onClick={handleUpdate}>{t('common:button.edit')}</SecondaryButton>}
              </div>
            }
          </div>

          <ElementLinkForm
            ref={formRef}
            item={item}
            elements={elements} offices={offices} locations={locations} departments={departments} projects={projects}
            positions={positions} grades={grades} payrollGroups={payrollGroups} peopleGroup={PEOPLE_GROUPS}
            employeeCategory={EMPLOYEE_CATEGORY}
            onElementChange={handleElementChange}
            readOnly={linkId != null}
          />

          <EditDialog
            ref={dialogRef}
            title={t('header.element-link')}
            className="dialog-lg dialog-element-link"
            beforeSubmit={beforeUpdate}
            content={item => (
              <ElementLinkForm
                elementIsDisabled
                item={item}
                elements={elements} offices={offices} locations={locations} departments={departments} projects={projects}
                positions={positions} grades={grades} payrollGroups={payrollGroups} peopleGroup={PEOPLE_GROUPS}
                employeeCategory={EMPLOYEE_CATEGORY}
              />
            )}
          />

          {/* == Link Values == */}
          <FormDetailList
            name={COMPONENT_NAME.ELEMENT_LINK_VALUE}
            title={t('common:title.values')}
            formTitle={t('common:title.value')}
            addButtonLabel={t('common:button.add-value')}
            readOnly={item?.is_read_only}

            columnId="value_id"
            columns={[
              {name: 'input_value_name', label: t('label.input-value')},
              {name: 'effective_start', type: 'date', label: t('common:label.effective-start')},
              {name: 'effective_end', type: 'date', label: t('common:label.effective-end')},
              {name: 'default_value', label: t('common:label.default-value')},
              {name: 'link_value', label: t('common:label.value')},
              {name: 'description', label: t('common:label.description')},
            ]}
            items={values}
            withHistory={linkId != null}
            onHistoryChange={handleValueHistoryChange}
            beforeSubmit={validateLinkValue}
            onUpdate={updateLinkValue}
            onDelete={deleteLinkValue}

            dialogContent={(item) => (
              <ElementLinkValueForm item={item} />
            )}
          />

          <div className="form-actions">
            <SecondaryButton onClick={goBack}>{t('common:button.back')}</SecondaryButton>
            {!linkId && <Button type="submit" role="save">{t('common:button.save')}</Button>}
          </div>
        </form>
      </section>
    </article>
  );
};
