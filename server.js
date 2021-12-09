const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser')
const {
  auth
} = require('express-openid-connect');

const router = require('./routes/index');
const Auth0ApiMgr = require('./api/auth0-api-mgr');
const Auth0LoginMgr = require('./api/auth0-login-mgr');

dotenv.load();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());

const isProd = process.env.NODE_ENV === 'production';

// Use localhost when not in production
const port = process.env.PORT || 3000;
const hostURL = process.env.BASE_URL || 'http://localhost:3000';


// Init Auth0 Api Mgr
Auth0ApiMgr.setAuth0ApiAccessToken(process.env.MGMT_API_ACCESS_TOKEN);
Auth0ApiMgr.setAuth0BaseUrl(process.env.ISSUER_BASE_URL);
Auth0ApiMgr.setClientInfo(process.env.CLIENT_ID, process.env.SECRET);

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: hostURL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};


app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

app.use('/', router);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  res.status(status);
  const loginSrcType = Auth0LoginMgr.getLoginSrcType(req.oidc);
  res.render('error', {
    isAuthenticated: req.oidc.isAuthenticated(),
    info: {
      act: status,
      err: isProd ? '' : err.message,
      msg: null
    },
    loginSrcType: loginSrcType,
    loginMgr: Auth0LoginMgr
  });
});

http.createServer(app)
  .listen(port, () => {
    console.log(`Zeal Back-End Demo ${isProd ? 'Prod' : 'Dev'} Server Listening on ${config.baseURL}`);
  });