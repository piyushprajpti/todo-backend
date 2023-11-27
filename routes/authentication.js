import { Router } from "express";
import { signup, login, resetpassword, addnote, profilepage } from "../controller/authentication.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/resetpassword", resetpassword);
router.post("/addnote", addnote)
router.post("/profilepage", profilepage)

export default router;