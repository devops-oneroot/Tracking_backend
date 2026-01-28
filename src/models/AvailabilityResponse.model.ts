import mongoose, { Schema, Document } from "mongoose";

export interface IAvailabilityResponse extends Document {
  sessionId: mongoose.Types.ObjectId;
  available: boolean;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
}

const schema = new Schema<IAvailabilityResponse>({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: "TrackingSession",
    required: true,
  },
  available: { type: Boolean, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAvailabilityResponse>(
  "AvailabilityResponse",
  schema,
);
