import { Router } from "express";
import { sharePostPage } from "../controller/share.controller";

const router = Router()

router.get("/post/:id",sharePostPage)

export default router