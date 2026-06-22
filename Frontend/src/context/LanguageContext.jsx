import { createContext, useContext, useEffect, useState } from "react";

const translations = {
  en: {
    home: "Home",
    profile: "Profile",
    recommendations: "Recommendations",
    schemes: "Schemes",
    chat: "AI Assistant",
    welcomeTitle: "BharatAI — Digital Welfare Copilot",
    welcomeDescription:
      "Discover government schemes you are eligible for and understand why.",
    getStarted: "Get Started",
    language: "Language",
    name: "Name",
    age: "Age",
    gender: "Gender",
    state: "State",
    education: "Education",
    occupation: "Occupation",
    annualIncome: "Annual Income",
    socialCategory: "Social Category",
    studentStatus: "Student Status",
    farmerStatus: "Farmer Status",
    entrepreneurStatus: "Entrepreneur Status",
    employmentStatus: "Employment Status",
    submitProfile: "Submit Profile",
    recommendedSchemes: "Recommended Schemes",
    noRecommendations:
      "No recommendations yet. Please submit your profile first.",
    schemeDetails: "Scheme Details",
    benefits: "Benefits",
    eligibility: "Eligibility",
    requiredDocuments: "Required Documents",
    applicationProcess: "Application Process",
    officialLink: "Official Link",
    askQuestion: "Ask the AI Assistant",
    typeQuestion: "Type your question here",
    send: "Send",
    placeholderFeedback: "This assistant is connected to BharatAI backend.",
    answerLabel: "Answer",
    learnMore: "Learn more",
    backToSchemes: "Back to Schemes",
    login: "Login",
    register: "Register",
    logout: "Logout",
    dashboard: "Dashboard",
    dashboardDescription: "Your saved schemes and recent activity.",
    savedSchemes: "Saved Schemes",
    emptySavedSchemes: "You don't have any saved schemes yet.",
    email: "Email",
    password: "Password",
    loginDescription: "Sign in to access your personalized dashboard.",
    registerDescription:
      "Create an account to save schemes and access personalized tools.",
    searchSchemes: "Search Schemes",
    searchPlaceholder: "Search by scheme name or description",
    allCategories: "All categories",
    compareSchemes: "Compare Schemes",
    comparison: "Comparison",
    missedBenefits: "Missed Benefits",
    missedBenefitsDescription:
      "Find schemes you may be missing based on general need categories.",
    missedBenefitExample:
      "You may be eligible for this scheme if you meet the category criteria and income limit.",
    eligibilityVisualization: "Eligibility Visualization",
    eligibilityVisualizationDescription:
      "See scheme eligibility and benefits side by side.",
    hideBenefits: "Hide benefits",
    showBenefits: "Show benefits",
    applyNow: "Apply Now ↗",
    eligible: "Eligible",
    aiAnalysis: "AI Analysis:",
    match: "Match",
    compareDescription: "Select up to two schemes to compare core details.",
    featureDetails: "Feature / Details",
    description: "Description",
  },
  hi: {
    home: "होम",
    profile: "प्रोफ़ाइल",
    recommendations: "सिफ़ारिशें",
    schemes: "योजनाएँ",
    chat: "एआई सहायक",
    welcomeTitle: "BharatAI — डिजिटल वेलफेयर कॉपायलट",
    welcomeDescription: "जानें कि आप किन सरकारी योजनाओं के पात्र हैं और क्यों।",
    getStarted: "शुरू करें",
    language: "भाषा",
    name: "नाम",
    age: "उम्र",
    gender: "लिंग",
    state: "राज्य",
    education: "शिक्षा",
    occupation: "व्यवसाय",
    annualIncome: "वार्षिक आय",
    socialCategory: "सामाजिक श्रेणी",
    studentStatus: "छात्र स्थिति",
    farmerStatus: "किसान स्थिति",
    entrepreneurStatus: "उद्यमी स्थिति",
    employmentStatus: "रोजगार स्थिति",
    submitProfile: "प्रोफ़ाइल सबमिट करें",
    recommendedSchemes: "सुझाई गई योजनाएँ",
    noRecommendations: "पहले कृपया अपनी प्रोफ़ाइल सबमिट करें।",
    schemeDetails: "योजना विवरण",
    benefits: "लाभ",
    eligibility: "पात्रता",
    requiredDocuments: "आवश्यक दस्तावेज़",
    applicationProcess: "आवेदन प्रक्रिया",
    officialLink: "आधिकारिक लिंक",
    askQuestion: "एआई सहायक से पूछें",
    typeQuestion: "अपना प्रश्न यहां लिखें",
    send: "भेजें",
    placeholderFeedback: "यह सहायक BharatAI बैकएंड से जुड़ा है।",
    answerLabel: "उत्तर",
    learnMore: "और जानें",
    backToSchemes: "योजनाओं पर वापस जाएं",
    login: "लॉगिन",
    register: "रजिस्टर",
    logout: "लॉगआउट",
    dashboard: "डैशबोर्ड",
    dashboardDescription: "आपकी सहेजी गई योजनाएँ और हालिया गतिविधि।",
    savedSchemes: "सहेजी गई योजनाएँ",
    emptySavedSchemes: "आपने अभी तक कोई योजना नहीं सहेजी है।",
    email: "ईमेल",
    password: "पासवर्ड",
    loginDescription: "अपने व्यक्तिगत डैशबोर्ड तक पहुँचने के लिए साइन इन करें।",
    registerDescription: "योजनाओं को सहेजने और व्यक्तिगत टूल तक पहुँचने के लिए एक खाता बनाएं।",
    searchSchemes: "योजनाएं खोजें",
    searchPlaceholder: "योजना का नाम या विवरण खोजें",
    allCategories: "सभी श्रेणियां",
    compareSchemes: "योजनाओं की तुलना करें",
    comparison: "तुलना",
    missedBenefits: "छूटे हुए लाभ",
    missedBenefitsDescription: "सामान्य आवश्यकता श्रेणियों के आधार पर उन योजनाओं को खोजें जो आपसे छूट रही हैं।",
    missedBenefitExample: "यदि आप श्रेणी मानदंडों और आय सीमा को पूरा करते हैं तो आप इस योजना के पात्र हो सकते हैं।",
    eligibilityVisualization: "पात्रता दृश्यता",
    eligibilityVisualizationDescription: "योजना पात्रता और लाभों को अगल-बगल देखें।",
    saved: "सहेजा गया",
    saveScheme: "योजना सहेजें",
    simplifyWithAi: "एआई से सरल बनाएं",
    simplifying: "सरल बनाया जा रहा है...",
    aiSummary: "एआई सारांश (सरल हिंदी)",
    amIEligible: "क्या मैं पात्र हूँ?",
    checking: "जांच की जा रही है...",
    youAreEligible: "आप पात्र हैं!",
    notEligible: "पात्र नहीं",
    reasoning: "कारण",
    missingRequirements: "अधूरी आवश्यकताएं",
    noMessages: "अभी कोई संदेश नहीं है। शुरू करने के लिए एक प्रश्न पूछें!",
    you: "आप",
    typing: "BharatAI टाइप कर रहा है...",
    hideBenefits: "लाभ छिपाएं",
    showBenefits: "लाभ दिखाएं",
    applyNow: "अभी आवेदन करें ↗",
    eligible: "पात्र",
    aiAnalysis: "एआई विश्लेषण:",
    match: "मैच",
    compareDescription: "मुख्य विवरणों की तुलना करने के लिए अधिकतम दो योजनाएं चुनें।",
    featureDetails: "सुविधा / विवरण",
    description: "विवरण",
  },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("bharatai-language");
    if (saved) {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("bharatai-language", language);
  }, [language]);

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
};
