const UserModel = require('../models/userModel');

const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const wishlistModel = require('../models/wishlistModel')



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
    home: (req, res) => {

        //res.send("you just created  a user ")
        if (req.session.userLogin) {
            res.render("user/home", { login: true, user: req.session.user })
        } else {

            res.render('user/home', { login: false });
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
        else{
            res.redirect('/loginpage')
        }
    },

    resendotp: (req, res ) => {
        var mailOptions={
            to: email,
           subject: "Otp for registration is: ",
           html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
         };
         
         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.render('otp',{msg:"otp has been sent"});
        });
    },


    verifyotp: (req,res) => {
        if(req.body.otp==otp){
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
        else{
            res.render('otp',{msg : 'otp is incorrect'});
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
        res.render('user/home', { login: true, user: user.userName });

    },

    logout: (req, res) => {
        req.session.loggedOut = true;
        req.session.destroy();
        res.redirect('/');
    },

    //view the products in productpage

    productpage: async(req,res) => {

        if (req.session.userLogin) {
            const products = await ProductModel.find({}).populate('type', 'categoryName').lean()
            res.render('user/productpage',{login: true, user: req.session.user, products})
        } else {

            res.render('user/home', { login: false });
        }

    },

    productdetails: async(req,res) => { 


        prodt = req.params.id;
       
        const products = await ProductModel.findById({_id: req.params.id}).populate('type')
        console.log(products);
        
        res.render('user/productdetails',{login: true, user: req.session.user, products})
    },

    //Add to Wishlist

    addtowishlist: async (req,res) => {
        let productId = req.params.productId
        let userId = req.session.userId  //user id
        let wishlist = await wishlistModel.findOne({ userId })

        if (wishlist) {
            await wishlistModel.findOneAndUpdate({ userId: userId }, {$addToSet: {productIds: productId } })
            res.redirect('/productpage')
        }
        else {
            const newwishlist = new wishlistModel({ userId,productIds: [productId] })
            newwishlist.save()
            .then(() => {
                res.redirect('/productpage')
            })
        }
    },

      







}