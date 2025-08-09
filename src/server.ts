import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PORT } from "@/config";
import mediaRoutes from "./routes/media";

dotenv.config();

const app = express();
const PORT_FROM_ENV = PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/media", mediaRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "media-service",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl,
  });
});

app.listen(PORT_FROM_ENV);
