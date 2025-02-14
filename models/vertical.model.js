const mongoose = require("mongoose");

const verticalSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        imageUrl: { type: String, default: null }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Vertical", verticalSchema);
