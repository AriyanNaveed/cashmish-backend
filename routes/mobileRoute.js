import { addMobile,getMobileById,getMobiles,updateMobile,deleteMobile } from "../controllers/mobileController.js";
import express from "express";

const router = express.Router();
router.post("/", addMobile);
router.get("/", getMobiles);
router.get("/:id", getMobileById);
router.put("/:id", updateMobile);
router.delete("/:id", deleteMobile);

export default router;