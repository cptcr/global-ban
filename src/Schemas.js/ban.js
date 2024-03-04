const {model, Schema} = require("mongoose");

const schema = new Schema({
    UserID: String,
    BanCount: Number
});

module.exports = model("gloabl_ban_user", schema);