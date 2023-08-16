const express = require("express");
const next = require("next");
// todo express4.x及以上版本已经不需要安装body-parser中间件去获取post请求的请求体了，且已经被弃用，只需写入以上配置即可获取post请求体。
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');

// require("./task");
// require("./message");
const login = require('./routes/login')
const user = require('./routes/user')
const upload = require('./routes/upload')
const expenseAccount = require('./routes/expenseAccount')
const cors = require('cors');

const server = express();
const port = parseInt(process.env.PORT, 10) || 8082;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// 设置head标头
server.set("x-powered-by", dev);
// 初始化Nextjs
app
  .prepare()
  .then(() => {
    //自定义api
    server.use(cors());
    server.use(bodyParser.json({
      limit: "10mb", 
      extended: true
    }));
    server.use(cookieParser());
    server.use(fileUpload());

    server.use(login).use(user).use(upload);
    
    server.use(expenseAccount);

    // 自定义渲染内容
    server.get("/t/:id", (req, res) => {
      return handle(req, res);
    });
    // 拦截所有内容
    server.get("*", (req, res) => {
      return handle(req, res);
    });

    try {
      server.listen(port, "0.0.0.0", () => {
        console.log(`> Ready on http://localhost:${port}`);
      });
    } catch (error) {
      console.error(error);
    }
  })
  .catch((err) => console.log(err));
