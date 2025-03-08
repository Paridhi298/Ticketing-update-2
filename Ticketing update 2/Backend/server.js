require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("Multi-Tenant Ticketing System API is running");
});

const PORT = process.env.PORT || 4000;

async function startServer() {
    try {
        await mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/admin`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB");

        // ✅ Only ONE `app.listen()` call
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB", error);
        process.exit(1);
    }
}

// Start the server
startServer();

  