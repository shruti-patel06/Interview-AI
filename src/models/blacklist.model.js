const mongoose = require("mongoose");

const tokenBlackListSchema = new mongoose.Schema({
        token : {
                type:String,
                required :[true,"Token is Required to be added in blacklist"]
        }
},{
        timestamps:true
})
const tokenBlackListModel = mongoose.model("tokensBlacklist",tokenBlackListSchema);

module.exports = tokenBlackListModel