const express = require("express");
const next = require("next");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
// require("./task");
// require("./message");
const user = require('./routes/user')
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
    server.use(bodyParser.json());
    server.use(cookieParser());
    server.use(user);
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
