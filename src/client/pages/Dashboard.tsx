import React from 'react';
import { Heading, Page, Link } from "@shopify/polaris";
import { TitleBar, Redirect, Button } from '@shopify/app-bridge/actions';
import { useAppBridge } from "@shopify/app-bridge-react";
import axios from 'axios';

const Dashboard = (props: any) => {
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const breadcrumb = Button.create(app, { label: 'My breadcrumb' });
  breadcrumb.subscribe(Button.Action.CLICK, () => {
     app.dispatch(Redirect.toApp({ path: '/breadcrumb-link' }));
  });

  const titleBarOptions = {
     title: 'Dashboard',
     //breadcrumbs: breadcrumb
  };

  TitleBar.create(app, titleBarOptions);

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  props.authAxios.get('/api/v1/contacts', {
    cancelToken: source.token
  }).then((res: any) => {
    console.log(`Response is ${res}`);
  }).catch((err: any) => {
    console.log('Error fetching', err);
  });

  return (
    <Page>
      <Heading>Dashboard</Heading>
      <Link onClick={() => redirect.dispatch(Redirect.Action.APP, '/page1/5555') }>Item 1</Link>
    </Page>
  );
}

export default Dashboard;