const request = require('request')
const dayjs = require('dayjs')
const fs = require('fs');

// !TODO xlsx-style能够获取样式，但是不能获取行高
const XLSX = require('../../libs/xlsx-style/xlsx');

// TODO 能狗获取到行高 !rows, 但是失去了写入样式能力
const XLSX2= require('xlsx-js-style');

module.exports = {
    getExcelModelData(req, res) {
        var workbook2 = XLSX.readFile('./static/model.xlsx', {cellStyles: true, cellDates: true,});
        var workbook3 = XLSX2.readFile('./static/model.xlsx', {cellStyles: true});
        res.send({
            workbook2,
            workbook3
        });
    },
    downloadAccount(req, res) {
        const {body} = req;
        const log = `${new Date().toISOString()}: ${body.usr_name} ${body.usr_id}\n`;
        // 将日志写入文件
        fs.appendFile('./log/access.log', log, (err) => {
            if (err) {
                console.error('Error writing log file:', err);
            }
        });
        request({
            url: 'http://oa-portal.idc1.fn/api/attendance/get-list',
            method:'POST',
            json: true,
            headers:{
               'Content-Type': 'application/json',
            },
            body
        }, function(error, response, body) {    
            if (error || res.statusCode !== 200) {
                res.send({
                    code: res.statusCode || 500,
                    msg: '接口异常：请检查!' + error
                })
            }
            // 筛选大于晚上七点的上班记录
            body.body = body.body.filter(item => Number(item.end.split(':')[0]) >= 19)
            const dataLen = body.body.length;        
            var workbook = XLSX.readFile('./static/model.xlsx', {cellStyles: true, cellHTML:true, cellFormula: true});
          
            var workbook3 = XLSX2.readFile('./static/model.xlsx', {cellStyles: true});
    
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const worksheet3 = workbook3.Sheets[workbook3.SheetNames[0]];
    
            // todo 行高样式不支持，使用xlsx-js-style获取支持
            worksheet['!rows'] = worksheet3['!rows'];;
    
            worksheet.A3.v = `申请人：＿＿＿＿${body.body[0].usr_name}＿＿＿`;
            worksheet.C3.v = `年度/月份：＿＿${dayjs(body.body[0].day).format('YYYY/MM')}＿＿＿＿`;
            worksheet.A32.v = `申请人签名：_____${body.body[0].usr_name}______  直属主管签名：__________`;
            worksheet.B29.v = 20 * dataLen;
            worksheet.D26.v = 20 * dataLen;
            const data = {}
            // 枚举属性字段对应位置
            const Map = {
              day: 'A', // 日期
              overtime_reason: 'B', // 加班事由
              end: 'C', // 加班时间
              price: 'D', // 餐费金额
              traficPrice: 'E', // 交通费金额
              subTotal: 'F' // 小记
            }
            // 获取字段
            const keyMap = Object.keys(Map)
            body.body.forEach((item, index) => {
                const lines = index + 5
                keyMap.forEach(name => {
                  if(name === 'day'){
                    data[Map[name] + lines]={
                      v: parseInt((dayjs(item[name]).valueOf() - dayjs('1900-01-01').valueOf()) / (60 * 60 * 24 * 1000) + 2)
                    } 
                  } else if(name === 'end') {
                    data[Map[name] + lines]={
                      v: `17:30 ~ ${item[name]}`
                    } 
                  } else if(name === 'price') {
                    data[Map[name] + lines]={
                      v: 20
                    } 
                  } else {
                    data[Map[name] + lines]={
                      v: item[name] || ''
                    } 
                  }
                })
            })
            // 将获取的值v合并到工作簿中
            Object.keys(worksheet).forEach(keyName => {
                if(!keyName.includes('!') || !keyName.includes('E') || !keyName.includes('F')){
                      // 当前行数
                    const rowNum = Number(keyName.substring(1))
                   if(rowNum > 4 && rowNum < 26) {
                    if(data[keyName]){
                      worksheet[keyName]= {...worksheet[keyName], ...data[keyName]}
                    } else {
                      delete worksheet[keyName]
                    }
                   }
                }
            })
            /**
             * 删除多余行数
             *? 删除没有问题 但是样式没有继承，待完善
             * */ 
            // let lines = 24 - 4- dataLen
            // while(lines > 0) {
            //   deleteRow(worksheet, 5+dataLen)
            //   lines --;
            // }
    
            /**
             * 文件类型
             * @type binary: 二进制字符串; base64: Base64编码; buffer: nodejs 缓冲区
             * @说明 将文件处理成binary后；需要转换成buffer，前端需要转换成blob
             */
            // 写入文件
            XLSX.writeFile(workbook, './static/excel名称.xlsx', {type: "binary", bookType: "xlsx", cellStyles: true});
            // 读取文件
            var wbout = XLSX.write(workbook, {type: "buffer", bookType: "xlsx", cellStyles: true});
        
            res.send(wbout)
        }) 
    }
}