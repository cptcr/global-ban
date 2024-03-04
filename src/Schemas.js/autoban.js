const {model, Schema} = require("mongoose");

const schema = new Schema({
    Guild: String,
})

module.exports = model("global_ban_autoban", schema);