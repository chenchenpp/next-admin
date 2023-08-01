let fs=require('fs')
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
    }
}