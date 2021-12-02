/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import i18next from 'i18next';
import i18n from 'i18next';

export type AlertVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

const VISIBLE_DURATION = 4000;
const POST_HOVER_VISIBLE_DURATION = 2000;
const FADE_DURATION = 500;

export function showToast(message: string, variant: AlertVariant = 'primary') {
  const item = createAlert(variant, message);
  document.getElementById('toast-container')?.appendChild(item);
  setTimeout(() => item.classList.add('visible'), 10);
}

export function showToastError(message: string, exceptionMessage?: string, trace?: string[]) {
  if (exceptionMessage != null) console.error(exceptionMessage);

  const item = createAlert('error', message, exceptionMessage, trace);
  document.getElementById('toast-container')?.appendChild(item);
  setTimeout(() => item.classList.add('visible'), 10);
}

function createAlert(variant: AlertVariant, message: string, exceptionMessage?: string,
                     trace?: string[]): HTMLElement {
  const options: {visibleDuration: number, hideIntervalId?: NodeJS.Timeout, fadeIntervalId?: NodeJS.Timeout} = {
    visibleDuration: VISIBLE_DURATION,
  };

  const item = createAlertItem(variant, message, exceptionMessage, trace);

  item.addEventListener('mouseover', resetHideInterval);
  item.addEventListener('mouseout', timeoutHide);
  timeoutHide();

  function resetHideInterval() {
    if (options.hideIntervalId) clearTimeout(options.hideIntervalId);
    if (options.fadeIntervalId) clearInterval(options.fadeIntervalId);
    options.visibleDuration = POST_HOVER_VISIBLE_DURATION;
    item.classList.remove('hiding');
  }

  function timeoutHide() {
    options.hideIntervalId = setTimeout(removingItem, options.visibleDuration);
  }

  function removingItem() {
    item.classList.remove('visible');
    options.fadeIntervalId = setTimeout(() => item.remove(), FADE_DURATION);
  }

  return item;
}

function createAlertItem(variant: AlertVariant, message: string, exceptionMessage?: string,
                         trace?: string[]) {
  const wrap = document.createElement('div');
  wrap.classList.add('alert-wrap');

  const item = document.createElement('div');

  item.setAttribute('role', 'alert');
  item.classList.add('alert');
  const alertClass = getAlertClass(variant);
  if (alertClass) item.classList.add(alertClass);

  item.appendChild(createMessage(message));

  if (exceptionMessage != null || (trace != null && trace.length)) {
    item.appendChild(createExceptionInfo(exceptionMessage, trace));
  }

  wrap.appendChild(item);
  return wrap;
}

function createMessage(message: string): HTMLElement {
  const item = document.createElement('div');
  item.classList.add('message');
  item.innerHTML = message;
  return item;
}

function createExceptionInfo(exceptionMessage?: string, traces?: string[]): HTMLElement {
  const item = document.createElement('details');
  item.classList.add('exception-info');

  const summary = document.createElement('summary');
  summary.textContent = i18n.t('common:label.details');
  item.appendChild(summary);

  const msg = exceptionMessage ? exceptionMessage : i18next.t('common:message.no-description');
  item.appendChild(createExceptionMessage(msg));

  if (traces && traces.length) {
    item.appendChild(createTrace(traces));
  }
  return item;
}

function createExceptionMessage(message: string): HTMLElement {
  const item = document.createElement('div');
  item.classList.add('exception-message');
  item.textContent = message;
  return item;
}

function createTrace(traces: string[]): HTMLElement {
  const wrap = document.createElement('details');
  wrap.classList.add('trace-wrap');

  const sum = document.createElement('summary');
  sum.textContent = i18n.t('common:label.trace');
  wrap.appendChild(sum);

  const ul = document.createElement('ul');
  ul.classList.add('trace');
  traces.forEach(trace => {
    const li = document.createElement('li');
    li.textContent = trace;
    ul.appendChild(li);
  });
  wrap.appendChild(ul);

  return wrap;
}

function getAlertClass(severity: AlertVariant): string | undefined {
  switch (severity) {
    case 'primary': return 'alert-primary';
    case 'secondary': return 'alert-secondary';
    case 'success': return 'alert-success';
    case 'error': return 'alert-danger';
    case 'warning': return 'alert-warning';
    case 'info': return 'alert-info';
  }
  return undefined;
}


