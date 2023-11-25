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


//GET
//Student About page
router.get('/student/about', authMiddleware, async (req,res)=>{
    try{
        //const menu = await Menu.find({hostel: req.params.hostel});
        const token = req.cookies.token;
       const decoded = jwt.verify(token,jwtSecret);
       
       const student = await User.findById({_id: decoded.userId })

        
        res.render('Student/about', { student});
        
   }catch(error){
        console.log(error);
   }
})


//GET
//student all complaints
router.get('/student/complaints' ,authMiddleware ,async (req,res)=>{
    
    try{
         const locals = {
            title:'Dashboard',
            description : 'ehaaaaaaaahhh'
         }
        const token = req.cookies.token;
        const decoded = jwt.verify(token,jwtSecret);
        
        const student = await User.findById({_id: decoded.userId })

        const complaints = await Complaint.find().sort({registeredAt : -1});
        res.render('Student/see-complaints', {locals, complaints,student});
         
    }catch(error){
         console.log(error);
    }
    
});




//GET
//student see menu
router.get('/student/menu/:hostel' ,authMiddleware ,async (req,res)=>{
    
    try{
         const menu = await Menu.find({hostel: req.params.hostel});
         const token = req.cookies.token;
        const decoded = jwt.verify(token,jwtSecret);
        
        const student = await User.findById({_id: decoded.userId })

         
         res.render('Student/see-menu', {menu, student,hostel: req.params.hostel});
         
    }catch(error){
         console.log(error);
    }
    
});


//POST
//Upvote
// router.post('/#/:complaintId', async (req, res) => {       
//     const complaintId = req.params.complaintId;
  
//     try {

//         const token = req.cookies.token;
//         const decoded = jwt.verify(token,jwtSecret);
        
//         const student = await User.findById({_id: decoded.userId });

//         if (!student.upvotedComplaints.includes(complaintId)){
//             await User.findByIdAndUpdate(student._id, { $push: { upvotedComplaints: complaintId } });

//             const updatedComplaint = await Complaint.findByIdAndUpdate(complaintId, {
//                 $inc: { upvote: 1 },
//               }, { new: true });

//               res.json({ upvotes: updatedComplaint.upvote });
//         }else {
//             // If the user has already upvoted, respond accordingly
//             res.status(400).json({ message: 'Already upvoted' });
//         }

//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });


//POST
  //upvote check route
  router.post('/upvote/check/:complaintId', async (req, res) => {
    const complaintId = req.params.complaintId;
  
    try {
        const complaint = await Complaint.findById(complaintId);
        const token = req.cookies.token;
        const decoded = jwt.verify(token,jwtSecret);
        
        const userId = decoded.userId;

        const userIndex = await complaint.upvotes.findIndex((upvote) => upvote.userId === userId);


        if (userIndex === -1) {
            // User hasn't upvoted, add the upvote
      
            res.json({
              hasUpvoted: false,
            });

          } else {
            // User has upvoted, remove the upvote
            res.json({
              hasUpvoted: true,
            });
          }

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



//POST
//toggle upvote button
router.post('/toggleUpvote/:complaintId', async (req, res) => {
    const complaintId = req.params.complaintId;
  
    try {
      const complaint = await Complaint.findById(complaintId);
      const token = req.cookies.token;
      const decoded = jwt.verify(token,jwtSecret);
        
      const userId = decoded.userId;
    

      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
  
   
         const userIndex = await complaint.upvotes.findIndex((item) => item.userId === userId);
      
      if (userIndex === -1) {
        
         await complaint.updateOne({ $addToSet: { upvotes: { userId: userId }} });

         const updatedComplaint = await Complaint.findByIdAndUpdate(complaintId, {
            $inc: { upvote: 1 },
          }, { new: true });
  
        res.json({
          message: 'Upvoted successfully',
          upvoteCount: updatedComplaint.upvote,
          isUpvoted: true,
        });
      } else {
        
        await complaint.updateOne({ $pull: { upvotes: { userId: userId } } });

        const updatedComplaint = await Complaint.findByIdAndUpdate(complaintId, {
            $inc: { upvote: -1 },
          }, { new: true });
  
        return res.json({
          message: 'Upvote undone successfully',
          upvoteCount: updatedComplaint.upvote,
          isUpvoted: false,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
 








function insertMenuData(){
    Menu.insertMany([
        //djgh
        {
            hostel: 'KNGH',
            day : 'Monday',
            number: 1,
            meals: [
                {
                    mealType: 'Brekfast',
                    items: 'item 12 , item 22 , item 32'
                },
                {
                    mealType: 'Lunch',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Snacks',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Dinner',
                    items: 'item 1, item 2, item 3'
                }
            ]
        },
        {
            hostel: 'KNGH',
            day : 'Tuesday',
            number: 2,
            meals: [
                {
                    mealType: 'Brekfast',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Lunch',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Snacks',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Dinner',
                    items: 'item 1, item 2, item 3'
                }
            ]
        },
        {
            hostel: 'KNGH',
            day : 'Wednesday',
            number: 3,
            meals: [
                {
                    mealType: 'Brekfast',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Lunch',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Snacks',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Dinner',
                    items: 'item 1, item 2, item 3'
                }
            ]
        },
        {
            hostel: 'KNGH',
            day : 'Thursday',
            number: 4,
            meals: [
                {
                    mealType: 'Brekfast',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Lunch',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Snacks',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Dinner',
                    items: 'item 1, item 2, item 3'
                }
            ]
        },
        {
            hostel: 'KNGH',
            day : 'Friday',
            number: 5,
            meals: [
                {
                    mealType: 'Brekfast',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Lunch',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Snacks',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Dinner',
                    items: 'item 1, item 2, item 3'
                }
            ]
        },
        {
            hostel: 'KNGH',
            day : 'Saturday',
            number: 6,
            meals: [
                {
                    mealType: 'Brekfast',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Lunch',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Snacks',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Dinner',
                    items: 'item 1, item 2, item 3'
                }
            ]
        },
        {
            hostel: 'KNGH',
            day : 'Sunday',
            number: 7,
            meals: [
                {
                    mealType: 'Brekfast',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Lunch',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Snacks',
                    items: 'item 1, item 2, item 3'
                },
                {
                    mealType: 'Dinner',
                    items: 'item 1, item 2, item 3'
                }
            ]
        }  
    ])
}





//insertMenuData();

















module.exports = router;