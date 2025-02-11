const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        images: [{ type: mongoose.Schema.Types.ObjectId, ref: "EventImage" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
