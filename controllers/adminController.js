const AdminModel = require('../models/adminModel');
const bcrypt = require('bcrypt')
const CategoryModel = require('../models/categoryModel');
const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const bannerModel = require('../models/bannerModel');
const orderModel = require('../models/orderModel');
const moment = require("moment");
const addressModel = require('../models/addressModel')
const Razorpay = require('razorpay');

module.exports = {

    //signin page
    signin: (req, res) => {
        res.render('admin/signin')
    },
    adminhome: async (req, res) => {
        const totalOrder = await orderModel.find({}).count()
        const totalProducts = await ProductModel.find({}).count()
        const totalCategory = await CategoryModel.find({}).count()
        const totalUser = await UserModel.find({}).count()
        res.render('admin/Home', { totalUser, totalProducts, totalOrder, totalCategory })
    },

    //login
    adminlogin: async (req, res) => {
        //Admin Dashboard       
        const { email, password } = req.body;
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.redirect('/admin');
        }
        const isMatch = await
            bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.redirect('/admin');
        }
        res.redirect('/admin/home')
    },

    //add product
    productpage: async (req, res) => {
        const category = await CategoryModel.find()
        res.render('admin/addproduct', { category })
    },

    viewproducts: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const items_per_page = 3;
        const totalproducts = await ProductModel.find().countDocuments()
        console.log(totalproducts);
        const products = await ProductModel.find({}).populate('type', 'categoryName').sort({ date: -1 }).skip((page - 1) * items_per_page).limit(items_per_page)
        res.render('admin/viewproducts', { products, index: 1, page, hasNextPage: items_per_page * page < totalproducts, hasPreviousPage: page > 1, PreviousPage: page - 1 })
    },

    // Addproduct with image
    addproduct: async (req, res) => {
        const { productName, type, seating, quantity, discription, price, status } = req.body;
        const image = req.file;
        const newProduct = ProductModel({
            productName,
            type,
            seating,
            quantity,
            discription,
            price,
            image: image.filename,
            status,
        });
        await newProduct
            .save()
            .then(() => {
                res.redirect("/admin/viewproducts");
            })
            .catch((err) => {
                this.console.log(err.message);
                res.redirect("/admin/addproductpage")
            });
    },

    editproduct: async (req, res) => {
        let id = req.params.id
        let product = await ProductModel.findOne({ _id: id }).populate('type')
        let category = await CategoryModel.find()
        res.render('admin/editproduct', { category, product })
    },

    //update products when edit
    updateproduct: async (req, res) => {
        const { productName, type, seating, quantity, discription, price, image, status } = req.body;
        if (req.file) {
            let image = req.file;
            await ProductModel.findByIdAndUpdate(
                { _id: req.params.id }, { $set: { image: image.filename } }
            );
        }
        let details = await ProductModel.findByIdAndUpdate(
            { _id: req.params.id }, { $set: { productName, type, seating, quantity, discription, price, image, status } }
        );
        await details.save().then(() => {
            res.redirect('/admin/viewproducts')
        })
    },

    category: async (req, res) => {
        let category = await CategoryModel.find();
        res.render('admin/wooden', { category })
    },

    addcategory: async (req, res) => {
        const newCategory = CategoryModel(req.body);
        console.log("hello")
        console.log(req.body)
        try {
            await newCategory.save()
            res.redirect("/admin/category")
        } catch (err) {
            console.log(err)
            res.redirect("/admin/category")
        }
    },
    deletecategory: async (req, res) => {
        let id = req.params.id;
        //console.log("delete")
        await CategoryModel.findByIdAndDelete({ _id: id });
        res.redirect("/admin/category")
    },
    alluser: async (req, res) => {
        const name = await UserModel.find({})
        res.render('admin/alluser', { name, index: 1 })
    },

    //User Block and Unblock
    blockUser: async (req, res) => {
        const id = req.params.id
        await UserModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Blocked" } })
            .then(() => {
                res.redirect("/admin/alluser")
            })
    },

    unblockUser: async (req, res) => {
        const id = req.params.id
        await UserModel.findByIdAndUpdate({ _id: id }, { $set: { status: "Unblocked" } })
            .then(() => {
                res.redirect('/admin/alluser')
            })
    },


    //Soft Delete
    //Product List and Unlist
    listProduct: async (req, res) => {
        const id = req.params.id
        await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { update: true } })
            .then(() => {
                res.redirect("/admin/viewproducts")
            })
    },

    unlistProduct: async (req, res) => {
        const id = req.params.id
        await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { update: false } })
            .then(() => {
                res.redirect('/admin/viewproducts')
            })
    },

    //Add Banners
    addBannerpage: async (req, res) => {
        res.render('admin/addbanner')
    },

    viewBannerPage: async (req, res) => {
        const banners = await bannerModel.find({})
        console.log(banners)
        res.render('admin/viewbannerpage', { banners, index: 1 })
    },

    addBanner: async (req, res) => {
        const { bannerName, discription } = req.body
        const image = req.file;
        const newBanner = bannerModel({
            bannerName,
            discription,
            image: image.filename,
        });
        await newBanner
            .save()
            .then(() => {
                res.redirect("/admin/viewbannerpage");
            })
            .catch((err) => {
                console.log(err.message);
                res.redirect("/admin/bannerpage")
            })
    },

    //Soft Delete
    //Banner List and Unlist
    listBanner: async (req, res) => {
        const id = req.params.id
        await bannerModel.findByIdAndUpdate({ _id: id }, { $set: { update: true } })
            .then(() => {
                res.redirect("/admin/viewbannerpage")

            })
    },
    unlistBanner: async (req, res) => {
        const id = req.params.id
        await bannerModel.findByIdAndUpdate({ _id: id }, { $set: { update: false } })
            .then(() => {
                res.redirect('/admin/viewbannerpage')
            })
    },

    orderManagement: async (req, res) => {
        const now = new Date();
        const expected_delivery_date = now.setDate(now.getDate() + 7);
        const userId = req.session.userId;
        const orders = await orderModel.find({})
        .populate('productIds.productId')
        res.render('admin/allOrders', { login: req.session.login, orders, moment, expected_delivery_date })
    },

    //change status
    changeStatus: async (req, res) => {
        const { status, orderId, prodId } = req.body;
        if (status == 'Order Confirmed') {
            await orderModel.findOneAndUpdate(
                { _id: orderId, "productIds.productId": prodId }, {
                $set: { "productIds.$.status": "Packed" },
            }
            );
        } else if (status == "Packed") {
            await orderModel.findOneAndUpdate(
                { orderId, "productIds.productId": prodId },
                {
                    $set: { "productIds.$.status": "Shipping" },
                }
            );
        } else if (status == "Shipping") {
            await orderModel.findOneAndUpdate(
                { orderId, "productIds.productId": prodId },
                {
                    $set: { "productIds.$.status": "Delivered" },
                }
            );
        } else {
            await orderModel.findOneAndUpdate(
                { orderId, "productIds.productId": prodId },
                {
                    $set: { "productIds.$.status": "Canceled" },
                }
            );
        }
        res.json()
    }
}





















