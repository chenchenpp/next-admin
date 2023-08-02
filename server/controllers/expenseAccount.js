const request = require('request')
const dayjs = require('dayjs')
const fs = require('fs');
const path = require('path')
// const Excel = require('exceljs');
// var aspose = aspose || {};
// aspose.cells = require("aspose.cells");
// !TODO xlsx-style能够获取样式，但是不能获取行高
const XLSX = require('../../libs/xlsx-style/xlsx');

// TODO 能狗获取到行高 !rows, 但是失去了写入样式能力
const XLSX2= require('xlsx-js-style');

const FEINIU_XLSL_MODULE =  path.join(__dirname, '../../public/static/feiniu.xlsx');
const XLSX_DATA =  path.join(__dirname, '../../public/static/excel名称.xlsx');

module.exports = {
    getExcelModelData(req, res) {
      
        var workbook2 = XLSX.readFile(FEINIU_XLSL_MODULE, {cellStyles: true, cellDates: true,});
        var workbook3 = XLSX2.readFile(FEINIU_XLSL_MODULE, {cellStyles: true});
        var workbook4 = XLSX.readFile('./public/static/excel名称.xlsx', {cellStyles: true, cellDates: true,})
        res.send({
            workbook2,
            workbook3,
            workbook4
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
        }, function(error, response, logListBody) {    
            if (error || res.statusCode !== 200) {
              res.status(401).send({
                code: res.statusCode || 500,
                msg: '接口异常：请检查!' + error
              })
              return
            }
            // 筛选大于晚上七点并且满9个小时的上班记录 和 周末加班
            const expenseList = logListBody.body.filter(item => {
              const workDayOver = Number(item.end.split(':')[0]) >= 19 && Number(item.hour) > 9 && item.is_workday
              const weekendFlag = !item.is_workday
              return workDayOver || weekendFlag
            })
            
            // 休息日获取
            const weekendList = expenseList.filter(item => [0, 6].includes(dayjs(item.day).day()));
            
            // 报销四十元的数量
            const fortyNum = weekendList.filter(item => Number(item.hour) >= 8).length;  
            
            // 报销20元的数量  
            const twentyNum = expenseList.length - fortyNum;

            const sumPrice = fortyNum * 40 + twentyNum * 20    
            var workbook = XLSX.readFile(FEINIU_XLSL_MODULE, {cellStyles: true, cellHTML:true, cellFormula: true});
          
            var workbook3 = XLSX2.readFile(FEINIU_XLSL_MODULE, {cellStyles: true});
    
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const worksheet3 = workbook3.Sheets[workbook3.SheetNames[0]];
            // todo 行高样式不支持，使用xlsx-js-style获取支持
            worksheet['!rows'] = worksheet3['!rows'];
            if(body.store_no == 0) {
              worksheet.A1.v = '康成投资（中国）有限公司'
            }
            worksheet.A3.v = `申请人：＿＿＿＿${expenseList[0].usr_name}＿＿＿`;
            worksheet.C3.v = `年度/月份：＿＿${dayjs(expenseList[0].day).format('YYYY/MM')}＿＿＿＿`;
            // 小记
            worksheet.D28.v = sumPrice;
            // 总计
            worksheet.D29.v = sumPrice;
            // 餐饮发票
            worksheet.B30.v = `餐饮发票：${sumPrice}`;

            worksheet.B31.v = '交通发票：0';

            worksheet.B32.v = sumPrice;
            // 车票报销
            worksheet.E28.v = '';

            worksheet.A35.v = `申请人签名：_____${expenseList[0].usr_name}______  直属主管签名：__________  部门主管签名：__________`;
            
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
            expenseList.forEach((item, index) => {
                const lines = index + 5
                keyMap.forEach(name => {
                  if(name === 'day'){
                    data[Map[name] + lines]={
                      v: parseInt((dayjs(item[name]).valueOf() - dayjs('1900-01-01').valueOf()) / (60 * 60 * 24 * 1000) + 2)
                    } 
                  } else if(name === 'end') {
                    data[Map[name] + lines]={
                      h: `17:30 ~ ${item[name]}`,
                      v: `17:30 ~ ${item[name]}`,
                      r: `<t>17:30~${item[name]}</t>`,
                      w: `17:30 ~ ${item[name]}`,
                      t: "s"
                    } 
                  } else if(name === 'overtime_reason'){
                    data[Map[name] + lines]={
                      h: item[name] || '',
                      v: item[name] || '',
                      r: item[name] || '',
                      w: item[name] || '',
                      t: "s"
                    } 
                  } else if(name === 'price') {
                    const isForty = weekendList.filter(data => Number(data.hour) >= 8).some(sundayItem => item.day === sundayItem.day )
                    data[Map[name] + lines]={
                      v: isForty ? 40 : 20
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
              // 解决背景色是黑色的问题
              if(!keyName.includes('!')) {
                worksheet[keyName].s.fill.fgColor.rgb = 'FFFFFFFF'
              }
              if(!keyName.includes('!') || !keyName.includes('E') || !keyName.includes('F')){
                  // 当前行数
                const rowNum = Number(keyName.substring(1))
                
                if(rowNum > 4 && rowNum <= 27) {
                  if(data[keyName]){
                    worksheet[keyName]= {...worksheet[keyName], ...data[keyName]}
                  } else {
                    worksheet[keyName].v = ''
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
            XLSX.writeFile(workbook, './public/static/excel名称.xlsx', {type: "binary", bookType: "xlsx", cellStyles: true});
            // 读取文件
            var wbout = XLSX.write(workbook, {type: "buffer", bookType: "xlsx", cellStyles: true});
            
            res.send(wbout) 
        }) 
    },
    downloadPdf(req, res) {
      var workbook = new aspose.cells.Workbook(XLSX_DATA);
      var saveOptions = aspose.cells.PdfSaveOptions();
      saveOptions.setOnePagePerSheet(true);
      workbook.save("./public/static/报销单.pdf", saveOptions);
    }
}