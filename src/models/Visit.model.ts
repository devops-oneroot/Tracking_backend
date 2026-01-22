import { Schema, model } from "mongoose";

export default model(
  "Visit",
  new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      latitude: Number,
      longitude: Number,
      hasLoad: Boolean,
      remark: String,
      image: String,
      load: { type: Schema.Types.ObjectId, ref: "Load" },
    },
    { timestamps: true }
  )
);
