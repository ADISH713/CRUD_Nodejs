
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Request parsing and logging
app.use(express.json());
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    limit: Number(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later.",
        });
    },
});

app.use(limiter);

// Health-check route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "User CRUD API is running",
    });
});

// Routes will be mounted here in the next step.
app.use("/api/users", userRoutes);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    const status = err.status || err.statusCode || 500;

    return res.status(
        status >= 400 && status < 600 ? status : 500
    ).json({
        success: false,
        message: status >= 500
            ? "Internal server error"
            : err.message,
    });
});

module.exports = app;
