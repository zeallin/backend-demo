var axios = require("axios").default;

var Auth0ApiMgr = {

    token: '',
    baseUrl: '',

    clientId: '',
    clientSecret: '',

    setAuth0BaseUrl: function (baseUrl) {
        this.baseUrl = baseUrl;
    },

    setAuth0ApiAccessToken: function (token) {
        this.token = token;
    },

    setClientInfo: function (clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    },

    updateUserName: function (userId, newName) {

        return new Promise((resolve, reject) => {

            var options = {
                method: 'PATCH',
                url: this.baseUrl + '/api/v2/users/' + userId,
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + this.token
                },
                data: {
                    name: newName
                }
            };

            axios.request(options).then(function (response) {
                // console.log(response.data);
                resolve(response.data);
            }).catch(function (error) {
                console.error(error);
                reject(error.response);
            });

        });

    },

    updateUserPassword: function (userId, email, oldPwd, newPwd) {
        var _this = this;
        return new Promise((resolve, reject) => {

            // Check if password ok
            var options = {
                method: 'POST',
                url: this.baseUrl + '/oauth/token',
                headers: {
                    'content-type': 'application/json'
                },
                data: {
                    grant_type: 'password',
                    username: email,
                    password: oldPwd,
                    audience: this.baseUrl + '/api/v2/',
                    scope: 'openid',
                    client_id: this.clientId,
                    client_secret: this.clientSecret
                }
            };

            console.log(options);

            axios.request(options).then(function (response) {

                if (response.status == 200) {

                    // Lets Update!
                    var options = {
                        method: 'PATCH',
                        url: _this.baseUrl + '/api/v2/users/' + userId,
                        headers: {
                            'content-type': 'application/json',
                            authorization: 'Bearer ' + _this.token
                        },
                        data: {
                            password: newPwd,
                            connection: 'Username-Password-Authentication'
                        }
                    };

                    axios.request(options).then(function (response) {
                        // console.log(response.data);
                        resolve(response.data);
                    }).catch(function (error) {
                        console.error(error);
                        reject(error.response);
                    });


                } else {
                    reject(response);
                }

            }).catch(function (error) {
                console.error(error);
                reject(error.response);
            });
        });
    },

    resendVerifyEmail: function (userId) {

        return new Promise((resolve, reject) => {

            // Send API
            var options = {
                method: 'POST',
                url: this.baseUrl + '/api/v2/jobs/verification-email',
                headers: {
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + this.token
                },
                data: {
                    user_id: userId,
                    client_id: this.clientId
                }
            };

            axios.request(options).then(function (response) {
                resolve(response.data);
            }).catch(function (error) {
                console.error(error);
                reject(error.response);
            });
        });
    },

    getErrMsg(res) {

        // Collect all information into one msg
        var msg = '';
        msg += res.status + ': ';
        if (res.data.errorCode) {
            msg += res.data.errorCode + ', '
        }
        if (res.data.error) {
            msg += res.data.error + ', '
        }
        if (res.data.message) {
            msg += res.data.message
        }
        if (res.data.error_description) {
            msg += res.data.error_description
        }

        return msg;
    }

}

module.exports = Auth0ApiMgr;