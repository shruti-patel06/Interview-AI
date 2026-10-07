const mongoose = require ("mongoose");

// Errors are not caught here so server.js can report them.
async function connectDB(){
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connect to Database");
}
module.exports = connectDB
