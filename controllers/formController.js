import { Form } from "../models/formModel.js";
import { Mobile } from "../models/mobileModel.js";
import cloudinary from "../config/cloudinary.js";
import { calculatePrice } from "../utils/priceCalculator.js";


  //  CREATE FORM (USER)

export const createForm = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      mobileId,
      storage,
      carrier,
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

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "reseller_forms"
        });
        imageUrls.push(uploaded.secure_url);
      }
    }

    /* calculate price (storage included) */
    const estimatedPrice = calculatePrice(mobile.basePrice, {
      storage,
      screen: screenCondition,
      body: bodyCondition,
      battery: batteryCondition
    });

    const form = await Form.create({
      userId: req.user.id,
      mobileId,
      storage,
      carrier,
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


  // GET USER FORMS (USER DASHBOARD)

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


  //  GET SINGLE FORM

export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
      .populate("mobileId")
      .populate("userId", "name email");

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (form.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch form" });
  }
};

//  UPDATE FORM (USER – SAFE)
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

    const allowedUpdates = {};
    const fields = [
      "storage",
      "carrier",
      "screenCondition",
      "bodyCondition",
      "batteryCondition"
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        allowedUpdates[field] = req.body[field];
      }
    });

    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true }
    );

    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: "Form update failed" });
  }
};

//  DELETE FORM (USER)
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

// ADMIN – GET ALL FORMS
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


//  ADMIN – UPDATE STATUS / PRICE

export const adminUpdateForm = async (req, res) => {
  try {
    const { status, estimatedPrice } = req.body;

    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { status, estimatedPrice },
      { new: true }
    );

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: "Admin update failed" });
  }
};
