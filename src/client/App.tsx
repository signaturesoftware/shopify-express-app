import React from 'react'; 
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import Routes from './Routes';
import MyRouter from './MyRouter';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { authenticatedFetch, getSessionToken } from "@shopify/app-bridge-utils";
import axios from 'axios';
import { Redirect } from "@shopify/app-bridge/actions";
import { ClientApplication } from '@shopify/app-bridge';
import { useAppBridge } from "@shopify/app-bridge-react";

export interface AppProps {

}

const userLoggedInFetch = (app: ClientApplication<any>) => {
  const fetchFunction = authenticatedFetch(app);

  return async (uri: any, options: any) => {
    const response = await fetchFunction(uri, options);

    if (response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1") {
      const authUrlHeader = response.headers.get("X-Shopify-API-Request-Failure-Reauthorize-Url");
      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return new Response(null);
    }

    return response;
  };
}

const MyProvider = (props: any) => {
  const app = useAppBridge();

  const client = new ApolloClient({
    fetch: userLoggedInFetch(app),
    fetchOptions: {
      credentials: "include",
    },
  });

  const authAxios = axios.create();
  authAxios.interceptors.request.use(config => {
    getSessionToken(app).then(token => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    });
  });

  const Component = props.Component;

  return (
    <ApolloProvider client={client}>
      <Component {...props} authAxios={authAxios} shopifyApp={app} />
    </ApolloProvider>
  );
}

const MyRoutes = (props: any) => ( 
  <Routes {...props}>
    <MyRouter />
  </Routes>
)

const App = (props: AppProps) => (
  <AppProvider i18n={translations}>
      <Provider
        config={{
          apiKey: '9467543f80816bf1711d3f57c357f4b9',
          host: 'cm9iZXJ0LXRlc3Qtc3RvcmUtMS5teXNob3BpZnkuY29tL2FkbWlu',
          forceRedirect: true,
        }}
      >
        <MyProvider Component={MyRoutes} />
      </Provider>
    </AppProvider>
);

export default App;