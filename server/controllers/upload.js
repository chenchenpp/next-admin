let fs=require('fs')
const path = require('path')

module.exports = {
    // checkFiledHandle(req, res) {
    //     const {filedName} = req.params
    // },
    singleFormData(req, res) {
        let oldPath=req.file.destination+"/"+req.file.filename
        let newPath=req.file.destination+"/"+req.body.filename
        // 更改上传文件的存储名称
        fs.rename(oldPath,newPath,(err,data)=>{
            res.send({
                code: '200',
                msg: '上传成功',
                body: {
                    uid: req.file.filename,
                    url: 'http://10.6.65.145:8082/uploads/'+req.body.filename,
                    name: req.body.filename
                }
            })
        })
    },
    base64FileHandle(req, res) {
        const fileName = Date.now()+'.png'
        let filePath = path.join(__dirname, '../../public/uploads/'+fileName)
        let img = req.body.imgData;
        let base64 = img.replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64,'base64');
        fs.writeFile(filePath,dataBuffer,function (err) {
           if(err){
              res.status(400).send({
                code:'400',
                msg: '请求失败'
              })
           }else{
            res.status(200).send({
                code:'200',
                msg: '请求成功',
                body: {
                    uid: fileName,
                    url: 'http://10.6.65.145:8082/uploads/'+fileName,
                    name: fileName
                }
              })
           }
         })
    },

    /** 大文件上传 */
    async largeUpload(req, res){
        const {name, size, type, offset, hash} = req.body;
        const {file} = req.files;
        const ext = path.extname(name)
        const filename = path.join(__dirname, `../../public/large/${hash}${ext}`)
        // 如果之前已经添加过
        if(offset > 0) {
            if(!fs.existsSync(filename)){
                res.status(400).send({
                    code: '400',
                    msg: '文件不存在'
                })
                return;
            }
            // 向文件中添加数据
            await fs.appendFileSync(filename, file.data);
            res.send({
                code: '200',
                data: '添加完毕'
            })
            return
        }
        // 第一次添加处理
        await fs.writeFileSync(filename, file.data);
        res.send({
            code: '200',
            data: '创建成功'
        })
    }

}