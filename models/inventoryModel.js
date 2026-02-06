import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    phoneModel:{
        type:String,
        required:true
    },
    storage:{
        type:String,
        enum:["32GB","64GB","128GB","256GB","512GB","1TB","2TB"],
        required:true
    },
    purchasePrice:{
        type:Number,
        required:true
    },
    purchaseDate:{
        type:Date,
        required:true
    },
    condition:{ 
        type:String,
        enum:["New","Like New","Good","Fair","Poor"],
        required:true
    },
    source:{
        type:String,
        required:true
    },
    notes:{
        type:String
    }
},{timestamps:true});

export const Inventory = mongoose.model("Inventory", inventorySchema);