import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  addrress: {
    type: String,
    required: false,
  },
  Image: {
    required: false,
    type: String,
    // default: "default_user_image.jpg",
  },
  mobileNumber: {
    type: String,
    match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
  },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const saltRounds = Number(process.env.SALT);
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
userSchema.methods.generateRefreshToken = function (next) {
  this.refereshtoken = jwt.sign({ id: this._id }, process.env.REFEEASH_TOKEN, {
    expiresIn: process.env.REFEEASH_TOKEN_EXPIRE,
  });
  return this.refereshtoken;
};

export const userModel = mongoose.model("users", userSchema);
