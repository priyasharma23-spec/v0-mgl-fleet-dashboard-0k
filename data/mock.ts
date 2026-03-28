// Mock data for Fleet Operator Portal
export type VehicleStatus = 
  | "DRAFT" 
  | "L1_SUBMITTED" 
  | "L1_APPROVED" 
  | "L1_REJECTED"
  | "L2_SUBMITTED" 
  | "L2_APPROVED" 
  | "L2_REJECTED"
  | "CARD_PRINTED" 
  | "CARD_DISPATCHED" 
  | "CARD_ACTIVE"

export const myVehicles = [
  {
    id: "VH001",
    vehicleNumber: "MH04AB1234",
    oem: "Tata",
    model: "ACE EV",
    category: "LCV",
    status: "CARD_ACTIVE" as VehicleStatus,
    onboardingType: "MIC_ASSISTED" as const,
    l1SubmittedAt: new Date("2025-01-15"),
    l1ApprovedAt: new Date("2025-01-18"),
    l1Comments: null,
    l2SubmittedAt: new Date("2025-02-01"),
    l2ApprovedAt: new Date("2025-02-05"),
    l2Comments: null,
    cardNumber: "MGL****7832",
    cardActivatedAt: new Date("2025-02-10"),
    trackingId: "BLUEDART987654",
  },
  {
    id: "VH002",
    vehicleNumber: "MH04CD5678",
    oem: "Ashok Leyland",
    model: "Boss",
    category: "HCV",
    status: "L1_REJECTED" as VehicleStatus,
    onboardingType: "MIC_ASSISTED" as const,
    l1SubmittedAt: new Date("2025-02-10"),
    l1ApprovedAt: null,
    l1Comments: "Booking receipt is unclear. Please resubmit with clear copy.",
    l2SubmittedAt: null,
    l2ApprovedAt: null,
    l2Comments: null,
    cardNumber: null,
    cardActivatedAt: null,
    trackingId: null,
  },
  {
    id: "VH003",
    vehicleNumber: "MH04EF9012",
    oem: "Volvo",
    model: "FM 440",
    category: "ICV",
    status: "L2_APPROVED" as VehicleStatus,
    onboardingType: "SELF_SERVICE" as const,
    l1SubmittedAt: new Date("2025-01-20"),
    l1ApprovedAt: new Date("2025-01-25"),
    l1Comments: null,
    l2SubmittedAt: new Date("2025-02-05"),
    l2ApprovedAt: new Date("2025-02-08"),
    l2Comments: null,
    cardNumber: "MGL****9456",
    cardActivatedAt: null,
    trackingId: null,
  },
];

export const myFO = {
  id: "FO-2025-0001",
  name: "ABC Transport Pvt Ltd",
  mouNumber: "MGL/MOU/2025/001",
  mouExpiryDate: "31-Dec-2025",
};

export const oems = [
  { id: "TATA", name: "Tata Motors", type: "New Vehicle" },
  { id: "BHARAT", name: "BharatBenz", type: "New Vehicle" },
  { id: "ASHOK", name: "Ashok Leyland", type: "New Vehicle" },
  { id: "VOLVO", name: "Volvo", type: "New Vehicle" },
  { id: "KIRLOSKAR", name: "Kirloskar Pneumatic", type: "Retrofit" },
  { id: "IMPCO", name: "IMPCO Technologies", type: "Retrofit" },
];

export const dealers = [
  { id: "DL001", name: "Tata Motors - Mumbai", city: "Mumbai", oemId: "TATA" },
  { id: "DL002", name: "Tata Motors - Delhi", city: "Delhi", oemId: "TATA" },
  { id: "DL003", name: "BharatBenz - Pune", city: "Pune", oemId: "BHARAT" },
];

export const retrofitters = [
  { id: "RF001", name: "Kirloskar Pneumatic - Mumbai" },
  { id: "RF002", name: "IMPCO Technologies - Pune" },
];

export const getDealersByOEM = (oemId: string) => dealers.filter(d => d.oemId === oemId);
export const getCategoriesByOEM = (oemId: string): ("LCV" | "ICV" | "HCV" | "Bus")[] => ["LCV", "ICV", "HCV"];
export const getModelsByOEMAndCategory = (oemId: string, category: "LCV" | "ICV" | "HCV" | "Bus"): string[] => {
  const models: { [key: string]: string[] } = {
    LCV: ["ACE EV", "Tata 407", "Eicher Pro"],
    ICV: ["FM 440", "FM 410", "Boss"],
    HCV: ["S9000", "S10000", "FM 440"],
  };
  return models[category] || [];
};

export const calculateVehicleAge = (registrationDate: string | Date) => {
  const regDate = new Date(registrationDate);
  const today = new Date();
  
  let years = today.getFullYear() - regDate.getFullYear();
  let months = today.getMonth() - regDate.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months };
};
