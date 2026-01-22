import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    cropName: { type: String },
    capacity: { type: String },
  },
  { _id: false },
);

const aggregatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    mobileNumber: {
      type: String,
      required: true,
      unique: true, // ✅ ONLY UNIQUE
    },

    gstNo: String,
    panNo: String,
    aadharNo: String,

    village: { type: String, required: true },
    taluk: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },

    productDealing: { type: String, required: true },
    capacityOfDealing: String,

    cropDetails: [cropSchema],

    currentlySupplyTo: String,
    supplyLocation: String,

    selfieImage: { type: String },
    storeImage: { type: String },

    location: {
      latitude: Number,
      longitude: Number,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Aggregator", aggregatorSchema);
