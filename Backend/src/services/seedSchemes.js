import Scheme from "../models/Scheme.js";

const defaultSchemes = [
  {
    schemeName: "Pradhan Mantri Kaushal Vikas Yojana",
    category: "OBC",
    description: "Skill training and placement support for youth.",
    benefits: ["Free skill training", "Certification", "Placement assistance"],
    eligibility: [
      "Age 18-35",
      "OBC or non-general category",
      "Annual income below ₹3 lakh",
    ],
    requiredDocuments: ["Aadhaar card", "Address proof", "Income certificate"],
    applicationProcess: [
      "Register on the official portal",
      "Choose training center",
      "Upload documents",
    ],
    officialLink: "https://www.pmkvyofficial.org",
  },
  {
    schemeName: "PM Kisan Samman Nidhi",
    category: "Farmer",
    description: "Income support for small and marginal farmers.",
    benefits: ["₹6,000 per year", "Direct bank transfer"],
    eligibility: ["Farmer status", "Landholding criteria", "Resident of India"],
    requiredDocuments: [
      "Land ownership documents",
      "Aadhaar card",
      "Bank passbook",
    ],
    applicationProcess: [
      "Visit PM-Kisan portal",
      "Fill registration form",
      "Verify details",
    ],
    officialLink: "https://pmkisan.gov.in",
  },
  {
    schemeName: "National Scholarship for Higher Education",
    category: "Student",
    description: "Financial aid for higher education students.",
    benefits: ["Tuition fee support", "Stipend for studies"],
    eligibility: [
      "Student status",
      "Annual income below ₹3 lakh",
      "Admission in eligible college",
    ],
    requiredDocuments: [
      "Admission proof",
      "Income certificate",
      "Aadhaar card",
    ],
    applicationProcess: [
      "Register on scholarship portal",
      "Upload required documents",
      "Submit application",
    ],
    officialLink: "https://scholarships.gov.in",
  },
];

const seedSchemes = async () => {
  const count = await Scheme.countDocuments();
  if (count === 0) {
    await Scheme.create(defaultSchemes);
    console.log("Seeded default scheme data");
  }
};

export default seedSchemes;
