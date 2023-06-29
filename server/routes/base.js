const express = require('express');
const router = express.Router();
// 基础中间件
router.use((req, res, next) => {
  console.log('Base middleware');
  next();
});
// 基础路由处理函数
router.get('/', (req, res) => {
  res.send('Hello, World!');
});



module.exports = router;
