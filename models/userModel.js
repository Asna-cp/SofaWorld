const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    fullName: {
        type : String,
        required : true
    },
    userName: {
        type : String,
        required : true
    },
    phoneNumber: {
        type : Number,
        required : true
    },
    email: {
        type : String,
        required : true,
        unique : true
       
    },
    password: {
        type : String,
        required : true
    },
    status: {
        type : String,
        default : 'Unblocked'
    }

})


module.exports = UserModel = mongoose.model('UserData',userSchema)