const mongoose = require("mongoose");

const eventImageSchema = new mongoose.Schema(
    {
        imageUrl: { type: String, required: true },
        date: { type: Date, required : true },
        event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("EventImage", eventImageSchema);
