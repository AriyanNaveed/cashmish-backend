import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    payoutMethod: {
        type: String,
        enum: ["bank", "zelle"],
        default: "bank"
    },
    // Bank fields (required only for bank method)
    accountNumber: {
        type: String
    },
    accountHolderName: {
        type: String,
        required: true
    },
    bankName: {
        type: String
    },
    // Zelle fields (required only for zelle method)
    zelleContact: {
        type: String
    },
    zelleContactType: {
        type: String,
        enum: ["email", "phone"]
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "paid", "rejected"],
        default: "pending"
    }
}, { timestamps: true })

export const BankDetails = mongoose.model("BankDetails", bankDetailsSchema)
