import mongoose from "mongoose";

const authUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const AuthUser = mongoose.model("AuthUser", authUserSchema);
export default AuthUser;
