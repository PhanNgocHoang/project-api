const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: { type: String },
    displayName: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    fbId: { type: String, default: null },
    googleId: { type: String, default: null },
    role: {
      type: String,
      required: true,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    photoUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
UserSchema.index({ "$**": "text" });
const User = mongoose.model("users", UserSchema);

module.exports = User;
