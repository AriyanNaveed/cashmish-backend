import { addMobile,getMobileById,getMobiles,updateMobile,deleteMobile,getMobilesByBrand } from "../controllers/mobileController.js";
import express from "express";

const router = express.Router();
router.post("/", addMobile);
router.get("/", getMobiles);
router.get("/:id", getMobileById);
router.get("/brand", getMobilesByBrand);
router.put("/:id", updateMobile);
router.delete("/:id", deleteMobile);

export default router;