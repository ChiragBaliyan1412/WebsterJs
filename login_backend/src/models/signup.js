const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({   //defining schema
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    }
    
})

const Student = new mongoose.model("Student", studentSchema);   //making collection "Student" with "studentSchema" schema

module.exports = Student;