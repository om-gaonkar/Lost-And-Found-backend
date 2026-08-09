import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    // User who created the report
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // lost | found
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

    // Pending until admin verifies
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "claimed"],
      default: "pending",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Documents",
        "Wallet",
        "Keys",
        "Bag",
        "Clothing",
        "Jewellery",
        "Pet",
        "Other",
      ],
    },

    description: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "",
    },

    incidentDate: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    contactNumber: {
      type: String,
      required: true,
    },

    reward: {
      type: Number,
      default: 0,
    },

    additionalDetails: {
      type: String,
      default: "",
    },

    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    claimStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "claimed"],
      default: "pending",
    },
    claimProcess: {
      type: String,
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Item = mongoose.model("Item", itemSchema);
export default Item;
