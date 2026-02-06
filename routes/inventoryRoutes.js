import { createInventoryItem, getAllInventoryItems, getInventoryItemById, updateInventoryItemById, deleteInventoryItemById } from "../controllers/inventoryController";
import express from "express";

const router = express.Router();

// Create inventory item
router.post("/", createInventoryItem);
// Get all inventory items
router.get("/", getAllInventoryItems);
// Get single inventory item by ID
router.get("/:id", getInventoryItemById);
// Update inventory item by ID
router.put("/:id", updateInventoryItemById);
// Delete inventory item by ID
router.delete("/:id", deleteInventoryItemById);

export default router;