import express, { NextFunction } from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Cookies from 'js-cookie';

const config = require('../../webpack.config');

const app = express();
const compiler = webpack(config);


const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
});

Shopify.Context.initialize({
  API_KEY:'<<replace>>',
  API_SECRET_KEY: '<<replace>>',
  SCOPES: ['read_orders'],
  HOST_NAME: '99a5-58-162-198-109.ngrok.io',
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});


app.get('/auth', (req, res) => {
  const shop = 'robert-test-store-1.myshopify.com';
  const host = 'https://99a5-58-162-198-109.ngrok.io';

  Cookies.set('shopifyTopLevelOAuth', '', { secure: true });
  Shopify.Auth.beginAuth(
    req,
    res,
    shop,
    `${host}/auth/callback`,
    true
  ).then(redirectUrl => {
    console.log(`Redirect url is ${redirectUrl}`);
    res.redirect(redirectUrl);
  });
});

app.get('/auth/callback', (req, res) => {
  const shop = 'robert-test-store-1.myshopify.com';
  const host = 'cm9iZXJ0LXRlc3Qtc3RvcmUtMS5teXNob3BpZnkuY29tL2FkbWlu';

  Shopify.Auth.validateAuthCallback(req, res, req.query).then(() => {
    Shopify.Utils.loadCurrentSession(req, res, true).then(session => {
      console.log('Redirecting to shop with session ', session);
      res.redirect(`/?shop=${shop}&host=${host}`);
    });
  });
});

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.get('*', (req, res, next) => {
  console.log(`Handling request ${req.path}`);
  devMiddleware(req, res, next);
});

// Serve the files on port 3000.
app.listen(8081, function () {
  console.log('Example app listening on port 8081!\n');
});


