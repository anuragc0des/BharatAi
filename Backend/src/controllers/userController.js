import User from "../models/User.js";

export const createUserProfile = async (req, res) => {
  const profileData = req.body;
  const requiredFields = [
    "name",
    "age",
    "gender",
    "state",
    "education",
    "occupation",
    "annualIncome",
    "category",
    "studentStatus",
    "farmerStatus",
    "entrepreneurStatus",
    "employmentStatus",
  ];

  for (const field of requiredFields) {
    if (profileData[field] === undefined || profileData[field] === null) {
      return res.status(400).json({ message: `${field} is required` });
    }
  }

  const user = await User.create(profileData);
  res.status(201).json(user);
};

export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};

export const listUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
};
