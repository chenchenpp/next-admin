const WX_APPID = 'wx594d896414585fca'
const GRANT_TYPE = 'client_credential' 
const APP_SECRET = 'ecc88742a3d33c6ea643594ec876568d'
const DD_AppKey = 'dingrxmfuyclkd7vernd'
const DD_AppSecret = 'evuxjPKOJ0PvTW9t7oVXkt_F1HFhtAFjfpa816m9w0IjgyeC9d3YjHAeVAUbKIK5'
const redirectUrl =encodeURIComponent('http://rt-web.idc1.fn:8082/test')
export const DDLogin_goto = encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${DD_AppKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${redirectUrl}`)