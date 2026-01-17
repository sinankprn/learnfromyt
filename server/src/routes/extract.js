import express from "express";
import { generateLearningMaterial } from "../services/geminiserver.js";
import { transcribeYouTubeVideo } from "../services/transcribeService.js";
import { generateStudyMaterials } from "../services/studyMaterialsService.js";

const router = express.Router();

router.post("/transcribe", async (req, res) => {
  const { youtubeUrl } = req.body;
  if (!youtubeUrl) {
    return res.status(400).json({ error: "youtubeUrl is required" });
  }
  try {
    const transcript = await transcribeYouTubeVideo(youtubeUrl);
    res.json(transcript);
  } catch (error) {
    console.error("Error transcribing video:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

router.post("/study-materials", async (req, res) => {
  const { youtubeUrl } = req.body;
  if (!youtubeUrl) {
    return res.status(400).json({ error: "youtubeUrl is required" });
  }
  try {
    const studyMaterials = await generateStudyMaterials(youtubeUrl);
    res.json(studyMaterials);
  } catch (error) {
    console.error("Error generating study materials:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

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
