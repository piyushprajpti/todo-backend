import { Router } from "express";
import { signup, login, resetpassword, addnote, profilepage, deletenote, fetchallnotes, fetchanote } from "../controller/authentication.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/resetpassword", resetpassword);
router.post("/addnote", addnote)
router.post("/deletenote", deletenote)
router.post("/profilepage", profilepage)
router.post("/", fetchallnotes)
router.post("/fetchanote", fetchanote)

export default router;