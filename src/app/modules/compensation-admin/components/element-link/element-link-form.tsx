/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {Divider} from '@material-ui/core';
import {
  EditFormRef,
  FormControl,
  FormControlRenderProps,
  InputChangeEvent,
  InputSelect,
  InputText
} from 'app/core/components';
import {DepartmentCbx, GradeCbx, LocationCbx, OfficeCbx, PositionCbx, ProjectCbx} from 'app/modules/work-structure';
import React, {forwardRef, Ref, useEffect, useImperativeHandle, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {LovItem, lovLabel} from '../../../master';
import {ElementLink} from '../../models/element-link';
import {PayrollElementCbx} from '../../models/payroll-element';
import {PayrollFormula} from '../../models/payroll-formula';
import {PayrollGroupCbx} from '../../models/payroll-group';
import './element-link-editor.scss';

export type ElementLinkProps = {
  item?: ElementLink;
  readOnly?: boolean;

  elements: PayrollElementCbx[];
  offices: OfficeCbx[];
  locations: LocationCbx[];
  departments: DepartmentCbx[];
  projects: ProjectCbx[];
  positions: PositionCbx[];
  grades: GradeCbx[];
  payrollGroups: PayrollGroupCbx[];
  peopleGroup: LovItem[];
  employeeCategory: LovItem[];

  onElementChange?: (element?: PayrollElementCbx) => void;
  elementIsDisabled?: boolean;
  wide?: boolean;
};

export const ElementLinkForm = forwardRef((
  {item, elements, offices, locations, departments, projects, positions, grades, payrollGroups, peopleGroup, employeeCategory,
   onElementChange, elementIsDisabled, ...props}: ElementLinkProps,
  ref: Ref<EditFormRef<ElementLink>>
) => {
  const form = useForm<ElementLink>({mode: 'onTouched'});
  const [readOnly, setReadOnly] = useState(props.readOnly);

  const {t} = useTranslation('payroll');

  useImperativeHandle(ref, () => ({
    submit: submit,
    setReadOnly: (value) => setReadOnly(value ?? true),
  }));

  useEffect(() => setFormValue(item), [item]);

  function setFormValue(item: ElementLink | undefined) {
    if (item == null) return;
    form.setValue('effective_start', item?.effective_start);
    form.setValue('effective_end', item?.effective_end);
    form.setValue('element_id', item?.element_id);
    form.setValue('classification_name', item?.classification_name);

    form.setValue('office_id', item?.office_id);
    form.setValue('location_id', item?.location_id);
    form.setValue('department_id', item?.department_id);
    form.setValue('project_id', item?.project_id);
    form.setValue('position_id', item?.position_id);
    form.setValue('grade_id', item?.grade_id);
    form.setValue('pay_group_id', item?.pay_group_id);
    form.setValue('people_group', item?.people_group);
    form.setValue('employee_category', item?.employee_category);

    form.setValue('description', item?.description);
  }

  function handleElementChange(props: FormControlRenderProps<ElementLink>, event: InputChangeEvent<ElementLink>) {
    props.onChange(event);
    const elementId = event.target.value;
    const el = elementId ? elements.find(d => d.element_id === elementId) : undefined;
    onElementChange?.(el);
    form.setValue('classification_name', el?.classification_name);
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): ElementLink {
    const item = form.getValues();
    return {
      effective_start: item.effective_start,
      effective_end: item.effective_end,
      element_id: item.element_id,

      office_id: item.office_id,
      location_id: item.location_id,
      department_id: item.department_id,
      project_id: item.project_id,
      position_id: item.position_id,
      grade_id: item.grade_id,
      pay_group_id: item.pay_group_id,
      people_group: item.people_group,
      employee_category: item.employee_category,

      description: item.description,
    };
  }

  async function submit(): Promise<PayrollFormula | undefined> {
    const valid = await validate();
    return valid ? formValue() : undefined;
  }

  return (
    <div className={`form-item ${props.wide == null || props.wide ? 'wide' : ''}`}>
      <FormControl
        name="element_id" control={form.control} state={form.formState} label={t('label.element')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputSelect {...props} options={elements} getOptionKey={d => d.element_id} getOptionLabel={d => d.element_name}
                       readOnlyValue={item?.element_name} disabled={!props.readOnly && elementIsDisabled}
                       className="input-lg" onChange={e => handleElementChange(props, e)} />
        )}
      />
      <FormControl
        name="classification_name" control={form.control} state={form.formState} label={t('label.classification')}
        readOnly={readOnly}
        render={props => (
          <InputText {...props} disabled={!props.readOnly} />
        )}
      />

      <div className="form-subtitle divider"><h2>{t('common:title.eligible-criteria')}</h2></div>

      <FormControl
        name="department_id" control={form.control} state={form.formState} label={t('master:label.department')}
        readOnly={readOnly}
        render={props => (
          <InputSelect {...props} options={departments} getOptionKey={d => d.department_id} getOptionLabel={d => d.department_name}
                       readOnlyValue={item?.department_name} className="input-lg" />
        )}
      />
      <FormControl
        name="project_id" control={form.control} state={form.formState} label={t('master:label.project')}
        readOnly={readOnly}
        render={props => (
          <InputSelect {...props} options={projects} getOptionKey={d => d.project_id} getOptionLabel={d => d.project_name}
                       readOnlyValue={item?.project_name} className="input-lg" />
        )}
      />
      <FormControl
        name="office_id" control={form.control} state={form.formState} label={t('master:label.office')}
        readOnly={readOnly}
        render={props => (
          <InputSelect {...props} options={offices} getOptionKey={d => d.office_id} getOptionLabel={d => d.office_name}
                       readOnlyValue={item?.office_name} className="input-lg" />
        )}
      />
      <FormControl
        name="location_id" control={form.control} state={form.formState} label={t('master:label.location')}
        readOnly={readOnly}
        render={props => (
          <InputSelect {...props} options={locations} getOptionKey={d => d.location_id} getOptionLabel={d => d.location_name}
                       readOnlyValue={item?.location_name} className="input-lg" />
        )}
      />
      <FormControl
        name="position_id" control={form.control} state={form.formState} label={t('master:label.position')}
        readOnly={readOnly}
        render={props => (
          <InputSelect {...props} options={positions} getOptionKey={d => d.position_id} getOptionLabel={d => d.position_name}
                       readOnlyValue={item?.position_name} className="input-lg" />
        )}
      />
      <FormControl
        name="grade_id" control={form.control} state={form.formState} label={t('master:label.grade')}
        readOnly={readOnly}
        render={props => (
          <InputSelect {...props} options={grades} getOptionKey={d => d.grade_id} getOptionLabel={d => d.grade_name}
                       readOnlyValue={item?.grade_name} className="input-lg" />
        )}
      />
      <FormControl
        name="payroll_group_id" control={form.control} state={form.formState} label={t('label.payroll-group')}
        readOnly={readOnly}
        render={props => (
          <InputSelect {...props} options={payrollGroups} getOptionKey={d => d.pay_group_id} getOptionLabel={d => d.pay_group_name}
                       readOnlyValue={item?.pay_group_name} className="input-lg" />
        )}
      />
      <FormControl
        name="people_group" control={form.control} state={form.formState} label={t('master:label.people-group')}
        readOnly={readOnly}
        render={props => (
          <InputSelect {...props} options={peopleGroup} readOnlyValue={lovLabel('PEOPLE_GROUP', item?.people_group)}
                       className="input-lg" />
        )}
      />
      <FormControl
        name="employee_category" control={form.control} state={form.formState} label={t('master:label.employee-category')}
        readOnly={readOnly}
        render={props => (
          <InputSelect {...props} options={employeeCategory} readOnlyValue={lovLabel('EMPLOYEE_CATEGORY', item?.employee_category)}
                       className="input-lg" />
        )}
      />

      <Divider />

      <FormControl
        name="description" control={form.control} state={form.formState} label={t('common:label.description')}
        readOnly={readOnly}
        render={props => (
          <InputText {...props} className="input-lg" />
        )}
      />
    </div>
  );
});
