const express = require('express');
const { verifyotp } = require('../controllers/userController');
const router = express.Router()

const controller = require('../controllers/userController')


// GET METHOD

router.get('/', controller.home)
router.get('/loginpage',controller.signin)
router.get('/logout', controller.logout)
router.get('/productpage',controller.userSession,controller.productpage)

router.get('/productdetails/:id',controller. userSession,controller.productdetails)

//wishlist
router.get('/addtowishlist/:productId',controller. userSession,controller.addtowishlist)
router.get('/wishListPage',controller.userSession,controller.wishListPage)
router.post('/removewishlistproduct/:id',controller. userSession,controller.removewishlistproduct)

//CART
//router.get('/cart',controller.cart)
router.get('/addtocart/:id',controller.addtocart)
router.post('/removecartproduct/:id',controller.removecartproduct)

router.get('/cart',controller.cart)



//Email otp verification

// router.get('/loginpage',controller.email)



// POST METHOD

// router.post('/signup',controller.signup)
router.post('/login',controller.login)
router.post('/home',controller.home)

router.post('/send',controller.otp)

router.post('/verify', controller.verifyotp)



module.exports = router