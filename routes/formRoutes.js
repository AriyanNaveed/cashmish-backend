import express from "express";
import {
  createForm,
  getAllForms,
  updateForm,
  deleteForm,
  getFormById
} from "../controllers/formController.js";
import upload from "../middleware/upload.js";
import jwt from "jsonwebtoken";
import keys from "../config/keys.js";

const router = express.Router();

// ✅ Optional auth middleware - allows both logged-in and guest users
const optionalAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, keys.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

// Routes
router.post("/", optionalAuth, upload.array("images", 5), createForm);
router.get("/", getAllForms);
router.get("/:id", getFormById);
router.put("/:id", updateForm);
router.delete("/:id", deleteForm);

export default router;