import express from "express";
import url from "url";
import path from "path";
import usersRoute from "./routes/users.js";
import { logger } from "./middleware/logger.js";
import { errorhandler, routeError } from "./middleware/not-found.js";

const app = express();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// all routes
app.use(logger);
app.use("/api/users", usersRoute);
app.use(routeError);
app.use(errorhandler);

app.listen(8000,  () => {
  console.log("server running");
});

// "192.168.43.61",