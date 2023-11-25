const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    hostel:{
        type: String,
    },
    day: {
        type: String,
        required:true
    },
    number: {
        type: Number,
        required: true
    },
    meals:[
        {
            mealType:{
                type: String,
                required: true
            },
            items: {
                    type: String,
                    required: true
                }
            
        }
    ]

});


module.exports = mongoose.model('Menu', menuSchema);