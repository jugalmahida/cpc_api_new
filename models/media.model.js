const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
    {
        imageUrl: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);