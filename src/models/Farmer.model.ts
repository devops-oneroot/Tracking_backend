import { Schema, model, Document } from "mongoose";

export interface IFarmer extends Document {
  name: string;
  phone: string;
  cropType: string;
  district: string;
  taluk: string;
  village: string;
  landSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

const FarmerSchema = new Schema<IFarmer>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    cropType: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    taluk: { type: String, required: true, index: true },
    village: { type: String, required: true, index: true },
    landSize: { type: Number },
  },
  { timestamps: true },
);

export default model<IFarmer>("Farmer", FarmerSchema);
