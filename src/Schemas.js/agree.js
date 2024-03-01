const {model, Schema} = require("mongoose");

const schema = new Schema({
    UserID: String
});

module.exports = model("gloabl_ban_agree", schema);