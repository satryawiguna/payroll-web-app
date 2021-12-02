/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import {EditFormRef, FormControl, InputNumber, InputText} from 'app/core/components';
import React, {forwardRef, Ref, useEffect, useImperativeHandle, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {ElementClassification} from '../../models/element-classification';

export type ElementClassificationProps = {
  item?: ElementClassification;
  readOnly?: boolean;
};

export const ElementClassificationForm = forwardRef((
  {item, ...props}: ElementClassificationProps, ref: Ref<EditFormRef<ElementClassification>>
) => {
  const form = useForm<ElementClassification>({mode: 'onTouched'});
  const [readOnly, setReadOnly] = useState(props.readOnly);
  const {t} = useTranslation('payroll');

  useImperativeHandle(ref, () => ({
    submit: submit,
    setReadOnly: (value) => setReadOnly(value ?? true),
  }));

  useEffect(() => setFormValue(item), [item]);

  function setFormValue(item: ElementClassification | undefined) {
    if (item == null) return;
    form.setValue('classification_name', item.classification_name);
    form.setValue('default_priority', item.default_priority);
    form.setValue('description', item.description);
  }

  function validate(): Promise<boolean> {
    return form.trigger();
  }

  function formValue(): ElementClassification {
    const item = form.getValues();
    return {
      classification_name: item.classification_name,
      default_priority: item.default_priority,
      description: item.description,
    };
  }

  async function submit(): Promise<ElementClassification | undefined> {
    const valid = await validate();
    return valid ? formValue() : undefined;
  }

  return (<>
    {readOnly && <div className="alert alert-warning">{t('common:message.item-is-read-only')}</div>}

    <div className="form-item">
      <FormControl
        name="classification_name" control={form.control} state={form.formState} label={t('label.classification-name')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputText {...props} className="input-lg" />
        )}
      />
      <FormControl
        name="default_priority" control={form.control} state={form.formState} label={t('label.default-priority')}
        readOnly={readOnly} rules={{required: true}}
        render={props => (
          <InputNumber {...props} thousandSeparator={false} className="input-xs" />
        )}
      />
      <FormControl
        name="description" control={form.control} state={form.formState} label={t('common:label.description')}
        readOnly={readOnly}
        render={props => (
          <InputText {...props} className="input-lg" />
        )}
      />
    </div>
  </>);
});
