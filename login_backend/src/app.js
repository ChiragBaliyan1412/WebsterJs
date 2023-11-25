const express = require("express");
const path = require("path");

const temp_path = path.join(__dirname, '../src');

require("./db/conn");
const Student = require("./models/signup");
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('src', temp_path);

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

app.get("/", (req,res)=>{
    res.render("signup.ejs");
});

app.get("/login", (req,res)=>{
    res.render("login.ejs");
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


app.post('/login', async(req, res)=> {
    try{
        const username = req.body.username;
        const password = req.body.password;

        const getuser= await Student.findOne({username: username});

        if(getuser.password === password){
            res.render('home');
            
        }
        else{
            // alert(`goli beta masti nahi`);
            res.render('../views/login.ejs');
        }
    }
    catch(error){
        res.send(error);
    }
   
})
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})