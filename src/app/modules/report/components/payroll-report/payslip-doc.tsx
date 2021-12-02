/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import React, {useEffect, useRef, useState} from 'react';
import {Subscription} from 'rxjs';
import {PayslipData, PayslipGroup} from '../../models/payroll-report';
import {PayrollReportSvc} from '../../services/payroll-report-svc';
import './payslip-doc.scss';

export type PayslipDocProps = {
  employeeId: number;
  periodStart: Date;
  periodEnd: Date;
};

type Subscriptions = {
  item?: Subscription;
}

export const PayslipDoc = (props: PayslipDocProps) => {
  const [data, setData] = useState<PayslipData>();
  const sub$ = useRef<Subscriptions>({});

  useEffect(() => {
    return () => {
      for (const [, s] of Object.entries(sub$.current)) s?.unsubscribe();
    };
  });

  function refreshData(employeeId: number, periodStart: Date, periodEnd: Date) {
    sub$.current.item?.unsubscribe();
    sub$.current.item = PayrollReportSvc.perPayslip(employeeId, periodStart, periodEnd).subscribe(res => setData(res));
  }

  useEffect(() => {
    return refreshData(props.employeeId, props.periodStart, props.periodEnd);
  }, [props.employeeId, props.periodStart, props.periodEnd]);

  return (
    <div className="payslip">
      <div className="report-header">
        <h1>PT Maju Sejahtera</h1>
        <div>Jalan Raya No 42 Denpasar</div>
        <div>0361-1829311</div>
      </div>

      <div className="report-content">
        <div className="earnings">
          <PayslipDocDetail items={data?.earnings} />
        </div>
        <div className="deductions">
          <PayslipDocDetail items={data?.deductions} />
        </div>
        <div className="d-flex">
          <div className="flex-grow-1"><strong>Total Pendapatan</strong></div>
          <div className="text-right"><strong>100000</strong></div>
        </div>
        <div className="d-flex">
          <div className="flex-grow-1"><strong>Total Potongan</strong></div>
          <div className="text-right"><strong>100000</strong></div>
        </div>
      </div>

      <div className="mt-4">
        <div><strong>Take Home Pay: 100000000</strong></div>
        <div><strong>Terbilang: Seratus juta</strong></div>
      </div>

      <div className="report-footer">
        <div className="signer">
          <div>Direktur</div>
          <br /><br /><br />
          <div><strong>(Bos Besar)</strong></div>
        </div>
      </div>
    </div>
  );
};

const PayslipDocDetail = (props: {items?: PayslipGroup[]}) => {

  function getDivisionLabel(divisionType: string): string | null {
    if (divisionType == null) return null;
    switch (divisionType.toUpperCase()) {
      case 'DAY': return 'Hari';
      case 'HOUR': return 'Jam';
      case 'RATE': return '%';
      case 'COUNT': return '';
      case 'CHILD_COUNT': return 'Anak';
    }
    return null;
  }

  return (
    <table>
      <tbody>
      {props.items?.map((group, i) => [
        <tr key={'group-' + i}>
          <th colSpan={4}><div className="group-title">{group.group_name}</div></th>
        </tr>,
        ...group.items.map((item, j) => (
          <tr key={'item-' + j}>
            <td className="label" colSpan={item.division ? 1 : 3}>
              {item.label}{item.description ? <em>{` (${item.description})`}</em> : ''}
            </td>
            {item.division ? <td className="division">{item.division ?? ''}</td> : null}
            {item.division ? <td className="division-type">{getDivisionLabel(item.division_type) ?? ''}</td> : null}
            <td className="value">{item.pay_value}</td>
          </tr>
        )),
      ])}
      </tbody>
    </table>
  );
};
