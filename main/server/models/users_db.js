const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique : true
    },
    password : {
        type: String,
        required: true,
        unique:true
    },
    email : {
        type: String,
        required: true,
        unique : true
    },
    role : {
        type: String,
        default: 'student' //assuming student if admin role is not specified
    },
    upvotedComplaints: [String]

});


module.exports = mongoose.model('User', userSchema);