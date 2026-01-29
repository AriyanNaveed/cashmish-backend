import express from "express";
import {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm
} from "../controllers/formController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

/* =========================
   ROUTES
========================= */

// create form
router.post(
  "/",
  upload.array("images", 5),
  createForm
);

// get all forms
router.get(
  "/",
  getAllForms
);

// get single form
router.get(
  "/:id",
  getFormById
);

// update form
router.put(
  "/:id",
  updateForm
);

// delete form
router.delete(
  "/:id",
  deleteForm
);

export default router;
