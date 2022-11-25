const UserModel = require('../models/userModel');
const productModel = require('./../models/productModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const wishlistModel = require('../models/wishlistModel');
const cartModel = require('../models/cartModel');
const categoryModel = require('../models/categoryModel');
const { default: mongoose } = require('mongoose');


//Email otp


var FullName;
var UserName;
var PhoneNumber;
var Email;
var Password;


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',

    auth: {
        user: 'projectsofa22@gmail.com',
        pass: 'zejkjbknophwryvz',
    }
});

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);





module.exports = {






    // HOME PAGE
    home: async (req, res) => {
        const banners = await bannerModel.find({})
        //res.send("you just created  a user ")
        if (req.session.userLogin) {
            const userId = req.session.userId

            const type = await categoryModel.find()
            const banners = await bannerModel.find({ update: true })


            res.render("user/home", { login: true, user: req.session.user, banners, type, userId })
        } else {
            const userId = req.session.userId
            const type = await categoryModel.find()
            const banners = await bannerModel.find({ update: true })


            res.render('user/home', { login: false, banners, user: "", type, userId });
        }
    },

    // signin page
    signin: (req, res) => {
        res.render('user/signin')
    },

    //Otp

    otp: async (req, res) => {

        FullName = req.body.fullName
        UserName = req.body.userName
        PhoneNumber = req.body.phoneNumber
        Email = req.body.email
        Password = req.body.password


        const user = await UserModel.findOne({ email: Email })

        if (!user) {
            // send mail with defined transport object
            var mailOptions = {
                to: req.body.email,
                subject: "Otp for registration is: ",
                html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                res.render('user/email');
            });
        }
        else {
            res.redirect('/loginpage')
        }
    },

    resendotp: (req, res) => {
        var mailOptions = {
            to: email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.render('otp', { msg: "otp has been sent" });
        });
    },


    verifyotp: (req, res) => {
        if (req.body.otp == otp) {
            const newUser = UserModel({
                fullName: FullName,
                userName: UserName,
                email: Email,
                phoneNumber: PhoneNumber,
                password: Password
            });

            console.log(req.body);
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(() => {
                            res.redirect("/loginpage");
                        })
                        .catch((err) => {
                            console.log(err);
                            res.redirect("/loginpage")
                        })
                })
            })

        }
        else {
            res.render('otp', { msg: 'otp is incorrect' });
        }
    },

    //signup 
    // signup: (req, res) => {
    //     const newUser = UserModel(req.body);

    //     console.log(req.body);
    //     bcrypt.genSalt(10, (err, salt) => {
    //         bcrypt.hash(newUser.password, salt, (err, hash) => {
    //             if (err) throw err;
    //             newUser.password = hash;
    //             newUser
    //                 .save()
    //                 .then(() => {
    //                     res.redirect("/loginpage");
    //                 })
    //                 .catch((err) => {
    //                     console.log(err);
    //                     res.redirect("/loginpage")
    //                 })
    //         })
    //     })
    // },

    //Login
    login: async (req, res) => {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ $and: [{ email: email }, { status: "Unblocked" }] });
        if (!user) {
            return res.redirect('/loginpage');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.redirect('/loginpage');
        }
        req.session.user = user.userName;
        req.session.userId = user._id;
        req.session.userLogin = true;
        const userId = req.session.userId
        const banners = await bannerModel.find({ update: true })
        const type = await categoryModel.find()

        res.render('user/home', { login: true, user: user.userName, type, banners, userId });

    },

    logout: (req, res) => {
        req.session.loggedOut = true;
        req.session.destroy();
        res.redirect('/');
    },

    //Session middleWare

    userSession: (req, res, next) => {
        if (req.session.userLogin) {
            next()
        } else {
            res.redirect('/loginpage')
        }
    },

    //view the products in productpage

    productpage: async (req, res) => {

        if (req.session.userLogin) {
            const products = await productModel.find({}).populate('type', 'categoryName').lean()
            const userId = req.session.id



            res.render('user/productpage', { login: true, user: req.session.user, products, userId })
        } else {

            res.render('user/home', { login: false });
        }

    },

    productdetails: async (req, res) => {


        prodt = req.params.id;
        const userId = req.session.id
        const products = await productModel.findById({ _id: req.params.id }).populate('type')
       

        res.render('user/productdetails', { login: true, user: req.session.user, products, userId })
    },

    wishListPage: async (req, res) => {
        // let products
        // const userId = req.session.id
        // const wishlist = await wishlistModel.findOne({ userId : userId }).populate('productIds')
        // console.log(userId)
        // console.log(wishlist)
        // if (wishlist) {
        //     products = wishlist.productIds
        //     res.render('user/wishlist', { login: true, user: req.session.user,wishlist })
        // } 
        const userId = req.session.userId;
        return new Promise(async (resolve, reject) => {
            let list = await wishlistModel.findOne({ userId: userId }).populate('productIds')
            if (list != null) {
                list = list.productIds
            }
            else {
                list = []
            }
            resolve(list)
        }).then((list) => {
            res.render('user/wishlist', { login: true, user: req.session.user, list })
        })
    },

    //Add to Wishlist

    addtowishlist: async (req, res) => {
        let productId = req.params.productId
        let userId = req.session.userId  //user id
        let wishlist = await wishlistModel.findOne({ userId })
        if (wishlist) {
            await wishlistModel.findOneAndUpdate({ userId: userId }, { $addToSet: { productIds: productId } })
            res.redirect('/productpage')
        }
        else {
            const newwishlist = new wishlistModel({ userId, productIds: [productId] })
            newwishlist.save()
                .then(() => {
                    res.redirect('/productpage')
                })
        }
    },


    removewishlistproduct: async (req, res) => {
        const id = req.params.id;
        let userId = req.session.userId;
        await wishlistModel.findOneAndUpdate({ userId }, { $pull: { productIds: id } })
            .then(() => {
                res.redirect("/wishListPage")
            })
    },

    // Cart products

    cart: async (req, res) => {

        const userId = req.session.userId;
       
        const cartlist = await cartModel.findOne({ userId }).populate("productIds.productId");
        
        if (cartlist != null) {
            const cart = cartlist.productIds
            // console.log("cart id" + cart);
            if (req.session.userLogin) {
                res.render('user/cart', { login: true, user: req.session.user, cart, cartlist })
            }
        } else {
            res.render('user/cart', { login: false, cart:[] })
        }
    },
  

    addtocart: async (req, res) => {
        let productId = req.params.id
        let userId = req.session.userId
        let cart = await cartModel.findOne({ userId })
        console.log(cart);
        if (cart) {
            await cartModel.findOneAndUpdate({ userId, 'productIds.productId':productId }, {$inc:{"productIds.$.quantity":1}})
            res.redirect('/productpage')
        }
        else {
            const newcart = new cartModel({ userId, productIds: [{ productId }] })
            newcart.save()
                .then(() => {
                    res.redirect('/productpage')
                })
        }
    },

     removecartproduct: async (req,res) => {
        const userId = req.session.userId;
        console.log(userId);
        const productId = req.params.id;
        // const productQty = req.params.proQty;
        // const cart = await cartModel.findOne({ userId });
        // const product = await productModel.findOne({ _id: productId });
        // const product_price = product.price;
        // const cart_total = cart.cartTotal;
        // const final_total = Math.abs(totalPrice);
        // const totalPrice = cart_total - product_price * productQty;
        // await cartModel.updateOne({ userId }, { $set: { cartTotal: final_total } });
       
        await cartModel.updateOne({ userId }, { $pull: { productIds: { productId } } });
        res.redirect("back");
      
        
     },
     quantityIncrement: async (req,res) => {
        let userId = req.session.userId;
        let productId = req.params.id;
        let product = await productModel.findById(productId)
        const cart = await cartModel.findOneAndUpdate({userId,'productIds.productId':productId},{$inc:{"productIds.$.quantity":1,
    "products.$.total":product.price,cartTotal:product.price}})
    res.redirect("back")
    },

     quantityDecrement: async (req,res) => {
     let userId = req.session.userId;
     let productId  = req.params.id;
     let product =await productModel.findById(productId)
     const cart = await cartModel.findOneAndUpdate({userId,'products.productId':productId},{$inc:{"productIds.$.quantity":-1,
     "products.$.total":product.price*-1,cartTotal:product.price*-1}})
     res.redirect("back")

    },
     //async (req, res) => {
        //     let userData = req.session.user;
        //     let userId = userData._id;
        //     let id = req.params.id
        //     let price = req.params.price;
        //     let qty = req.params.quantity
        //     console.log(qty);
        //     const amt = price * qty
        //     await cartModel.findOneAndUpdate({ userId: mongoose.Types.ObjectId( userId) }, { $pull: { products: { productId: id } }
        //    , $inc : {cartTotal: -amt}})
        //   .then(() => {
        //     res.redirect("/cartPage");
        //  });
    //     const productId = req.params.id;
    //     let userId = req.session.userId;
    //     await cartModel.updateOne({ userId }, { $pull: { productIds: { productId } } })
        
    //     res.redirect("/cart")
    // },

    categorylisting: async (req, res) => {

        const id = req.params.id
        const products = await productModel.find({ type: id }).populate('type', 'categoryName').lean()
        const userId = req.session.id

        res.render('user/category', { login: true, user: req.session.user, products, userId })
    },


    //     quantityIncrement: async (req, res) => {
    //         let userId = req.session.userId;
    //         console.log(userId)
    //         let productId = req.params.id;
    //         let product = await productModel.findById(productId)
    //         const cart = await cartModel.findOneAndUpdate({userId,'products.productId':productId},{$inc:{"products.$.quantity":1 , "products.$.total":product.price, cartTotal:product.price}})

    //         res.redirect("back")
    //     },



}