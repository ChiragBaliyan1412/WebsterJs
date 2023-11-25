const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    hostel:{
        type: String,
        required:true
    },
    year: {
        type: String,
        required:true
    },
    subject : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: false
    },
    registeredAt : {
        type: Date,
        default: Date.now
    },
    resolvedAt : {
        type: Date,
    },
    upvote : {
        type: Number,
        default: 0
    },
    status : {
        type: String,
        default: 'Pending'
    },
    upvotes: [{ userId: String }]

});


module.exports = mongoose.model('Complaint', ComplaintSchema);