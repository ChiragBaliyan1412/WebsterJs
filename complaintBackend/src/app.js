const express = require("express");
const multer = require('multer');
const path = require ("path");

const app= express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));


require("./db/conn");
const Complaint= require("./models/complaint_db");



app.get("/" ,(req,res)=> {
    res.render("complaint.ejs");
})


app.post("/submit", async (req,res)=>{
    try{
       
        const registerComplaint= new Complaint({
            hostel : req.body["hostelDropdown"],
            year : req.body["yearDropdown"],
            cText : req.body.complaint
        })

        const registered = await registerComplaint.save();
         res.status(201).render("home.ejs");

    }
    catch(error){
        res.status(400).send(error);
    }

})


function cancelComplaint() {
    document.getElementById("complaintText").value = "";
    document.getElementById("complaintImage").value = "";
}

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})