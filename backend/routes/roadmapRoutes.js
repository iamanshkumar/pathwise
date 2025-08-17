import express from "express"
import { generateRoadmap } from "../controllers/roadmapController.js"
import { getVideos } from "../controllers/getVideosController.js"


const router = express.Router()

router.post("/roadmap",generateRoadmap)
router.post("/get-videos",getVideos)

export default router