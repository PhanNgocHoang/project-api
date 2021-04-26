const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: { type: String, default: null },
    displayName: { type: String, required: true },
    password: { type: String },
    dob: { type: Date },
    fbId: { type: String, default: null },
    googleId: { type: String, default: null },
    role: {
      type: String,
      required: true,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    photoUrl: {
      type: String,
      default:
        "https://storage.googleapis.com/e-library-705ec.appspot.com/115-1150053_avatar-png-transparent-png-royalty-free-default-user.png",
    },
    wallet: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
UserSchema.index({ "$**": "text" });
const User = mongoose.model("users", UserSchema);
module.exports = User;
