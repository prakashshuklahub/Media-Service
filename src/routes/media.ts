import express from "express";
import mediaController from "@/controllers/mediaController";

const router = express.Router();

router.get("/search", mediaController.searchMedia);

export default router;
