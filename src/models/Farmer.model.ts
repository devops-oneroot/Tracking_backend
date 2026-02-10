// import { Schema, model, Document } from "mongoose";

// export interface IFarmer extends Document {
//   name: string;
//   phone: string;
//   cropType: string;
//   state: string;
//   district: string;
//   taluk: string;
//   village: string;
//   landSize?: number;

//   cropCost?: string;
//   inputSupplier?: string;
//   additionalInfo?: string;
//   paymentType?: "credit" | "cash";
//   droneSprayingConsent?: boolean;
//   agronomistCareConsent?: boolean;

//   location?: {
//     latitude: number;
//     longitude: number;
//   };

//   photo?: string;

//   createdAt: Date;
//   updatedAt: Date;
// }

// const FarmerSchema = new Schema<IFarmer>(
//   {
//     name: { type: String, required: true, trim: true },
//     phone: { type: String, required: true, unique: true },
//     cropType: { type: String, required: true, index: true },

//     state: { type: String, index: true },
//     district: { type: String, index: true },
//     taluk: { type: String, index: true },
//     village: { type: String, index: true },

//     landSize: { type: Number },

//     /* ===== NEW FIELDS ===== */
//     cropCost: { type: String },
//     inputSupplier: { type: String },
//     additionalInfo: { type: String },
//     paymentType: { type: String, enum: ["credit", "cash"] },

//     droneSprayingConsent: { type: Boolean, default: false },
//     agronomistCareConsent: { type: Boolean, default: false },

//     location: {
//       latitude: Number,
//       longitude: Number,
//     },

//     photo: { type: String },
//   },
//   { timestamps: true },
// );

// export default model<IFarmer>("Farmer", FarmerSchema);

import { Schema, model, Document, Types } from "mongoose";

/* ===== SUB SCHEMAS ===== */

// Crop sub-schema
const CropSchema = new Schema(
  {
    name: { type: String, index: true },
    price: { type: String },
    additionalInfo: { type: String },
  },
  { _id: false },
);

// Payment sub-schema
const PaymentSchema = new Schema(
  {
    type: { type: String, enum: ["credit", "cash"] },
    additionalInfo: { type: String },
  },
  { _id: false },
);

// Consent sub-schema
const ConsentSchema = new Schema(
  {
    value: { type: Boolean, default: false },
    additionalInfo: { type: String },
  },
  { _id: false },
);

/* ===== FARMER INTERFACE ===== */
export interface IFarmer extends Document {
  onboardedBy: Types.ObjectId;
  name: string;
  phone: string;

  crops: {
    name: string;
    price?: string;
    additionalInfo?: string;
  }[];
  additionalCrops?: string;

  state?: string;
  district?: string;
  taluk?: string;
  village?: string;
  landSize?: number;

  inputSupplier?: string;
  additionalInfo?: string;

  payment?: {
    type?: "credit" | "cash";
    additionalInfo?: string;
  };

  droneSprayingConsent?: {
    value: boolean;
    additionalInfo?: string;
  };

  agronomistCareConsent?: {
    value: boolean;
    additionalInfo?: string;
  };

  location?: {
    latitude: number;
    longitude: number;
  };

  photo?: string;

  createdAt: Date;
  updatedAt: Date;
}

/* ===== FARMER SCHEMA ===== */
const FarmerSchema = new Schema<IFarmer>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    onboardedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ===== MULTIPLE CROPS ===== */
    crops: {
      type: [CropSchema],
      required: true,
    },
    additionalCrops: { type: String },
    state: { type: String, index: true },
    district: { type: String, index: true },
    taluk: { type: String, index: true },
    village: { type: String, index: true },

    landSize: { type: Number },

    inputSupplier: { type: String },
    additionalInfo: { type: String },

    /* ===== PAYMENT ===== */
    payment: PaymentSchema,

    /* ===== CONSENTS ===== */
    droneSprayingConsent: ConsentSchema,
    agronomistCareConsent: ConsentSchema,

    location: {
      latitude: Number,
      longitude: Number,
    },

    photo: { type: String },
  },
  { timestamps: true },
);

export default model<IFarmer>("Farmer", FarmerSchema);
