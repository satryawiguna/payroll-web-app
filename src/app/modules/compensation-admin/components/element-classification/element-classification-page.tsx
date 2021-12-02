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
import {Button, DataTable, DataTableRef, EditDialog, EditDialogRef} from 'app/core/components';
import {ContentTitle} from 'app/core/layouts';
import {TableAction, TableLink} from 'app/modules/common';
import {showToast} from 'app/utils';
import {COMPONENT_NAME} from 'config';
import React, {useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {ElementClassification} from '../../models/element-classification';
import {ElementClassificationSvc} from '../../services/element-classification-svc';
import {ElementClassificationForm} from './element-classification-form';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ElementClassificationPage = (props: RouteComponentProps) => {
  const {t} = useTranslation('payroll');

  const tableRef = useRef<DataTableRef<ElementClassification>>(null);
  const dialogRef = useRef<EditDialogRef<ElementClassification>>(null);

  function handleInsert() {
    dialogRef.current?.open()?.then(([cont, data]) => {
      if (!cont) return;
      ElementClassificationSvc.insert(data!).subscribe(() => {
        showToast(t('common:message.insert-success'));
        tableRef.current?.refresh();
      });
    });
  }

  function handleUpdate(item: ElementClassification, index: number) {
    dialogRef.current?.open(item, {readOnly: item.is_read_only})?.then(([cont, data]) => {
      if (!cont) return;
      ElementClassificationSvc.update(item.classification_id!, data!).subscribe(() => {
        showToast(t('common:message.update-success'));
        tableRef.current?.replaceItem(index, {...item, ...data});
      });
    });
  }

  function deleteItem(confirm: boolean, item: ElementClassification) {
    if (!confirm) return;
    ElementClassificationSvc.delete(item.classification_id!).subscribe(() => {
      showToast(t('common:message.delete-success'));
      tableRef.current?.refresh();
    });
  }

  return (
    <article>
      <ContentTitle
        title={[{label: t('header.element-classification')}]}
        actions={<Button role="add" onClick={handleInsert}>{t('common:button.add')}</Button>}
      />

      <section className="content content-list">
        <DataTable
          name={COMPONENT_NAME.ELEMENT_CLASSIFICATION}
          ref={tableRef}
          fetchData={criteria => ElementClassificationSvc.getPage(criteria)}
          columns={[
            {name: 'classification_name', label: t('label.classification-name'),
              content: (item, value, index) => (
                <TableLink content={value} itemIsReadOnly={item.is_read_only} onClick={() => handleUpdate(item, index)} />
              )},
            {name: 'default_priority', type: 'number', label: t('label.default-priority'), className: 'text-center'},
            {name: 'description', label: t('common:label.description')},
          ]}
          sorts={['default_priority']}
          actions={(item, index) => (
            <TableAction confirmLabel={item.classification_name} readOnly={item.is_read_only}
                         onEdit={() => handleUpdate(item, index)} onDelete={confirm => deleteItem(confirm, item)} />
          )}
        />
      </section>

      <EditDialog
        ref={dialogRef}
        title={t('header.element-classification')}
        content={item => <ElementClassificationForm item={item} />}
      />
    </article>
  );
};
