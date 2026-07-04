"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const health_1 = __importDefault(require("./routes/health"));
const categories_1 = __importDefault(require("./routes/categories"));
const brands_1 = __importDefault(require("./routes/brands"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// CORS configuration
const allowedOrigins = process.env.FRONTEND_ORIGINS
    ? process.env.FRONTEND_ORIGINS.split(",")
    : ["http://localhost:3000"];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
// Routes
app.use("/api/health", health_1.default);
app.use("/api/categories", categories_1.default);
app.use("/api/brands", brands_1.default);
app.use("/api/products", products_1.default);
app.use("/api/orders", orders_1.default);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
// Global Error Handler
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
