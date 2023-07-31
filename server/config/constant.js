const WX_APPID = 'wx594d896414585fca'
const GRANT_TYPE = 'client_credential' 
const APP_SECRET = 'ecc88742a3d33c6ea643594ec876568d'

const DD_AppKey = 'dingrxmfuyclkd7vernd'
const DD_AppSecret = 'evuxjPKOJ0PvTW9t7oVXkt_F1HFhtAFjfpa816m9w0IjgyeC9d3YjHAeVAUbKIK5'

const wx_accessTokenApi = `https://api.weixin.qq.com/cgi-bin/token?grant_type=${GRANT_TYPE}&appid=${WX_APPID}&secret=${APP_SECRET}`
const dd_accessTokenApi = `https://oapi.dingtalk.com/gettoken?appkey=${DD_AppKey}&appsecret=${DD_AppSecret}`
const dd_userInfoApi = `https://oapi.dingtalk.com/sns/getuserinfo_bycode&accessKey=${DD_AppKey}`

module.exports = {
    DD_AppKey,
    DD_AppSecret,
    wx_accessTokenApi,
    dd_accessTokenApi,
    dd_userInfoApi
}