class request {
    async init(url, data, type, reqExtend) {
        const reqBody = {
            ...reqExtend,
            body: JSON.stringify(data)
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
        const body = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            ...reqExtend
        }
        return await this.init(url, data, type, body)
    }
    async get(url, data, type, reqExtend = {}) {
        const body = {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json'
            },
            ...reqExtend
        }
        return await this.init(url, data, type, body)
    }
}
export default new request();



