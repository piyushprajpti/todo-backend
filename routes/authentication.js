import { Router } from "express";
import { signup, login, resetpassword } from "../controller/authentication.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/resetpassword", resetpassword);

export default router;