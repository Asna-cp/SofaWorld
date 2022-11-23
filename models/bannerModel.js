const mongoose = require('mongoose');
const objectid = mongoose.Types.ObjectId
const bannerSchema = new mongoose.Schema({
    
    bannerName: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Active'
    },
     update: {
        type : Boolean,
        default : true
    }
})

module.exports = bannerModel = mongoose.model('BannerData',bannerSchema);