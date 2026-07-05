import express from "express"
import { AddReview, GetAllReviews } from "../Controllers/ReviewController.js"
const router = express.Router()

router.post("/addreview", AddReview)
router.get("/allreviews", GetAllReviews)

export default router