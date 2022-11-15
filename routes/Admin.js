const express = require('express');
const router = express.Router()

const controller = require('../controllers/adminController')


// GET METHOD
router.get('/', controller.signin)
router.get('/home',controller.adminhome)
router.get('/addproductpage',controller.productpage)
router.get('/viewproducts',controller.viewproducts)
router.get('/category',controller.category)
router.get('/alluser',controller.alluser)



//post method


router.post('/adminlogin',controller. adminlogin)
router.post('/addproduct',controller.addproduct)
router.post('/addcategory',controller.addcategory)

router.post('/deletecategory/:id',controller.deletecategory)

router.post('/blockUser/:id',controller.blockUser)
router.post('/unblockUser/:id',controller.unblockUser)

router.post('/deleteproducts/:id',controller.deleteproducts)

router.post('/updateproduct/:id',controller.updateproduct)
router.post('/editproduct/:id',controller.editproduct)











module.exports = router