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
import {FormLabel} from 'app/core/components/input/form-label';
import {lovLabel} from 'app/modules/master';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {PayrollPerEntry} from '../../models/payroll-entry';

export type PayrollEntryEmployeeFormProps = {
  item?: PayrollPerEntry;
}

export const PayrollEntryEmployeeForm = ({item}: PayrollEntryEmployeeFormProps) => {
  const {t} = useTranslation('master');

  return (
    <div className="form-item wide">
      <FormLabel readOnly label={t('label.employee')} value={[item?.employee_no, item?.employee_name, item?.gender_name]}
                 className={['input-xs input-fixed', 'input-full', 'input-xs input-fixed']} />
      <FormLabel readOnly label={t('label.phone-no')} value={item?.phone_no} className="input-md" />
      <FormLabel readOnly label={[t('label.marital-status'), t('label.child-count')]} value={[item?.marital_status, item?.child_count]} className="input-xs" />

      <Divider />

      <FormLabel readOnly label={t('label.department')} value={item?.department_name} className="input-lg" />
      <FormLabel readOnly label={t('label.project')} value={item?.project_name} className="input-lg" />
      <FormLabel readOnly label={t('label.office')} value={item?.office_name} className="input-lg" />
      <FormLabel readOnly label={t('label.location')} value={item?.location_name} className="input-lg" />
      <FormLabel readOnly label={t('label.position')} value={item?.position_name} className="input-lg" />
      <FormLabel readOnly label={t('label.grade')} value={item?.grade_name} className="input-lg" />
      <FormLabel readOnly label={t('payroll:label.payroll-group')} value={item?.pay_group_name} className="input-lg" />
      <FormLabel readOnly label={t('label.people-group')} value={lovLabel('PEOPLE_GROUP', item?.people_group)} className="input-lg" />
      <FormLabel readOnly label={t('label.employee-category')} value={lovLabel('EMPLOYEE_CATEGORY', item?.employee_category)} className="input-lg" />

    </div>
  );
};
