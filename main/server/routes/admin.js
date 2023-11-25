const express = require('express');
const router = express.Router();
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

//importing database schema
const Complaint = require('../models/complaints_db');
const User = require('../models/users_db');
const Menu = require('../models/menu_db');

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
};

//middleware----check if student is trying to enter /admin 
const authAdminMiddleware = (req,res,next)=>{
    const role = req.role;
    if(role !== 'admin' ){
        res.status(403).json({message:'unauthorised (youre not admin)'});
    }
    next();
};


//GET
//Admin About page
router.get('/admin/about', authMiddleware, authAdminMiddleware, async (req,res)=>{
    try{ 
        const token = req.cookies.token;
        const decoded = jwt.verify(token,jwtSecret);
        
        const admin = await User.findById({_id: decoded.userId });
         const menu = await Menu.find({hostel: req.params.hostel});

         
         res.render('Admin/about', {menu,admin});
         
    }catch(error){
         console.log(error);
    }
});


//GET
//Admin menu
router.get('/admin/menu/:hostel' ,authMiddleware, authAdminMiddleware ,async (req,res)=>{
    
    try{ 
        const token = req.cookies.token;
        const decoded = jwt.verify(token,jwtSecret);
        
        const admin = await User.findById({_id: decoded.userId });
        const menu = await Menu.find({hostel: req.params.hostel}).sort({number: 1});


         
         res.render('Admin/menu', {menu,admin, hostel: req.params.hostel});
         
    }catch(error){
         console.log(error);
    }
    
});


//POST
//Edit and update Menu
router.post('/updateData', async (req, res) => {
    const { rowId, newData } = req.body;

    try {
      const result = await Menu.updateOne({ _id: rowId }, { $set: newData });

      if (result.modifiedCount > 0) {
        res.send('Data updated successfully');
      } else {
        res.status(400).send('No data updated');
      }
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).send('Internal Server Error');
    }
  });



//GET
//Admin Complaints
router.get('/admin/complaints' ,authMiddleware,authAdminMiddleware ,async (req,res)=>{
    
  try{
      
      const token = req.cookies.token;
      const decoded = jwt.verify(token,jwtSecret);
      
      const admin = await User.findById({_id: decoded.userId })

      const complaints = await Complaint.find().sort({registeredAt : -1});
      res.render('Admin/resolve-complaints', {complaints, admin});
       
  }catch(error){
       console.log(error);
  }
  
});



//POST
  //resolve btn check route
router.post('/resolved/check/:complaintId', async (req, res) => {
  const complaintId = req.params.complaintId;

  try {
    const complaint = await Complaint.findById(complaintId);
  

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    
    if (complaint.status === 'Pending') {

      res.json({
        status:'Pending',
        wasResolved: false,
      });
    } 
    else {
      
     
      return res.json({
        status : 'Resolved',
        wasResolved: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//POST
//toggle resolve button
router.post('/toggleResolve/:complaintId', async (req, res) => {
  const complaintId = req.params.complaintId;

  try {
    const complaint = await Complaint.findById(complaintId);

    const token = req.cookies.token;
    const decoded = jwt.verify(token,jwtSecret);
      
    const userId = decoded.userId;
  

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    
    if (complaint.status === 'Pending') {
      
       await Complaint.updateOne({ "_id": complaint._id }, { $set: { "status": "Resolved" } });

      res.json({
        message: 'Resolved successfully',
        status:'Resolved',
        wasResolved: false,
      });
    } else {
      
      await Complaint.updateOne({ "_id": complaint._id }, { $set: { "status": "Pending" } });

      return res.json({
        message: 'undo resolved successfully',
        status : 'Pending',
        wasResolved: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;



