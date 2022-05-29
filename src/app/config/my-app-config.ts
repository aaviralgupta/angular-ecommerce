export default {

    oidc:{
        clientId: '0oa57usar2YaiBWZ75d7',
        issuer: 'https://dev-23972446.okta.com/oauth2/default',// url of authorization server
        redirectUri: 'http://localhost:4200/login/callback', // once login redirects to this Url
        scopes: ['openid', 'profile', 'email']
    }
}
