import express from "express";
import {
  createForm,
  getAllForms,
  updateForm,
  getFormById,
  deleteForm,
  getWalletBalance,
  getGuestWalletBalance,
  getDashboardStats,
  getEstimate,
  bridgeGuestOrders,
} from "../controllers/formController.js";
import upload from "../middleware/upload.js";


const router = express.Router();

router.get("/stats", getDashboardStats);
router.post("/estimate", getEstimate);
const upload15 = upload.array("images", 15);
router.post("/", (req, res, next) => {
  upload15(req, res, function (err) {
    if (err) {
      // Catch multer errors (like file size limit or too many files)
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, createForm);
router.get("/", getAllForms);
router.get("/wallet-balance/:userId", getWalletBalance);
router.post("/guest-balance", getGuestWalletBalance);
router.post("/bridge", bridgeGuestOrders);
router.get("/:id", getFormById);
router.put("/:id", updateForm);
router.delete("/:id", deleteForm);

export default router;