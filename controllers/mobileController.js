import { Mobile } from "../models/mobileModel.js";

//   ADD MOBILE (ADMIN)

export const addMobile = async (req, res) => {
  try {
    const { brand, phoneModel, basePrice, image, deductionRules } = req.body;

    const mobile = await Mobile.create({
      brand,
      phoneModel,
      basePrice,
      image,
      deductionRules
    });

    res.status(201).json(mobile);
  } catch (error) {
    res.status(500).json({ message: "Failed to add mobile" });
  }
};

//   GET ALL MOBILES (USER)
//   only active
export const getMobiles = async (req, res) => {
  try {
    const query = req.query.includeInactive === 'true' ? {} : { isActive: true };

    // Brand Filter
    if (req.query.brand && req.query.brand !== 'all') {
      query.brand = { $regex: new RegExp(`^${req.query.brand}$`, 'i') };
    }

    // Search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { brand: searchRegex },
        { phoneModel: searchRegex }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Mobile.countDocuments(query);
    const mobiles = await Mobile.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    res.json({
      mobiles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch mobiles" });
  }
};

//   GET MOBILE BY ID
export const getMobileById = async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id);

    if (!mobile || !mobile.isActive) {
      return res.status(404).json({ message: "Mobile not found" });
    }

    res.json(mobile);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch mobile" });
  }
};

//   GET MOBILES BY BRAND
export const getMobilesByBrand = async (req, res) => {
  try {
    const { brand } = req.query;

    if (!brand) {
      return res.status(400).json({ message: "Brand is required" });
    }

    const mobiles = await Mobile.find({
      brand: { $regex: new RegExp(`^${brand}$`, "i") },
      isActive: true
    }).select("phoneModel _id image");

    res.json(mobiles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch mobiles" });
  }
};

//   UPDATE MOBILE (ADMIN – SAFE)
export const updateMobile = async (req, res) => {
  try {
    const updates = {};
    const fields = ["brand", "phoneModel", "basePrice", "isActive", "image", "deductionRules"];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const mobile = await Mobile.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!mobile) {
      return res.status(404).json({ message: "Mobile not found" });
    }

    res.json(mobile);
  } catch (error) {
    res.status(500).json({ message: "Mobile update failed" });
  }
};

//   DELETE MOBILE (ADMIN – SOFT DELETE)
export const deleteMobile = async (req, res) => {
  try {
    const mobile = await Mobile.findByIdAndDelete(req.params.id);

    if (!mobile) {
      return res.status(404).json({ message: "Mobile not found" });
    }

    res.json({ message: "Mobile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Mobile delete failed" });
  }
};
