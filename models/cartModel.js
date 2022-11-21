const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId



const cartSchema = new mongoose.Schema({


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

        total: 
        {type:Number}
    }],
    cartTotal : {
        type: Number,
        default: 0
    },

});

module.exports = cartModel = mongoose.model("cart", cartSchema)