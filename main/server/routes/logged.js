const express = require('express');
const router = express.Router();
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

//importing database schema
const Complaint = require('../models/complaints_db');
const User = require('../models/users_db');



//check login middleware
const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token,jwtSecret);
        req.userId = decoded.userId;
        req.role = decoded.role;
        
        next();
    }catch(error){
        return res.status(401).json({message: 'Unauthorized-2'});
    }

}

//middleware----check if student is trying to enter /admin 
const authAdminMiddleware = (req,res,next)=>{
    const role = req.role;
    if(role !== 'admin' ){
        res.status(403).json({message:'unauthorised (youre not admin)'});
    }
    next();
}


//GET
//Admin dashboard
router.get('/admin' , authMiddleware, authAdminMiddleware, async (req,res)=>{
    const local = {
        title : "Admin",
        descrip : "This is a mess complaints and resolving site"
    }
    try{

        const token = req.cookies.token;
        const decoded = jwt.verify(token,jwtSecret);
        
        const admin = await User.findById({_id: decoded.userId });
        
        res.render("Admin/admin", {local,admin});   
    }catch(error){
        console.log(error);
    }
});




//GET
//Student dashboard
router.get('/student' , authMiddleware, async (req,res)=>{
    
    try{
        const local = {
            title : "Student",
            descrip : "This is a mess complaints and resolving site"
        }

        const token = req.cookies.token;
        const decoded = jwt.verify(token,jwtSecret);
        
        const student = await User.findById({_id: decoded.userId });
        const complaints = await Complaint.find().sort({registeredAt : -1});
        
        res.render("Student/student", {local, complaints, student});   
    }catch(error){
        console.log(error);
    }
});


//GET
//Complaint registration page
router.get('/student/register' , authMiddleware, (req,res)=>{
    res.render('Student/reg_complaint');
});


//POST
//Complaint
router.post('/reg-complaint',authMiddleware, async (req,res)=>{
    try{

        try{
            const newComplaint = new Complaint({
                hostel: req.body["hostelDropdown"],
                year: req.body["yearDropdown"],
                subject: req.body.subject,
                description: req.body.description
            });

            // await Complaint.create(newComplaint);
            const registered = await newComplaint.save();
            res.redirect("/reg-success");

        }catch(error){
            res.status(500).json({message:"Internal Server error"});
            
        }

    }catch(error){
        console.log(error);
    }
});


//GET
//Complaint registered succesfully page
router.get('/reg-success', authMiddleware, (req,res)=>{
    res.render('Student/reg-success');
})





//Get
//admin or student logout
router.get('/logout', (req,res)=>{
    res.clearCookie('token');
 
    res.redirect('/');
 });



module.exports = router;