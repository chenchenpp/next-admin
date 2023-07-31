const crypto = require('crypto');
const {DD_AppSecret, DD_AppKey} = require('../config/constant.js')
function sign(timestamp) {
    const hmac = crypto.createHmac('sha256', Buffer.from(DD_AppKey, 'utf8'));

    // hmac.update(Buffer.from(timestamp + "\n" + 'TestSuiteTicket', 'utf8'));
    hmac.update(Buffer.from(timestamp + '', 'utf8'));

    let sign = hmac.digest('base64');
    console.log('1', sign); // kXogg18q...
    // sign = sign.replace("+", "%20").replace("*", "%2A").replace("~", "%7E").replace("/", "%2F")
    // 钉钉加签最后需要urlencode
    let sign_urlencode = encodeURIComponent(sign);
    console.log('2', sign_urlencode)
    // ceux%2BxGQccRY...
    return sign_urlencode;
}
module.exports = sign