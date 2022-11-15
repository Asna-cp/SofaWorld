const express = require('express');
const { verifyotp } = require('../controllers/userController');
const router = express.Router()

const controller = require('../controllers/userController')


// GET METHOD

router.get('/', controller.home)
router.get('/loginpage',controller.signin)
router.get('/logout', controller.logout)
router.get('/productpage',controller.productpage)

//Email otp verification

// router.get('/loginpage',controller.email)



// POST METHOD

// router.post('/signup',controller.signup)
router.post('/login',controller.login)
router.post('/home',controller.home)

router.post('/send',controller.otp)

router.post('/verify', controller.verifyotp)

module.exports = router