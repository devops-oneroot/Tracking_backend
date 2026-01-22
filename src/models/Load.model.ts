// import { Schema, model } from "mongoose";

// const loadSchema = new Schema(
//   {
//     visit: { type: Schema.Types.ObjectId, ref: "Visit", required: true },
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true },

//     productName: String,
//     numberOfVehicles: Number,
//     from: String,
//     to: String,
//     pricePaying: Number,

//     loadStartedAt: Date,
//     loadEndedAt: Date,
//     completionImage: String,
//   },
//   { timestamps: true }
// );

// export default model("Load", loadSchema);

// import { Schema, model } from "mongoose";
// import mongoose from "mongoose";

// const loadSchema = new mongoose.Schema(
//   {
//     visit: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Visit",
//       required: true,
//     },

//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     productName: String,
//     numberOfVehicles: Number,
//     from: String,
//     to: String,
//     pricePaying: Number,

//     loadStartedAt: Date,
//     loadEndedAt: Date,

//     completionImage: String,

//     // ✅ NEW
//     status: {
//       type: String,
//       enum: ["pending", "completed"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Load", loadSchema);

import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const loadSchema = new mongoose.Schema(
  {
    visit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ ADD THIS
    aggregator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aggregator",
      required: true,
    },

    productName: String,
    numberOfVehicles: Number,
    from: String,
    to: String,
    pricePaying: Number,

    loadStartedAt: Date,
    loadEndedAt: Date,

    completionImage: String,

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Load", loadSchema);
