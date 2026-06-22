import mongoose from "mongoose";
import dotenv from "dotenv";
import Scheme from "./models/Scheme.js";
import connectDB from "./config/db.js";

dotenv.config({ path: ".env" });

const updateSchemes = async () => {
  try {
    await connectDB();
    const result = await Scheme.updateMany(
      { state: { $exists: false } },
      { $set: { state: "Maharashtra" } }
    );
    console.log(`Updated ${result.modifiedCount} schemes to have state 'Maharashtra'`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating schemes:", error);
    process.exit(1);
  }
};

updateSchemes();
