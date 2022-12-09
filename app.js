const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('./configuration/connection');
const session = require('express-session');
const userRoute = require('./routes/User');
const adminRoute = require('./routes/Admin')
const multer = require('multer')
const nodemailer = require('nodemailer');
const { createBrotliCompress } = require('zlib');
const app = express()

// set view engine
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Multer (file upload)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
        console.log(file.fieldname + Date.now() + path.extname(file.originalname));
    },
});
app.use(multer({ storage: storage }).single("image"))

//session
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
}))

//cache control
app.use((req, res, next) => {
    res.set("cache-control", "private,no-store,must-revalidate");
    next();
})

// USER ROUTE
app.use("/", userRoute);

// ADMIN ROUTE
app.use("/admin", adminRoute);



















// Start Server
app.listen(3000, () => {
    console.log('Server Started')
})



