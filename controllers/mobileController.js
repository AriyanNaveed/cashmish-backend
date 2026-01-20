import { Mobile } from "../models/mobileModel.js";

//Add a new mobile phone
export const addMobile = async (req, res) => {
    try {
        const { brand, phoneModel, basePrice } = req.body;
        const newMobile = new Mobile({ brand, phoneModel, basePrice });
        await newMobile.save();
        res.status(201).json({ message: "Mobile phone added successfully", mobile: newMobile });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
//Get all mobile phones
export const getMobiles = async (req, res) => {
    try {
        const mobiles = await Mobile.find();
        res.status(200).json(mobiles);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
//Get a mobile phone by ID
export const getMobileById = async (req, res) => {
    try {
        const mobile = await Mobile.findById(req.params.id);
        if (!mobile) {
            return res.status(404).json({ message: "Mobile phone not found" });
        }
        res.status(200).json(mobile);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
//Update a mobile phone
export const updateMobile = async (req, res) => {
    try {
        const { brand, phoneModel, basePrice, isActive } = req.body;
        const mobile = await Mobile.findByIdAndUpdate(
            req.params.id,
            { brand, phoneModel, basePrice, isActive },
            { new: true }
        );
        if (!mobile) {
            return res.status(404).json({ message: "Mobile phone not found" });
        }
        res.status(200).json({ message: "Mobile phone updated successfully", mobile });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
//Delete a mobile phone
export const deleteMobile = async (req, res) => {
    try {
        const mobile = await Mobile.findByIdAndDelete(req.params.id);
        if (!mobile) {
            return res.status(404).json({ message: "Mobile phone not found" });
        }
        res.status(200).json({ message: "Mobile phone deleted successfully", mobile });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

