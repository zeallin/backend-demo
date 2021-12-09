# Zeal Back-End Exam

This demo project is based on "Express OpenID Connect Webapp Sample" from [Express Quickstart](https://auth0.com/docs/quickstart/webapp/express). Implemented following features:

- User Signup and Login (though Auth0)
- Resend Verification Email
- View user profile
- Update user name (auth0 account)
- Update user password (auth0 account)


## Running This Sample Locally

1. Install the dependencies with npm:

```bash
npm install
```

2. Rename `.env.example` to `.env` and replace or check the following values. 

- `ISSUER_BASE_URL` - absolute URL to your Auth0 application domain (ie: `https://accountName.auth0.com`)
- `CLIENT_ID` - your Auth0 application client id
- `SECRET` - your Auth0 application client secret
- `BASE_URL` - host site url (need to match Auth0 settings)
- `PORT` - host site port (need to match Auth0 settings)
- `MGMT_API_ACCESS_TOKEN` - Auth0 Management API access token (Bearer)
- `NODE_ENV` - override node run mode

```bash
mv .env.example .env
```

3. Run the sample app:

```bash
npm start
```

The sample app will be served at `localhost:3000`.

## What is Auth0?

Auth0 helps you to easily:

- implement authentication with multiple identity providers, including social (e.g., Google, Facebook, Microsoft, LinkedIn, GitHub, Twitter, etc), or enterprise (e.g., Windows Azure AD, Google Apps, Active Directory, ADFS, SAML, etc.)
- log in users with username/password databases, passwordless, or multi-factor authentication
- link multiple user accounts together
- generate signed JSON Web Tokens to authorize your API calls and flow the user identity securely
- access demographics and analytics detailing how, when, and where users are logging in
- enrich user profiles from other data sources using customizable JavaScript rules

[Why Auth0?](https://auth0.com/why-auth0)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
