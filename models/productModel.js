const mongoose = require('mongoose')
const Objectid = mongoose.Types.ObjectId

const productSchema = new mongoose.Schema({
    productName: {
        type : String,
        required : true
    },
    type: {
        type : Objectid,
        required : true,
        ref: "CategoryDatas"
    },
    seating: {
        type : Number,
        required : true
    },
    quantity: {
        type : Number,
        required : true
    },
    discription: {
        type : String,
        required : true
    },
    price: {
        type : Number,
        required : true
    },
    image: {
        type : String,
        required : true
    },
    status: {
        type : String,
        required : true
    }, 
     update: {
        type : Boolean,
        default : true
    }
    // isDeleted:{
    //     type:Boolean,
    //     default:false
    // }
    

})


module.exports = ProductModel = mongoose.model('ProductData',productSchema)


