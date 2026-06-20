import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema({
  schemeName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  benefits: { type: [String], default: [] },
  eligibility: { type: [String], default: [] },
  requiredDocuments: { type: [String], default: [] },
  applicationProcess: { type: [String], default: [] },
  officialLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Scheme = mongoose.model("Scheme", schemeSchema);
export default Scheme;
