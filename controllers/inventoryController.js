import { Inventory } from "../models/inventoryModel.js";

// Create inventory item
export const createInventoryItem = async (req, res) => {
  try {
    const { phoneModel, storage, purchasePrice, purchaseDate, condition, source, notes, imeiNumber, status, salePrice, saleDate, buyer } = req.body;
    const inventoryItem = await Inventory.create({
      phoneModel,
      storage,
      purchasePrice,
      purchaseDate,
      condition,
      source,
      notes,
      imeiNumber,
      status,
      salePrice,
      saleDate,
      buyer
    });

    res.status(201).json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to create inventory item", error });
  }
};
// Get all inventory items
export const getAllInventoryItems = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { phoneModel: searchRegex },
        { imeiNumber: searchRegex },
        { source: searchRegex },
        { buyer: searchRegex },
        // also support searching by status for convenience
        { status: searchRegex }
      ];
    }

    const total = await Inventory.countDocuments(query);
    const inventoryItems = await Inventory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      inventory: inventoryItems,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory items", error });
  }
};
// Get single inventory item by ID
export const getInventoryItemById = async (req, res) => {
  try {
    const inventoryItem = await Inventory.findById(req.params.id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory item", error });
  }
};
// Update inventory item by ID
export const updateInventoryItemById = async (req, res) => {
  try {
    const { phoneModel, storage, purchasePrice, purchaseDate, condition, source, notes, imeiNumber, status, salePrice, saleDate, buyer } = req.body;
    const inventoryItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      { phoneModel, storage, purchasePrice, purchaseDate, condition, source, notes, imeiNumber, status, salePrice, saleDate, buyer },
      { new: true },
    );
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update inventory item", error });
  }
};
// Delete inventory item by ID
export const deleteInventoryItemById = async (req, res) => {
  try {
    const inventoryItem = await Inventory.findByIdAndDelete(req.params.id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete inventory item", error });
  }
};

