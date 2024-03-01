const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    Guild: String,
    Channel: String
});

module.exports = mongoose.model("global_ban_channel_guild", schema);