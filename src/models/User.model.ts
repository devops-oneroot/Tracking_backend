import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["field_guy", "agronomist"],
      required: true,
    },
  },
  { timestamps: true }
);

export default model("User", userSchema);
