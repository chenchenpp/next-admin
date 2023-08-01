class request {
    async init(url, data, type, body) {
        let reqBody = body;
        // 使用fetch上传formData则不需要设置content-type
        if(type == 'formData') {
            Object.assign(reqBody, {
                body: data
            })
        } else {
            Object.assign(reqBody, {
                body: JSON.stringify(data)
            })
            reqBody.headers['Content-Type'] = 'application/json'
        }
        const response = await fetch(url, reqBody)
        // 未登录
        if(response.status == 401) {
            location.href = 'http://rt-unity-portal.idc1.fn/pages/login/cellphone'
            return
        }
        // 接口没有找到
        if(response.status == 404) {
            return {
                code: '404',
                msg: '接口地址有误'
            }
        }
        // 文件流处理
        if(type === 'file') {
            return response.blob()
        }
        return response.json();
    }
    async post(url, data, type, reqExtend = {}) {
        reqExtend.method = 'POST'
        // const body = {
        //     method: 'POST',
        //     ...reqExtend
        // }
        //  // formData处理
        // if(type !== 'formData') {
        //     body.headers = {
        //         'Content-Type': 'application/json'
        //     }
        // }
        return await this.init(url, data, type, reqExtend)
    }
    async get(url, data, type, reqExtend = {}) {
        reqExtend.method = 'Get'
        // const body = {
        //     method: 'Get',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     ...reqExtend
        // }
        return await this.init(url, data, type, reqExtend)
    }
}
export default new request();



