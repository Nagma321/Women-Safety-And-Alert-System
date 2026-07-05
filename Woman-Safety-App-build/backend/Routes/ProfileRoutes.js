import express from "express"
import { AddProfilePhoto, UpdateEmail, UpdatePassword, UpdateUsername } from "../Controllers/ProfileController.js"
import { upload } from "../Middlewares/Multer.js"
const router = express.Router()

router.post("/add-photo", upload.single("photo"), async (req, res, next) => {
    try {
        await AddProfilePhoto(req, res)
    } catch (error) {
        next(error)
    }
})
router.post("/update-name", UpdateUsername)
router.post("/update-email", UpdateEmail)
router.post("/update-password", UpdatePassword)


export default router