// MONGODB CONNECT
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/SofaWorld');
// mongoose.connect('mongodb://localhost:27017/SofaWorld');

const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


// mongodb connect

// mongoose.connect("mongodb+srv://asna:Dg982I6mdNszKPqu@sofaworld.stkr4fw.mongodb.net/test?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true")
// const db = mongoose.connection;
// db.on('error', error => console.error(error))
// db.once('open', () => console.log('Connected to Mongoose'))

// mongodb+srv://safwan_pklr:IoQteMvXR18SeM6u@cluster0.szlgm8q.mongodb.net/CarWorld