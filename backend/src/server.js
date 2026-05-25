//const express = require('express');
import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();

const app = express();


const PORT = process.env.PORT || 3000;

console.log(process.env.PORT);

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes); //remaining is here /api/messages/send

app.listen(PORT,() => console.log("server running on port :"+PORT));
