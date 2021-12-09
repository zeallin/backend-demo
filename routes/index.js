var router = require('express').Router();
const Auth0ApiMgr = require('../api/auth0-api-mgr');
const Auth0LoginMgr = require('../api/auth0-login-mgr');

const {
  requiresAuth
} = require('express-openid-connect');


router.get('/', function (req, res, next) {
  // console.log(req.oidc.user);
  const loginSrcType = Auth0LoginMgr.getLoginSrcType(req.oidc);

  res.render('index', {
    title: 'Home - Zeal Back-End Exam',
    // userProfile: JSON.stringify(req.oidc.user, null, 2),
    info: {
      act: req.query.act,
      err: req.query.err,
      msg: req.query.msg
    },
    isAuthenticated: req.oidc.isAuthenticated(),
    loginSrcType: loginSrcType,
    loginMgr: Auth0LoginMgr
  });
});


router.get('/profile', requiresAuth(), function (req, res, next) {
  if (Auth0LoginMgr.canViewProfile(req.oidc)) {

    const loginSrcType = Auth0LoginMgr.getLoginSrcType(req.oidc);

    res.render('profile', {
      title: 'Profile - Zeal Back-End Exam',
      info: {
        act: req.query.act,
        err: req.query.err,
        msg: req.query.msg
      },
      isAuthenticated: req.oidc.isAuthenticated(),
      loginSrcType: loginSrcType,
      loginMgr: Auth0LoginMgr
    });
  } else {
    res.redirect('/');
  }
});

router.get('/resend-email', requiresAuth(), function (req, res, next) {
  if (!Auth0LoginMgr.isEmailVerified(req.oidc)) {

    Auth0ApiMgr.resendVerifyEmail(req.oidc.user.sub).then((data) => {
      const loginSrcType = Auth0LoginMgr.getLoginSrcType(req.oidc);
      res.render('resend-email', {
        title: 'Email Sent - Zeal Back-End Exam',
        isAuthenticated: req.oidc.isAuthenticated(),
        loginSrcType: loginSrcType,
        loginMgr: Auth0LoginMgr
      });
    }).catch((err) => {
      res.redirect('/?act=Resend%20Verify%20Email&&err=' + Auth0ApiMgr.getErrMsg(err));
    });

  } else {
    res.redirect('/');
  }

});

router.get('/signup', (req, res) => res.oidc.login({
  returnTo: '/',
  authorizationParams: {
    screen_hint: 'signup',
  }
}));

router.post('/update-name', requiresAuth(), function (req, res, next) {
  // Only auth0 account can update name
  if (Auth0LoginMgr.canProcessProfileUpdate(req.oidc)) {
    const newName = req.body['new-name'];

    Auth0ApiMgr.updateUserName(req.oidc.user.sub, newName).then((data) => {
      // Need to login again to update new name
      res.redirect('/login');
    }).catch((err) => {
      res.redirect('/profile?act=Update%20Name&err=' + Auth0ApiMgr.getErrMsg(err));
    });
  } else {
    res.redirect('/');
  }
});

router.post('/update-password', requiresAuth(), function (req, res, next) {
  // Only auth0 account can update password
  if (Auth0LoginMgr.canProcessProfileUpdate(req.oidc)) {
    const oldPwd = req.body['old-pwd'];
    const newPwd = req.body['new-pwd'];
    console.log('Old Password:' + oldPwd);
    console.log('New Password:' + newPwd);

    Auth0ApiMgr.updateUserPassword(req.oidc.user.sub, req.oidc.user.email, oldPwd, newPwd).then((data) => {
      res.redirect('/profile?act=Reset%20Password&msg=Success');
    }).catch((err) => {
      res.redirect('/profile?act=Reset%20Password&&err=' + Auth0ApiMgr.getErrMsg(err));
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;