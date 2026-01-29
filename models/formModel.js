import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    pickupAddress: {
      type: String,
      required: true,
      trim: true
    },
    preferedPickupDate: {
      type: Date,
      required: true
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true
    },

    mobileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mobile",
      required: true
    },

    storage: {
      type: String,
      enum: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
      required: true
    },
     
    carrier: {
      type: String,
      required: true,
      trim: true
    },
    screenCondition: {
      type: String,
      enum: ["perfect", "scratched", "cracked"],
      required: true
    },

    bodyCondition: {
      type: String,
      enum: ["perfect", "scratched", "damaged"],
      required: true
    },

    batteryCondition: {
      type: String,
      enum: ["good", "average", "poor"],
      required: true
    },

    images: {
      type: [String]
    },

    estimatedPrice: {
      type: Number
    },

    status: {
      type: String,
      default: "pending"
    }
  },
  { timestamps: true }
);

export const Form = mongoose.model("Form", formSchema);
