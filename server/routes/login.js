const express = require('express')
const loginCtr = require('../controllers/login')
const baseRoutes = require('./base');

const router = express.Router(baseRoutes);
router.get('/getAccessToken', loginCtr.getAccessToken)
router.post('/createQrCode', loginCtr.createQrCode)
router.get('/getUserInfo', loginCtr.getUserInfo)
module.exports = router