require('dotenv').config();

const express = require('express');
const cookiParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');


const app = express();
const port = process.env.PORT || 3000;

//connecting database js file
const connectDB = require('./server/config/db');
connectDB();

//using middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookiParser());

//session for cookies and token
app.use(session({
    secret: 'keyoard cat',
    resave : false,
    saveUninitialized : true,
    store: MongoStore.create({
        mongoUrl : process.env.MONGODB_URI
    })
}))

//static public folder
app.use(express.static('public'));

//view engine setup
app.set('view engine' , 'ejs');

//connecting other routes
app.use('/', require('./server/routes/landing'));
app.use('/', require('./server/routes/logged'));
app.use('/', require('./server/routes/student'));
app.use('/', require('./server/routes/admin'));



//setting port
app.listen(port , ()=>{
    console.log(`server is running on port ${port}`);
})