const mongoose= require("mongoose");


const complaintSchema = new mongoose.Schema({
    
    hostel : {
        type : String,
        required : false
    },

    year : {
        type : String,
        required : false
    },

    cText : {
        type : String,
        required : false
    }
    

})

const Complaint = new mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;