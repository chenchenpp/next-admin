/*
 * @Author: peng.chen2
 * @Date: 2023-06-29 10:17:55
 * @LastEditors: peng.chen2
 * @LastEditTime: 2023-06-29 16:05:19
 * @FilePath: /micro-web/Users/chenpeng/Desktop/myProject/person/nextjs-demo-main/server/routes/expenseAccount.js
 * @Description: 报销单
 * @use:
 * @params:
 * Copyright (c) 2023 by 飞牛集达有限公司, All Rights Reserved. 
 */

// ? https://github.com/exceljs/exceljs  后续确定是否功能强大
const express = require('express');
const expenseAccountCtr = require('../controllers/expenseAccount')
// const baseRoutes = require('./base');

//创建路由对象
const router = express.Router();

router.get('/downExcel', expenseAccountCtr.getExcelModelData)

router.post("/downExcel", expenseAccountCtr.downloadAccount)

module.exports = router;

