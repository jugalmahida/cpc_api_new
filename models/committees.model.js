const mongoose = require("mongoose");

const committeesSchema = new mongoose.Schema({
    name: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Committees", committeesSchema);
