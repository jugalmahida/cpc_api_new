const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        profileImageUrl: { type: String, default: null },
        position: { type: String, required: true },
        briefProfile: { type: String },
        qualifications: { type: String },
        areasOfInterest: { type: String },
        achievements: { type: String },
        publications: { type: String },
        vertical_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vertical", required: true },
        committees_id: { type: mongoose.Schema.Types.ObjectId, ref: "Committees", default: null },
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);
// Auto-remove fields from JSON response
facultySchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});
module.exports = mongoose.model("Faculty", facultySchema);
