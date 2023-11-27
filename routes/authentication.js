import { Router } from "express";
import { signup, login, resetpassword, addnote } from "../controller/authentication.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/resetpassword", resetpassword);
router.post("/addnote", addnote)

export default router;