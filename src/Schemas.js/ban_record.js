const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    reason: { type: String, default: 'No reason provided' },
    automated: { type: Boolean, default: false }, // True for automated bans, false for manual bans
    timestamp: { type: Date, default: Date.now } // The date and time when the ban was recorded
});

module.exports = mongoose.model('BanRecord', banSchema);
