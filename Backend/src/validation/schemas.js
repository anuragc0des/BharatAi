import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userProfileSchema = z.object({
  authUserId: z.string().length(24, "Invalid user ID format").optional(),
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age cannot be negative").max(125, "Invalid age"),
  gender: z.enum(["Male", "Female", "Transgender", "Other"], {
    errorMap: () => ({ message: "Gender must be Male, Female, Transgender, or Other" }),
  }),
  maritalStatus: z.enum(["Single", "Married", "Widowed", "Divorced"]).optional(),
  state: z.string().min(1, "State is required"),
  district: z.string().optional(),
  residenceType: z.enum(["Urban", "Rural", "Semi-Urban"]).optional(),
  education: z.string().min(1, "Education is required"),
  occupation: z.string().min(1, "Occupation is required"),
  employmentStatus: z.string().min(1, "Employment status is required"),
  annualIncome: z.number().min(0, "Annual income cannot be negative"),
  bplStatus: z.enum(["Yes", "No"]).optional(),
  rationCardType: z.enum(["None", "APL", "BPL", "Antyodaya", "PHH"]).optional(),
  category: z.string().min(1, "Category is required"),
  religion: z.string().optional(),
  minority: z.enum(["Yes", "No"]).optional(),
  studentStatus: z.enum(["Yes", "No"]),
  farmerStatus: z.enum(["Yes", "No"]),
  entrepreneurStatus: z.enum(["Yes", "No"]),
  disabilityStatus: z.enum(["Yes", "No"]).optional(),
  disabilityPercentage: z.number().min(0).max(100).optional(),
  seniorCitizen: z.enum(["Yes", "No"]).optional(),
  exServiceman: z.enum(["Yes", "No"]).optional(),
  constructionWorker: z.enum(["Yes", "No"]).optional(),
  landOwnership: z.enum(["Yes", "No"]).optional(),
  landSizeAcres: z.number().min(0).optional(),
});

export const recommendationSchema = z.object({
  userId: z.string().length(24, "Invalid user ID format"),
});

export const chatSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  question: z.string().min(1, "Question cannot be empty"),
});

export const savedSchemeSchema = z.object({
  schemeId: z.string().length(24, "Invalid scheme ID format"),
});
