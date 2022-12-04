const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId

const orderSchema = new mongoose.Schema({

    userId:{
        type: Objectid,
        required: true,
        ref: 'UserData'
    },
    productIds: [{
        productId:
        {
            type:Objectid,
            ref: 'ProductData'
        },
        quantity:{
            type:Number,
            default:1
        },
        status: {
            type: String,
            default: "Order Confirmed",
          },

        total: 
        {type:Number}
    }],

     address : {
        fullName : {
            type: String,
            required: true
        },
        phone : {
            type: Number,
            required: true
        },
        houseName : {
            type : String,
            required: true
        },
        city : {
            type : String,
            required : true
        },
        pincode : {
            type :String,
            required: true
        },
        state : {
            type : String,
            required : true
        }, 
    },

    grandTotal: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    payment: {
        type: String,
        default: "unpaid"
    },


})
  




module.exports = orderModel = mongoose.model("Orders", orderSchema)
