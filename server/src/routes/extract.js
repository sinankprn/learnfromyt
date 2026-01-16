import express from "express";
import { generateLearningMaterial } from "../services/geminiserver.js";

const router = express.Router();

router.post("/extract", async (req, res) => {
  const { youtubeUrl } = req.body;
  if (!youtubeUrl) {
    return res
      .status(400)
      .json({ error: "youtubeUrl query parameter is required" });
  }
  try {
    const learningMaterial = await generateLearningMaterial(youtubeUrl);
    res.json(learningMaterial);
  } catch (error) {
    console.error("Error generating learning material:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
