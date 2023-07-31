// https://open.dingtalk.com/abilities/139
const request = require('request')
const {wx_accessTokenApi,
    dd_accessTokenApi, dd_userInfoApi} = require('../config/constant')
const sign = require('../utils/sign.js')

module.exports = {
    getAccessToken(req, res) {
        request({
            url: dd_accessTokenApi,
            method:'GET',
        }, function(error, response, body) {
            const resData = JSON.parse(body);
            res.send(resData)
        })
    },
    createQrCode(req, res) {
        const {body} = req;
        request({
            url: 'http://10.6.65.114:8082/getAccessToken',
            method: 'GET'
        }, function(error, response, accesBody) {
            const resData = JSON.parse(accesBody);
           
            const {access_token} = resData
            console.log(access_token, body, 'resData')
            request({
                url: `https://api.weixin.qq.com/product/qrcode/gen?access_token=${access_token}`,
                method: 'POST',
                json: true,
                headers:{
                    'Content-Type': 'application/json',
                },
                body
            }, function(qrError, qrResponse, qrBody) {
                // console.log(qrError, qrResponse, qrBody)
                res.send(qrBody)
            })
        })
    },
    async getUserInfo(req, res) {
        const {tmpAuthCode} = req.query;
        const timestamp = new Date().getTime()
        const signature = sign(timestamp)
        console.log(tmpAuthCode, 111)
        request({
            url: dd_userInfoApi + `&signature=${signature}&timestamp=${timestamp}`,
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: {
                tmp_auth_code: tmpAuthCode
            },
            json: true,
        }, function(error, response, accesBody) {
            console.log(response)
        })
    }
}