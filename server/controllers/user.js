const request = require('request')
function getUserInfo(emp_id) {
    return new Promise((resolve, reject) => {
        request({
            url: 'http://oa-portal.idc1.fn/api/offwork/userInfo?emp_id=' + emp_id,
            method:'GET',
        }, function(error, response, body) {
            const parsBody = JSON.parse(body)
            if(parsBody.code === 200) {
                resolve(parsBody)
            } else {
                reject(parsBody)
            }
        })
    })
}

module.exports = {

    getUserId(req, res) {
        const token = req.cookies.s98r5h2s6v1m37o || req.query.token
        if(!token) {
            res.status(401).send({
                code: '401',
                msg: 'token失效, 请重新登录'
            })
            return
        }
        request({
            url: 'http://oa-portal.idc1.fn/api/sso/get-emp-id?token=' + token,
            method:'GET'
        }, function(error, response, body) {
            const parsBody = JSON.parse(body)
            if(parsBody.code == 200) {
                const uerId = parsBody.body;
                getUserInfo(uerId).then(userInfo => {
                    res.send(userInfo)
                }).catch(err => {
                    res.status(401).send(err)
                })
            } else {
                res.status(401).send({
                    code: '401',
                    msg: 'token失效, 请重新登录'
                })
                return
            }
        })
    }
}