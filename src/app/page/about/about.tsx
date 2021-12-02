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
import {Button, InputText} from 'app/core/components';
import React from 'react';
import {useTranslation} from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const About = (props: RouteComponentProps) => {
  const {t} = useTranslation('common');
  return (
    <div className="container">
      <article style={{padding: '16px'}}>
        <h1 className="text-center" style={{marginTop: '20px', marginBottom: '24px'}}>
          About {t('title.app')}
        </h1>

        <div className="text-center" style={{maxWidth: '600px', margin: '0 auto 40px'}}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer pellentesque risus
            lectus, a consectetur nulla malesuada sit amet. Nullam et magna id sapien molestie
            lacinia.
          </p>
          <p>
            Suspendisse accumsan scelerisque leo, eu imperdiet ipsum sollicitudin sit amet.
            Nullam turpis felis, rhoncus id arcu ut, luctus varius ipsum. Interdum et malesuada fames
            ac ante ipsum primis in faucibus. Nunc dignissim ante ac odio convallis lobortis. Integer
            sagittis rhoncus est quis dignissim. Quisque dolor mauris, dictum non odio vel, hendrerit
            gravida quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus lacus
            ante, convallis quis ultricies id, molestie a odio. Duis sit amet interdum dolor.
          </p>

          <h2>{t('label.contact-us')}</h2>

          <p>
            Quisque erat tellus, rutrum in nulla sed, sodales pellentesque lacus. Morbi consectetur
            condimentum arcu at imperdiet. Vivamus eu vestibulum eros. Etiam egestas venenatis nunc id
            varius. Proin sed est mollis, mattis purus vitae, sollicitudin tortor.
          </p>

          <div>
            <div className="mt-2"><InputText /></div>
            <div className="mt-2"><InputText /></div>
            <div className="mt-2"><InputText /></div>
            <div className="mt-3"><Button>Submit</Button></div>
          </div>
        </div>
      </article>
    </div>
  );
};
