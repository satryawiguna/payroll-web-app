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
  SecondaryButton
} from 'app/core/components';
import {ContentTitle} from 'app/core/layouts';
import {lovLabel} from 'app/modules/master';
import {showToast} from 'app/utils';
import {BOT, COMPONENT_NAME} from 'config';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Subscription} from 'rxjs';
import {ElementClassificationCbx} from '../../models/element-classification';
import {BalanceFeed, BalanceFeedType, PayrollBalance} from '../../models/payroll-balance';
import {PayrollElementCbx} from '../../models/payroll-element';
import {ElementClassificationSvc} from '../../services/element-classification-svc';
import {PayrollBalanceSvc} from '../../services/payroll-balance-svc';
import {PayrollElementSvc} from '../../services/payroll-element-svc';
import {PayrollBalanceFeedForm} from './payroll-balance-feed-form';
import {PayrollBalanceForm} from './payroll-balance-form';

type PayrollBalanceEditorProps = RouteComponentProps & {
  action?: string;
  balanceId?: string;
};

type Subscriptions = {
  item?: Subscription;
  balanceFeed?: Subscription;
  classification?: Subscription;
  element?: Subscription;
};

export const PayrollBalanceEditor = ({action, balanceId, ...props}: PayrollBalanceEditorProps) => {
  const ctx = useContext(AlertDialogContext);

  const [item, setItem] = useState<PayrollBalance>();
  const [feeds, setFeeds] = useState<BalanceFeed[]>([]);
  const [feedType, setFeedType] = useState<BalanceFeedType>();
  const [classifications, setClassifications] = useState<ElementClassificationCbx[]>([]);
  const [elements, setElements] = useState<PayrollElementCbx[]>([]);

  const {t} = useTranslation('payroll');

  const formRef = useRef<EditFormRef<PayrollBalance>>(null);
  const dialogRef = useRef<EditDialogRef<PayrollBalance>>(null);
  const sub$ = useRef<Subscriptions>({});

  useEffect(() => {
    sub$.current.classification = ElementClassificationSvc.listCbx().subscribe(res => setClassifications(res));
    sub$.current.element = PayrollElementSvc.listCbx().subscribe(res => setElements(res ?? []));
    return () => {
      for (const [, s] of Object.entries(sub$.current)) s?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (balanceId) {
      const effective = (props.location?.state as any)?.effective;
      getItem(balanceId, effective).then(item => {
        setItem(item);
        setFeedType(item?.balance_feed_type);
        setFeeds(item?.feeds ?? []);
      });
    }
  }, [balanceId]);

  function getItem(balanceId: string, effective?: Date): Promise<PayrollBalance | undefined> {
    return new Promise(resolve => {
      sub$.current.item?.unsubscribe();
      sub$.current.item = PayrollBalanceSvc.getOne(balanceId, {effective}).subscribe(res => resolve(res));
    });
  }

  async function handleInsert() {
    const data = await formRef.current?.submit?.() as PayrollBalance;
    if (data == null) return;

    data.feeds = feeds.map(d => ({
      effective_start: d.effective_start,
      effective_end: d.effective_end,
      classification_id: d.classification_id,
      element_id: d.element_id,
      add_subtract: d.add_subtract,
    }));
    if (!await validateInsert(data)) return;

    PayrollBalanceSvc.insert(data).subscribe(() => {
      showToast(t('common:message.insert-success'));
      props.navigate?.('..');
    });
  }

  async function validateInsert(data: PayrollBalance): Promise<boolean> {
    if (!data.feeds?.length) {
      await ctx.alertInvalid({message: t('common:message.cant-empty', {item: t('header.balance-feed')})});
      return false;
    }
    return true;
  }

  async function handleUpdate() {
    const [cont, data] = await dialogRef.current?.open(item) ?? [false, undefined];
    if (!cont) return;

    setItem({...item, ...data!});
    setFeedType(data!.balance_feed_type);

    PayrollBalanceSvc.update(balanceId!, data!).subscribe(() => {
      showToast(t('common:message.update-success'));
    });
  }

  async function handleDetailHistoryChange(effective: Date | undefined, item: BalanceFeed, index: number) {
    sub$.current.balanceFeed?.unsubscribe();
    sub$.current.balanceFeed = PayrollBalanceSvc.getOneBalanceFeed(item.feed_id!, {effective}).subscribe(res => {
      if (res == null) return;
      setFeeds(feeds.map((d, i) => (i === index) ? res : d));
    });
  }

  async function validateDetail(item: BalanceFeed | undefined, data: BalanceFeed, options?: Record<string, any>)
    : Promise<[boolean, Record<string, any> | undefined]> {

    const existingIds = options?.existingIds ?? [];
    if (existingIds.includes(feedType === 'C' ? data.classification_id : data.element_id)) {
      const label = feedType === 'C'
        ? classifications?.find(d => d.classification_id === data.classification_id)?.classification_name
        : elements?.find(d => d.element_id === data.element_id)?.element_name;

      await ctx.alertInvalid({message: t('common:message.already-defined', {item: label})});
      return [false, undefined];
    }
    if (item?.feed_id) {
      return await ctx.confirmChangeInsert(item?.effective_start, data.effective_start);
    }
    return [true, undefined];
  }

  async function insertDetail(data: BalanceFeed) {
    const cl = (feedType === 'C') ? classifications.find(d => d.classification_id === data.classification_id) : undefined;
    const el = (feedType === 'E') ? elements.find(d => d.element_name === data.element_id) : undefined;
    const newItem: BalanceFeed = {...data,
      classification_name: cl?.classification_name,
      element_name: el?.element_name
    };
    setFeeds([...feeds, newItem]);

    if (balanceId) {
      PayrollBalanceSvc.insertBalanceFeed(balanceId, data).subscribe(res => {
        showToast(t('common:message.insert-success'));
        newItem.feed_id = res.new_id;
        setFeeds([...feeds, newItem]);
      });
    }
  }

  async function updateDetail(item: BalanceFeed, index: number, data: BalanceFeed, addtl?: Record<string, any>) {
    const cl = (feedType === 'C') ? classifications.find(d => d.classification_id === data.classification_id) : undefined;
    const el = (feedType === 'E') ? elements.find(d => d.element_id === data.element_id) : undefined;
    const updated: BalanceFeed = {...item, ...data,
      classification_name: cl?.classification_name,
      element_name: el?.element_name
    };
    setFeeds(feeds.map((d, i) => (i === index) ? updated : d));

    if (balanceId) {
      const params = {...addtl, effective: item?.effective_start ?? BOT};
      PayrollBalanceSvc.updateBalanceFeed(item.feed_id!, data, params).subscribe(() => {
        showToast(t('common:message.update-success'));
      });
    }
  }

  async function deleteDetail(item: BalanceFeed, index: number) {
    const confirm = await ctx.confirmDelete({
      i18nMessage: balanceId ? 'message.confirm-permanent-delete' : 'message.confirm-delete',
      params: {item: (feedType === 'C' ? item.classification_name : item.element_name)}
    });
    if (!confirm) return;

    setFeeds(feeds.filter((_, i) => i !== index));
    if (balanceId) {
      PayrollBalanceSvc.deleteBalanceFeed(item.feed_id!).subscribe(() => (
        showToast(t('common:message.delete-success'))
      ));
    }
  }

  function goBack() {
    props.navigate?.('/compensation-admin/payroll-balance');
  }

  return (
    <article>
      <ContentTitle title={[
        {label: t('header.payroll-balance'), url: '/compensation-admin/payroll-balance'},
        {label: t('common:title.' + action)}
      ]} />

      <section className="content content-form">
        {item?.is_read_only && <div className="alert alert-warning">{t('common:message.item-is-read-only')}</div>}

        <form noValidate className="form-payroll-balance" onSubmit={async e => {e.preventDefault(); await handleInsert();}}>

          {/* == Basic Details == */}
          <div className="form-title">
            <h1>{t('common:title.basic-details')}</h1>
            {balanceId &&
              <div className="form-title-actions">
                {action !== 'view' && <SecondaryButton role="edit" onClick={handleUpdate}>{t('common:button.edit')}</SecondaryButton>}
              </div>
            }
          </div>

          <PayrollBalanceForm
            ref={formRef}
            item={item}
            readOnly={balanceId != null}
            feedTypeChange={e => setFeedType(e.target.value)}
            feedTypeIsDisabled={Boolean(feeds.length)}
          />

          <EditDialog
            ref={dialogRef}
            title={t('header.payroll-balance')}
            content={item => (
              <PayrollBalanceForm item={item} feedTypeIsDisabled={Boolean(feeds.length)} />
            )}
          />

          {/* == Formula Result == */}
          <FormDetailList
            name={COMPONENT_NAME.PAYROLL_BALANCE_FEED}
            title={t('header.balance-feeds')}
            formTitle={t('header.balance-feed')}
            addButtonLabel={t('button.add-feed')}
            addButtonDisabled={feedType == null}
            readOnly={item?.is_read_only}

            getUniqueId={d => (feedType === 'C') ? d?.classification_id : d?.element_id}
            columnId="feed_id"
            columns={[
              (feedType === 'C') ? {name: 'classification_name', label: t('label.classification')} : undefined,
              (feedType === 'E') ? {name: 'element_name', label: t('label.element')} : undefined,
              {name: 'add_subtract', label: t('label.add-subtract'), content: (item, value) => lovLabel('ADD_SUBTRACT', value)},
              {name: 'effective_start', type: 'date', label: t('common:label.effective-start')},
              {name: 'effective_end', type: 'date', label: t('common:label.effective-end')},
            ]}
            items={feeds}
            withHistory={balanceId != null}
            onHistoryChange={handleDetailHistoryChange}
            beforeSubmit={validateDetail}
            onInsert={insertDetail}
            onUpdate={updateDetail}
            onDelete={deleteDetail}

            dialogContent={(item) => (
              <PayrollBalanceFeedForm feedType={feedType} item={item} classifications={classifications} elements={elements} />
            )}
          />

          <div className="form-actions">
            <SecondaryButton onClick={goBack}>{t('common:button.back')}</SecondaryButton>
            {!balanceId && <Button type="submit" role="save">{t('common:button.save')}</Button>}
          </div>
        </form>
      </section>

    </article>
  );
};
