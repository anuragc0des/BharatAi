import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  state: { type: String, required: true },
  education: { type: String, required: true },
  occupation: { type: String, required: true },
  annualIncome: { type: Number, required: true },
  category: { type: String, required: true },
  studentStatus: { type: String, required: true },
  farmerStatus: { type: String, required: true },
  entrepreneurStatus: { type: String, required: true },
  employmentStatus: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
