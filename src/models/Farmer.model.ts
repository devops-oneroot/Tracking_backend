import { Schema, model, Document } from "mongoose";

export interface IFarmer extends Document {
  name: string;
  phone: string;
  cropType: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  landSize?: number;

  cropCost?: string;
  inputSupplier?: string;
  paymentType?: "credit" | "cash";
  droneSprayingConsent?: boolean;
  agronomistCareConsent?: boolean;

  location?: {
    latitude: number;
    longitude: number;
  };

  photo?: string;

  createdAt: Date;
  updatedAt: Date;
}

const FarmerSchema = new Schema<IFarmer>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    cropType: { type: String, required: true, index: true },

    state: { type: String, index: true },
    district: { type: String, index: true },
    taluk: { type: String, index: true },
    village: { type: String, index: true },

    landSize: { type: Number },

    /* ===== NEW FIELDS ===== */
    cropCost: { type: String },
    inputSupplier: { type: String },
    paymentType: { type: String, enum: ["credit", "cash"] },

    droneSprayingConsent: { type: Boolean, default: false },
    agronomistCareConsent: { type: Boolean, default: false },

    location: {
      latitude: Number,
      longitude: Number,
    },

    photo: { type: String },
  },
  { timestamps: true },
);

export default model<IFarmer>("Farmer", FarmerSchema);
