const mongoose = require('mongoose')
const photoSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    url: {
        type: String
    },
    isApproved: {
        type: Boolean,
        default: null,
        index: true
    },
    albumId: {
        type: mongoose.Schema.Types.ObjectId
    },
    created: {
        type: Date,
        default: Date.now
    },
    isDelete: {
        type: Boolean,
        default: false
    }

})
class OpareDb {
    constructor(){
        this.photoModel = mongoose.model('photo', photoSchema)
    }
    async getPhotosByAlbumIdCount(albumId){
        return photoModel.count({
            albumId,
            isApproved: true,
            isDelete: false
        })
    }
}
class Photo extends OpareDb {
    constructor(){
        super();
    }
}
module.exports = new Photo();