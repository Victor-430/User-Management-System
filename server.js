import express from "express";
import cors from "cors";
import url from "url";
import path from "path";
import usersRoute from "./routes/users.js";
import { logger } from "./middleware/logger.js";
import { errorhandler, routeError } from "./middleware/not-found.js";

const app = express();

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://user-management-system-ums.vercel.app"]
    : [
        "http://localhost:8000",
        "https://user-management-system-ums.vercel.app",
      ];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 8000;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// Health check endpoint for Render
app.get("/health-check", (req, res) => {
  res.json({ message: "User Management System API is running!" });
});

// all routes
app.use(logger);
app.use("/api/users", usersRoute);
app.use(routeError);
app.use(errorhandler);

app.listen(PORT, () => {
  console.log("server running n ${PORT}");
});
