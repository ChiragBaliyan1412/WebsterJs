const express = require('express');
const router = express.Router();
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

//importing database schema
const Complaint = require('../models/complaints_db');
const User = require('../models/users_db');


//GET
//Landing Page render
router.get('' , async (req,res)=> {
    const local = {
        title : "Imperial Mess",
        descrip : "This is a mess complaints and resolving site"
    }
    try{
        
        res.render("Guest/landing", {local});   
    }catch(error){
        console.log(error);
    }
});


//GET
//Login page
router.get('/login', (req,res)=>{
    
    res.render("Guest/login");
})


//GET
//Signup page
router.get('/signup', (req,res)=>{
    
    res.render("Guest/signup");
})


//POST
//signing up
router.post('/signup', async (req,res)=>{
    
    try{
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const role = req.body.selectedOption;

        //hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        try{
               const user = await User.create({username, password: hashedPassword , email, role});
               res.redirect('/login');
        }catch(error){
               if(error.code ===11000){
                   res.status(409).json({message: 'user already in use'});
               }
               
               console.log(error);
               res.status(500).json({message:'Internal server error'});
        }



    }catch(error){
        console.log(error);
    }
});



//POST
//Logging in
router.post('/login', async (req,res)=>{
    
    try{
        const {username, password} = req.body;

        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message: 'invalid credentials 1'}); 
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: 'invalid credentials 2'}); 
        }

        const token = jwt.sign({userId: user._id, role: user.role}, jwtSecret);
        res.cookie('token', token, {httpOnly:true});
         

        if(user.role === 'admin'){
            res.redirect("/admin");
        }else{
            res.redirect('/student');
        }
        

    }catch(error){
        console.log(error);
    }
});


//GET
//Render about us page
router.get('/about', (req,res)=>{
    res.render('Guest/about');
});




module.exports = router;























// function insertPostData(){
//     Complaint.insertMany([
        
//         {
//             title: "goli beta",
//             body: "masti nahi"
//         },
//         {
//             title: "goli beta",
//             body: "masti nahi"
//         }
//     ])
// }

// insertPostData();