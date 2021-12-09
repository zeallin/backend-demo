const LOGIN_TYPE_AUTH0 = 'auth0';
const LOGIN_TYPE_GOOGLE = 'google-oauth2';
const LOGIN_TYPE_FACEBOOK = 'facebook';

var Auth0LoginMgr = {

    getLoginSrcType: function (oidc) {
        if (!this.isAuthenticated(oidc)) return null;
        constSrcType = null;
        const tokens = oidc.user.sub.split('|');
        if (tokens.length > 0) {
            constSrcType = tokens[0];
        }
        return constSrcType;
    },

    isAuthenticated: function (oidc) {
        if (oidc && oidc.isAuthenticated) {
            return oidc.isAuthenticated();
        }
        return false;
    },

    isAuth0Login: function (loginSrcType) {
        return loginSrcType === LOGIN_TYPE_AUTH0;
    },

    isGoogleLogin: function (loginSrcType) {
        return loginSrcType === LOGIN_TYPE_GOOGLE;
    },

    isFacebookLogin: function (loginSrcType) {
        return loginSrcType === LOGIN_TYPE_FACEBOOK;
    },

    canProcessProfileUpdate: function (oidc) {
        return this.isAuthenticated(oidc) && this.isAuth0Login(this.getLoginSrcType(oidc)) && oidc.user.email_verified == true;
    },

    canViewProfile: function (oidc) {
        return this.isAuthenticated(oidc) && this.isEmailVerified(oidc);
    },

    isEmailVerified: function (oidc) {
        return oidc.user && oidc.user.email_verified === true;
    },

    getUpdateStr: function (oidc) {
        if (oidc && oidc.user) {
            var date = new Date(oidc.user.updated_at);
            return date.getUTCFullYear() + '-' +
                ('0' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
                ('0' + date.getUTCDate()).slice(-2) + ' ' +
                ('0' + date.getUTCHours()).slice(-2) + ':' +
                ('0' + date.getUTCMinutes()).slice(-2) + ':' +
                ('0' + date.getUTCSeconds()).slice(-2) + ' UTC';
        }
        return 'N/A';
    }

}
module.exports = Auth0LoginMgr;