const express = require("express");
const path = require("path");
const cors = require("cors");
const cloudinary = require("cloudinary");
const connectDatabase = require("./backend/config/database");

require("dotenv").config(); // Load environment variables

const app = require("./backend/app");
const PORT = process.env.PORT || 4000;

// 🔴 Handle Uncaught Exceptions (e.g., undefined variables)
process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});

// 🔹 Connect Database
connectDatabase();

// 🔹 Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 CORS Setup (Allow Frontend Requests)
const allowedOrigins = ["http://localhost:3000", "https://your-live-site.com"];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, false); // Blocks requests from unlisted origins
        }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
}));

// 🔹 Serve Frontend in Production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("Server is Running! 🚀");
    });
}

// 🔹 Start Server
const server = app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

// 🔴 Handle Unhandled Promise Rejections (e.g., MongoDB connection failure)
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Promise Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
