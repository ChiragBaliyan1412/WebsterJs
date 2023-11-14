const express = require("express");
const path = require("path");

require("./db/conn");
const Student = require("./models/signup");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.get("/", (req,res)=>{
    res.render("signup.ejs");
});

app.post("/signup", async (req,res)=>{
    try{
        // res.send(req.body["username"]);
        const studentSignup = new Student({
            username : req.body["username"],
            password : req.body["password"],
            email : req.body["email"]

        })

        const signedup = await studentSignup.save();
        res.status(201).render("home.ejs");

    }catch (error){
        res.status(400).send(error);
    }
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})