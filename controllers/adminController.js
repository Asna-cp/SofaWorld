const AdminModel = require('../models/adminModel');
const bcrypt = require('bcrypt')
const CategoryModel = require('../models/categoryModel');
const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');
const bannerModel = require('../models/bannerModel');




module.exports = {

    //signin page
    signin: (req, res) => {
        res.render('admin/signin')
    },
    adminhome: (req, res) => {
        res.render('admin/Home')
    },


    //login
    adminlogin: async (req, res) => {
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
        const products = await ProductModel.find({}).populate('type', 'categoryName').sort({ date: -1}).skip((page - 1) * items_per_page).limit(items_per_page)
        res.render('admin/viewproducts', { products, index: 1, page,hasNextPage: items_per_page * page < totalproducts,hasPreviousPage: page > 1,PreviousPage: page - 1 })
    },


    // Addproduct with image

    addproduct: async (req, res) => {
        // const newProduct = ProductModel(req.body);
        // console.log(req.body)
        // try {
        //     await newProduct.save()
        //     res.redirect("/admin/home")
        // } catch {
        //     console.log(err,'error')
        //     res.redirect("/admin/home")
        // }



        const { productName, type, seating, quantity, discription, price, status } = req.body;

        const image = req.file;
        console.log(image);

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

        console.log(newProduct)
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

    editproduct: async(req,res) => {
        let id = req.params.id
        let product = await ProductModel.findOne({_id:id}).populate('type')
        let category = await CategoryModel.find()

        console.log(product);
        
        
        res.render('admin/editproduct',{category,product})


    },
     
    //update products when edit


    updateproduct: async (req,res) => {
        const { productName,type,seating,quantity,discription,price,image,status } = req.body;
        console.log(req.body);

        if(req.file) {
            let image = req.file;
            await ProductModel.findByIdAndUpdate(
                {_id:req.params.id}, {$set: {image: image.filename}}
            ); 

        }
        let details = await ProductModel.findByIdAndUpdate(
            {_id: req.params.id}, {$set: { productName,type,seating,quantity,discription,price,image,status}}
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

    //DELETE PRODUCTS
    // deleteproducts: async (req, res) => {
    //     let id = req.params.id;
    //     //console.log("delete")
    //     await ProductModel.findByIdAndDelete({ _id: id });
    //     res.redirect("/admin/viewproducts")
    // },

    



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

    addBannerpage: async (req,res) => {
      
        res.render('admin/addbanner')
    },

    viewBannerPage: async (req,res) => {
        const banners = await bannerModel.find({})
        console.log(banners)
        res.render('admin/viewbannerpage', { banners,index:1 })
    },

    addBanner: async (req,res) => {
        const { bannerName, discription } = req.body

        const image = req.file;
        console.log(image);

        const newBanner = bannerModel({
            bannerName,
            discription,
            image: image.filename,
        });
        console.log(newBanner);

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

    
   


    // deleteproducts: (id) => {
    //     return new Promise(async (resolve,reject) => {
    //         await ProductModel.findByIdAndUpdate({ _id: id }, { $set: { isDeleted: true } })
    //         resolve()
    //     })
    // },

    // deleteproduct: () => {
    //     return new Promise(async (resolve,reject) => {
    //         let product = await ProductModel.find({ isDeleted: true}).populate('category')
    //         resolve(product)
    //     })
    // },

    // restoreProduct: (id) => {
    //     return new Promise(async (resolve, reject) => {
    //         await ProductModel.findByIdAndUpdate({ _id: id }, { $set: {isDeleted: false}})
    //     })
    // }





    // addproduct: async(req,res) => {
    //     console.log(req.body)
    //     const { category } = req.body
    //     const newCategory = await categoryModel({category})
    //     await newCategory.save()
    //     .then(()=>{

    //         res.redirect('/admin/addproduct')
    //     })
    //     .catch(()=>{
    //         console.log("not wor")
    //     })
    // }
};





















