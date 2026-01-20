import express from "express";
import upload from "../middleware/upload.js";
import {
  createForm,
  getMyForms,
  getFormById,
  updateForm,
  deleteForm,
  getAllForms,
  adminUpdateForm
} from "../controllers/formController.js";

const router = express.Router();

/* USER */
router.post("/", upload.array("images", 5), createForm);
router.get("/my", getMyForms);
router.get("/:id", getFormById);
router.put("/:id", updateForm);
router.delete("/:id", deleteForm);

/* ADMIN */
router.get("/", getAllForms);
router.put("/admin/:id", adminUpdateForm);

export default router;
