const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({

    categoryName: {
        type : String,
        required: true
    },
   
  

})




module.exports = CategoryModel = mongoose.model('CategoryDatas',categorySchema)