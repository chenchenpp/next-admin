const mongoose = require("mongoose");
const password = "2455915115cp..";
const connectStr = `mongodb+srv://forrest:${password}@cluster0.miwaacc.mongodb.net/?retryWrites=true&w=majority`;
// 连接池数量
const poolOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 5,
};
const connectionPool = mongoose.createConnection(connectStr, poolOptions);
// 当连接池成功连接时触发
connectionPool.on("connected", () => {
  console.log(`Connected to MongoDB Atlas. Connection pool size: ${poolSize}`);
});

// 当连接池出错时触发
connectionPool.on("error", (error) => {
  console.error("Error connecting to MongoDB Atlas:", error);
}); 

// 当连接池关闭时触发
connectionPool.on("disconnected", () => {
  console.log("Disconnected from MongoDB Atlas");
});
// 当应用程序退出时，关闭连接池
process.on("SIGINT", () => {
  connectionPool.close(() => {
    console.log("MongoDB Atlas connection pool closed");
    process.exit(0);
  });
});

// 导出连接池对象
module.exports = connectionPool;
// module.exports = {
//     async connect() {
//         try {
//              await mongoose.connect(connectStr, {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true,
//               })
//               console.log('Connected to MongoDB Atlas');
//         }catch(err) {
//             console.error('Error connecting to MongoDB Atlas:', err);
//         }
//     },
//     async close(){
//         await mongoose.connection.close()
//     }
// }
