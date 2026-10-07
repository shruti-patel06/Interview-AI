const mongoose = require("mongoose");

const TOKEN_LIFETIME_SECONDS = 60 * 60 * 24; // must match the JWT expiresIn ("1d")

const tokenBlackListSchema = new mongoose.Schema({
        token : {
                type:String,
                required :[true,"Token is Required to be added in blacklist"],
                index:true // looked up on every authenticated request
        }
},{
        timestamps:true
})

// A token is useless once its JWT has expired, so MongoDB deletes the entry automatically after that.
tokenBlackListSchema.index({ createdAt: 1 }, { expireAfterSeconds: TOKEN_LIFETIME_SECONDS })

const tokenBlackListModel = mongoose.model("tokensBlacklist",tokenBlackListSchema);

module.exports = tokenBlackListModel
