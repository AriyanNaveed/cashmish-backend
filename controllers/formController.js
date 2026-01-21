import { Form } from "../models/formModel.js";
import { Mobile } from "../models/mobileModel.js";
import cloudinary from "../config/cloudinary.js";
import { calculatePrice } from "../utils/priceCalculator.js";

/* ===============================
   CREATE FORM (USER SUBMIT)
================================ */
export const createForm = async (req, res) => {
  try {
    const {
      mobileId,
      storage,
      screenCondition,
      bodyCondition,
      batteryCondition
    } = req.body;

    const mobile = await Mobile.findById(mobileId);
    if (!mobile) {
      return res.status(404).json({ message: "Mobile not found" });
    }

    /* upload images */
    const imageUrls = [];
    for (const file of req.files) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder: "reseller_forms"
      });
      imageUrls.push(uploaded.secure_url);
    }

    /* calculate price */
    const estimatedPrice = calculatePrice(mobile.basePrice, {
      screen: screenCondition,
      body: bodyCondition,
      battery: batteryCondition
    });

    const form = await Form.create({
      userId: req.user.id,
      mobileId,
      storage,
      screenCondition,
      bodyCondition,
      batteryCondition,
      images: imageUrls,
      estimatedPrice
    });

    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: "Form submission failed" });
  }
};

/* ===============================
   GET USER FORMS (USER DASHBOARD)
================================ */
export const getMyForms = async (req, res) => {
  try {
    const forms = await Form.find({ userId: req.user.id })
      .populate("mobileId")
      .sort({ createdAt: -1 });

    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch forms" });
  }
};

/* ===============================
   GET SINGLE FORM
================================ */
export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
      .populate("mobileId")
      .populate("userId", "name email");

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    /* user security */
    if (form.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch form" });
  }
};

/* ===============================
   UPDATE FORM (USER – LIMITED)
================================ */
export const updateForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (form.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (form.status !== "pending") {
      return res.status(400).json({ message: "Form cannot be updated" });
    }

    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: "Form update failed" });
  }
};

/* ===============================
   DELETE FORM (USER)
================================ */
export const deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (form.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await form.deleteOne();
    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Form delete failed" });
  }
};

/* ===============================
   ADMIN – GET ALL FORMS
================================ */
export const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find()
      .populate("mobileId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch forms" });
  }
};

/* ===============================
   ADMIN – UPDATE STATUS / FINAL PRICE
================================ */
export const adminUpdateForm = async (req, res) => {
  try {
    const { status, estimatedPrice } = req.body;

    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { status, estimatedPrice },
      { new: true }
    );

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: "Admin update failed" });
  }
};
