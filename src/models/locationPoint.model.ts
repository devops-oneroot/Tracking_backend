// import { Schema, model, Types } from "mongoose";

// const locationPointSchema = new Schema(
//   {
//     userId: { type: Types.ObjectId, ref: "User", required: true },
//     sessionId: { type: Types.ObjectId, ref: "TrackingSession", required: true },

//     lat: { type: Number, required: true },
//     lng: { type: Number, required: true },
//     accuracy: Number,

//     timestamp: { type: Date, required: true },

//     fromOfflineSync: { type: Boolean, default: false },
//   },
//   { timestamps: true },
// );

// locationPointSchema.index({ sessionId: 1, timestamp: 1 });

// export default model("LocationPoint", locationPointSchema);

import { Schema, model, Types } from "mongoose";

const locationPointSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    sessionId: { type: Types.ObjectId, ref: "TrackingSession", required: true },

    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    accuracy: Number,

    availability: { type: String, enum: ["yes", "no"] }, // ✅ ADD

    timestamp: { type: Date, required: true },

    fromOfflineSync: { type: Boolean, default: false },
  },
  { timestamps: true },
);

locationPointSchema.index({ sessionId: 1, timestamp: 1 });

export default model("LocationPoint", locationPointSchema);
