const express = require('express');
// const { verifyotp } = require('../controllers/userController');
const router = express.Router()

const controller = require('../controllers/userController')
const userSession = require('../middleware/auth')


// GET METHOD

router.get('/', controller.home)
router.get('/loginpage',controller.signin)
router.get('/logout', controller.logout)
router.get('/productpage',userSession.userSession, controller.productpage)

router.get('/productdetails/:id',userSession.userSession, controller.productdetails)
router.get('/category/:id',controller.categorylisting)

//wishlist
router.get('/addtowishlist/:productId',userSession.userSession, controller.addtowishlist)
router.get('/wishListPage',userSession.userSession, controller.wishListPage)
router.post('/removewishlistproduct/:id',userSession.userSession, controller.removewishlistproduct)

//CART
//router.get('/cart',controller.cart)
router.get('/addtocart/:proId',controller.addtocart)
router.post('/removecartproduct/:id/:price/:quantity',controller.removecartproduct)
router.post('/wishlistaddcart/:id',controller.wishlistaddcart)

router.get('/cart',controller.cart)
// router.get('/checkout',controller.checkout)

router.get('/button-increment/:id',controller.quantityIncrement)
router.get('/button-decrement/:id',controller.quantityDecrement)

router.get('/checkout',controller.checkout)
// router.post('/address/',controller.addaddresspage)


//User profile
router.get('/profile',controller.profile)
router.get('/addaddress',controller.addaddress)
router.post('/addnewaddress',controller.newaddress)



//Email otp verification

// router.get('/loginpage',controller.email)



// POST METHOD

// router.post('/signup',controller.signup)
router.post('/login',controller.login)
router.post('/home',controller.home)

router.post('/send',controller.otp)

router.post('/verify', controller.verifyotp)



module.exports = router