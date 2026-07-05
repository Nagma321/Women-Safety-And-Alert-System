import express from "express"
import { Authentication, GetUserInfo, GoogleAuthController, Login, Logout, Signup } from "../Controllers/UserController.js"
const router = express.Router()

router.post("/signup",Signup)
router.post("/login", Login)
router.post("/googleLogin", GoogleAuthController)
router.post("/logout",Logout)
router.get("/auth-check", Authentication)
router.get("/get-data", GetUserInfo)

export default router