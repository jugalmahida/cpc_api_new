const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.CONNECTION_STRING;

if (!connectionString) {
    console.error("❌ CONNECTION_STRING is missing in .env file");
    process.exit(1);
}

mongoose.connect(process.env.CONNECTION_STRING)

// mongoose.Promise = global.Promise;
// Handling connection events
const db = mongoose.connection;

db.once("open", () => {
    console.log("Database Connected");
});

db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

db.on("disconnected", () => {
    console.log("Disconnected from Database");
});
