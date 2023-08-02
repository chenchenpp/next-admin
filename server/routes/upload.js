const express = require('express')
const path = require('path')
const multer = require('multer')
const baseRoutes = require('./base')
const router = express.Router(baseRoutes)
const uploadCtr = require('../controllers/upload')
 // 上传路径
const upload = multer({ dest: path.join(__dirname, '../../public/uploads') })

// router.get('/checkFiled/:filedName', uploadCtr.checkFiledHandle)
// 默认情况是‘file'，如果定义其他name，则前端也需要定义相同名字
// https://stackoverflow.com/questions/31530200/node-multer-unexpected-field
router.post('/upload_single', upload.single('file'),uploadCtr.singleFormData);
router.post('/upload_base64', uploadCtr.base64FileHandle)
module.exports = router