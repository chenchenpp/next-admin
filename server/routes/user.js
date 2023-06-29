const express = require('express')
const userCtr = require('../controllers/user')
const baseRoutes = require('./base');

const router = express.Router(baseRoutes);
router.get('/getUserId', userCtr.getUserId)
module.exports = router