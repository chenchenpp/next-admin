/*
 * @Author: peng.chen2
 * @Date: 2023-07-06 09:12:55
 * @LastEditors: peng.chen2
 * @LastEditTime: 2023-07-06 10:33:31
 * @FilePath: /micro-web/Users/chenpeng/Desktop/myProject/person/nextjs-demo-main/server/models/album.js
 * @Description: 相册数据模型
 * @use:
 * @params:
 * Copyright (c) 2023 by 飞牛集达有限公司, All Rights Reserved. 
 */
const mongoose = require('mongoose')
const Photo = require('./photo')
const albumSchema = new mongoose.Schema({
    // 根据此字段关联相册拥有者
    userId: {
        type: String
    },
    // 相册名称
    name: {
        type: String
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
})
class OpareDb {
    constructor() {
        this.AlbumModel = mongoose.model('album', albumSchema)
    }
    async add(userId, name) {
        return this.AlbumModel.create({
            userId,
            name
        })
    }
    async findById(id) {
        return this.AlbumModel.findById(id)
    }
    async update(id, name) {
        return this.AlbumModel.update({
            _id: id // 筛选出需要更新的数据
        }, {
            name: name // 更新数据name
        })
    }
    async remove(id) {
        return this.AlbumModel.remove({
            _id: id
        })
    }
}
class Album extends OpareDb {
    constructor() {
        super()
        
    }

    async add(userId, name) {
        return super.add(userId, name)
    }

    async update(id, name, user) {
        const data = await super.findById(id)
        if(!data) {
            throw new Error('修改的相册不存在')
        }
        if(!user.isAdmin&&user.id!== data.userId) {
            throw new Error('你没有权限修改此相册')
        }
        return super.update(id, name)
    }
    async delete(id) {
        const photos = await Photo.getPhotosByAlbumIdCount(id)
        if(photos.length){
            throw new Error('相册还存在照片，不允许删除')
        }
        return super.remove(id)
    }

}