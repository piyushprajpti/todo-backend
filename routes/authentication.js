import { Router } from "express";
import { signUp } from "../controller/authentication.js";

const router = Router();

router.post("/signup", signUp);

export default router;