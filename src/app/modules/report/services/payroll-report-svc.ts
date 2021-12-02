import {BaseService, Http} from 'app/core/services';
import {API_HOST} from 'config';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PayslipData} from '../models/payroll-report';

export class PayrollReportSvc extends BaseService {
  private static http: Http = new Http();

  static perPayslip(employeeId: number, periodStart: Date, periodEnd: Date): Observable<PayslipData | undefined> {
    const url = `${API_HOST}/api/v1/report/payslip/${employeeId}`;
    const params = {'period-start': periodStart, 'period-end': periodEnd};
    return this.http.get(url, params).pipe(map(res => this.jsonResponse(res)));
  }
}
