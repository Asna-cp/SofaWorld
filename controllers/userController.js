const UserModel = require('../models/userModel');
const productModel = require('./../models/productModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const wishlistModel = require('../models/wishlistModel');
const cartModel = require('../models/cartModel');
const categoryModel = require('../models/categoryModel');
const { default: mongoose } = require('mongoose');
const { checkout } = require('../routes/User');
const addressModel = require('../models/addressModel')


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
        req.session.userstatus = user.status;
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



    //view the products in productpage

    productpage: async (req, res) => {

        if (req.session.userLogin) {
            const products = await productModel.find({}).populate('type', 'categoryName').lean()
            const userId = req.session.userId;


            let list = await wishlistModel.findOne({ userId }).populate('productIds')
            if (list != null) {
                list = list.productIds
            }
            else {
                list = []
            }

            console.log(list);

            res.render('user/productpage', { login: true, user: req.session.user, products, userId, list })
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
                    res.redirect('back')
                })
        }
    },


    removewishlistproduct: async (req, res) => {
        const id = req.params.id;
        let userId = req.session.userId;
        await wishlistModel.findOneAndUpdate({ userId }, { $pull: { productIds: id } })
            .then(() => {
                res.redirect("back")
            })
    },

    // Cart products

    cart: async (req, res) => {

        const userId = req.session.userId;

        const cartlist = await cartModel.findOne({ userId }).populate("productIds.productId");

        if (cartlist != null) {
            const cart = cartlist.productIds
            const cartTotal = cartlist.cartTotal
            // console.log("cart id" + cart);
            if (req.session.userLogin) {
                res.render('user/cart', { login: true, user: req.session.user, cart, cartlist, cartTotal })
            }
        } else {
            res.render('user/cart', { login: false, cart: [] })
        }
    },


    addtocart: async (req, res) => {
        let productId = req.params.proId
        let userId = req.session.userId
        let cart = await cartModel.findOne({ userId: userId })
        const product = await productModel.findOne({ _id: productId })
        const total = product.price

        if (cart) {
            const exist = await cartModel.findOne({ userId, 'productIds.productId': productId })
            if (exist != null) {
                await cartModel.findOneAndUpdate({ userId, 'productIds.productId': productId }, { $inc: { "productIds.$.quantity": 1, "productIds.$.total": total, cartTotal: total } })
            }
            else {
                await cartModel.findOneAndUpdate({ userId: userId }, { $push: { productIds: { productId, total } }, $inc: { cartTotal: total } })
            }
            res.redirect('/productpage')
        }
        else {
            const newcart = new cartModel({ userId, productIds: [{ productId, total }], cartTotal: total })
            await newcart.save()
                .then(() => {
                    res.redirect('/productpage')
                })
        }
    },

    removecartproduct: async (req, res) => {
        const userId = req.session.userId;
        console.log(userId);
        const productId = req.params.id;
        const price = req.params.price
        const quantity = req.params.quantity
        const product = await productModel.findOne({ _id: productId })
        const amt = price * quantity

        await cartModel.findOneAndUpdate({ userId: userId }, { $pull: { productIds: { productId: productId } }, $inc: { cartTotal: -amt } });
        res.redirect("back");


    },
    quantityIncrement: async (req, res) => {

        let userId = req.session.userId;
        let productId = req.params.id;
        let product = await productModel.findOne({ _id: productId })
        const cart = await cartModel.findOneAndUpdate({ userId, 'productIds.productId': productId }, {
            $inc: {
                "productIds.$.quantity": 1,
                "productIds.$.total": product.price,
                cartTotal: product.price
            }
        })
        res.redirect("back")
    },

    quantityDecrement: async (req, res) => {
        let userId = req.session.userId;
        let productId = req.params.id;
        let product = await productModel.findOne({ _id: productId })
        const cart = await cartModel.findOneAndUpdate({ userId, 'productIds.productId': productId }, {
            $inc: {
                "productIds.$.quantity": -1,
                "productIds.$.total": product.price * -1, cartTotal: product.price * -1
            }
        })
        res.redirect("back")

    },


    categorylisting: async (req, res) => {

        const id = req.params.id
        const products = await productModel.find({ type: id }).populate('type', 'categoryName').lean()
        const userId = req.session.id

        res.render('user/category', { login: true, user: req.session.user, products, userId })
    },



    wishlistaddcart: async (req, res) => {
        let productId = req.params.id
        let userId = req.session.userId
        let cart = await cartModel.findOne({ userId })
        console.log(cart);
        if (cart) {
            const exist = await cartModel.findOne({ userId, 'productIds.productId': productId })
            if (exist != null) {
                await cartModel.findOneAndUpdate({ userId, 'productIds.productId': productId }, { $inc: { "productIds.$.quantity": 1 } })
            }
            else {
                await cartModel.findOneAndUpdate({ userId }, { $push: { productIds: { productId } } })
            }
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

    //Place Order

    checkout: async (req,res) => {
        try{
            let index = Number(req.body.index);
            if(!index) {
                index = 0;
            }
            const userId = req.session.userId;
            const addresses = await addressModel.findOne({ userId });
            let address;
            if (addresses) {
                address = addresses.address;
            } else {
                address = [];
            }
            const cartItems = await cartModel.findOne({ userId });
            if (cartItems) {
                res.render("user/checkout", {  login: true, user: req.session.user,address,index,cartItems });

            

            }else{
                res.redirect("/login");
            }
         } catch {
                res.json("something wrong please try again");
            }
        },
   


    profile: async (req, res) => {
        let userId = req.session.userId;

        // let brand = await brandModel.find();
        let users = await UserModel.findOne({ _id: userId });
        let address = await addressModel.findOne({ userId: userId })
        console.log(users+"-------user")
        

        if (address) {
            let address3 = address.address;

            res.render("user/profile", {
                user: req.session.user,
                users,
                address3,
                address,
                index: 1,
                login: true
            });

        } else {

            if (req.session.userLogin) {
                res.render("user/profile", { user: req.session.user,users, address, login: true });
            } else {
                res.redirect('/loginpage')
            }
        }
    },



    addaddress: async (req, res) => {
        let userId = req.session.userId

        if (req.session.userLogin) {
            res.render("user/addaddress", { user: req.session.user, login: true });
        } else {
            res.render("user/addaddress", { login: false });
        }
    },
    newaddress: async (req, res) => {
        const {
            fullName,
            phone,
            houseName,
            city,
            pincode,
            state,
        } = req.body;
        // let UserData = req.session.user;
        let userId = req.session.userId;
        let exist = await addressModel.findOne({ userId: userId })

        if (exist) {
            await addressModel.findOneAndUpdate({
                userId: userId
            }, {
                $push: {
                    address: {
                        fullName,
                        phone,
                        houseName,
                        city,
                        pincode,
                        state,
                    }
                }
            }).then(() => {
                console.log("address added");
                res.redirect("/profile")
            })
        } else {
            const address = new addressModel({
                userId,
                address: [
                    {
                        fullName,
                        phone,
                        houseName,
                        city,
                        pincode,
                        state,

                    }
                ]
            });
            await address.save().then(() => {
                console.log("address added");
                res.redirect("/profile");

            }).catch((err) => {
                res.redirect("/profile");
            })
        }

    },
    deleteAddress: async (req, res) => {
        let userId = req.session.userId;
        let addressId = req.params.id

        let address = await addressModel.findOneAndUpdate(
            { userId: userId },
            { $pull: { address: { _id: addressId } } },
        ).then(() => {
            res.redirect('/profile')
        })

    },
   
}




