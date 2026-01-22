import { Schema, model, Types } from "mongoose";

const trackingSessionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },

    startTime: { type: Date, required: true },
    endTime: { type: Date },

    date: { type: String, required: true },

    startLocation: { lat: Number, lng: Number },
    endLocation: { lat: Number, lng: Number },

    startImage: { type: String }, // ✅ Cloudinary URL
    endImage: { type: String }, // ✅ Cloudinary URL

    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default model("TrackingSession", trackingSessionSchema);
