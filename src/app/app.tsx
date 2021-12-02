/*
 * Copyright (c) 2021 All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Written by:
 *   - Satrya Wiguna <satrya@freshcms.net>
 */

import DateFnsUtils from '@date-io/date-fns';
import {StylesProvider, unstable_createMuiStrictModeTheme as createMuiTheme} from '@material-ui/core';
import {deepOrange, lightBlue} from '@material-ui/core/colors';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {ThemeProvider} from '@material-ui/styles';
import {globalHistory, Router} from '@reach/router';
import {LoginPage} from 'app/auth';
import {
  AlertDialog,
  AlertDialogContext,
  AlertDialogData,
  AlertDialogRef,
  ChangeInsertDialog,
  ChangeInsertDialogRef,
  ConfirmChangeInsertResult,
  DeleteConfirmDialog,
  DeleteConfirmDialogData,
  DeleteConfirmDialogRef
} from 'app/core/components';
import {isAfter} from 'date-fns';
import React, {FC, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import '../assets/styles/app.scss';
import {Main} from './modules/main';

const theme = createMuiTheme({
  palette: {
    primary: {main: lightBlue[800]},
    secondary: {main: deepOrange[500]},
  }
});

export const App: FC = () => {
  const {t} = useTranslation();

  const deleteConfirmRef = useRef<DeleteConfirmDialogRef>(null);
  const changeInsertRef = useRef<ChangeInsertDialogRef>(null);
  const alertRef = useRef<AlertDialogRef>(null);

  useEffect(() => {
    globalHistory.listen(() => window.scrollTo({top: 0, behavior: 'smooth'}));
  }, []);

  async function confirmDelete(content: DeleteConfirmDialogData): Promise<boolean> {
    const result = await deleteConfirmRef.current?.open(content);
    return result === true;
  }

  async function confirmChangeInsert(effective: Date | undefined, newEffective: Date | undefined)
    : Promise<ConfirmChangeInsertResult> {
    if (!needConfirmChangeInsert(effective, newEffective)) return [true, {}];
    const mode = await changeInsertRef.current?.open() ?? undefined;
    if (!mode) return [false, {}];
    return [true, {mode: mode}];
  }

  function needConfirmChangeInsert(effective?: Date, newEffective?: Date): boolean {
    if (newEffective == null) return false;
    if (effective == null) return true;
    return isAfter(newEffective, effective);
  }

  async function alert(content: AlertDialogData): Promise<void> {
    await alertRef.current?.open(content);
  }

  async function alertInvalid(content: AlertDialogData): Promise<void> {
    await alertRef.current?.open({...content, title: content.title ?? t('common:title.invalid-data')});
  }

  return (
    <StylesProvider injectFirst>
    <ThemeProvider theme={theme}>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <AlertDialogContext.Provider value={{confirmDelete, confirmChangeInsert, alert, alertInvalid}}>

      {/* == Main == */}
      <Router primary={false} id="route-lv0">
        <LoginPage path="/login" />
        <Main path="/*" />
      </Router>

      {/* Alert Dialog */}
      <DeleteConfirmDialog ref={deleteConfirmRef} />
      <ChangeInsertDialog ref={changeInsertRef} />
      <AlertDialog ref={alertRef} />

    </AlertDialogContext.Provider>
    </MuiPickersUtilsProvider>
    </ThemeProvider>
    </StylesProvider>
  );
};
