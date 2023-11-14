const mongoose = require ("mongoose");

mongoose.connect("mongodb://localhost:27017/MessJS").then(()=>{

console.log(`successfull cconnection`);
}).catch((e)=>{
    console.log(`no connection`);
})