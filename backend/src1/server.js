import express from "express";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.routes.js";
import {connectDB} from "./lib/db.js"
import { ENV } from "./lib/env.js";



const app = express();

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json())//req.body
app.use(cookieParser())

console.log(ENV.PORT);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/my-project/dist")));

  app.get("*", (_, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/my-project/dist/index.html")
    );
  });
}

app.listen(PORT, () => {
  console.log("server running on port :" + PORT);
  connectDB();
});