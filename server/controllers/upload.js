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
    }
}