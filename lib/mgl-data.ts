// MGL Fleet Platform - Mock Data & Types

export type UserRole = "mic" | "zic" | "fleet-operator" | "mgl-admin" | "login";

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
  | "CARD_ACTIVE";

export type FOStatus = "PENDING_ACTIVATION" | "ACTIVE" | "SUSPENDED" | "INACTIVE";
export type OnboardingType = "MIC_ASSISTED" | "SELF_SERVICE";
export type VehicleCategory = "HCV" | "ICV" | "LCV" | "Bus";
export type VehicleType = "NEW_PURCHASE" | "RETROFIT";

export const INCENTIVE_RATES = {
  new_purchase: {
    HCV: 15000,
    ICV: 12000,
    LCV: 8000,
    Bus: 10000,
  },
  retrofit: {
    HCV: 10000,
    ICV: 8000,
    LCV: 5000,
    Bus: 7000,
  },
} as const

export type IncentiveStatus = 
  | "not_eligible"      // first vehicle in category, waiting for 2nd
  | "eligible"          // 2nd+ vehicle approved, awaiting ZIC/admin approval
  | "pending_approval"  // submitted for ZIC/admin incentive approval
  | "approved"          // ZIC/admin approved, pending payment
  | "paid"              // incentive credited to wallet
  | "out_of_scope"      // existing CNG vehicle

// OEM & Dealer Master Data
export interface OEM {
  id: string;
  name: string;
  type: "New Vehicle" | "Retrofitter";
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  email: string;
  mobile: string;
  categories: VehicleCategory[];
  models: Record<VehicleCategory, string[]>;
}

export interface Dealer {
  id: string;
  oemId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  email: string;
  mobile: string;
}

export interface Retrofitter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  email: string;
  mobile: string;
}

// OEM Master Data from PRD
export const oems: OEM[] = [
  {
    id: "OEM001",
    name: "Tata Motors",
    type: "New Vehicle",
    address: "Bombay House, 24 Homi Mody Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    contactPerson: "Rajesh Kumar",
    email: "fleet@tatamotors.com",
    mobile: "9876543210",
    categories: ["HCV", "ICV", "LCV", "Bus"],
    models: {
      "HCV": ["1612g", "1912g"],
      "ICV": ["1109g"],
      "LCV": ["407g", "609g", "709g"],
      "Bus": ["LP410 CNG", "LP913", "51 S SKI", "34 S SKI", "24S STAFF NAC/AC"],
    },
  },
  {
    id: "OEM002",
    name: "Eicher (VECV)",
    type: "New Vehicle",
    address: "Eicher House, 12 Commercial Complex",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    contactPerson: "Vikram Singh",
    email: "commercial@eicher.in",
    mobile: "9123456789",
    categories: ["HCV", "ICV", "LCV", "Bus"],
    models: {
      "HCV": ["Pro 2119", "Pro 2114XP", "Pro 2118", "Pro 3018"],
      "ICV": ["Pro 2109 CNG", "Pro 2095XP", "Pro 2110", "Pro 2110XP"],
      "LCV": ["Pro 2049 CNG", "Pro 2059 CNG", "Pro 2059XP CNG", "Pro 2075 CNG"],
      "Bus": ["2090", "Pro 2075", "Pro 3010"],
    },
  },
  {
    id: "OEM003",
    name: "Ashok Leyland",
    type: "New Vehicle",
    address: "Ashok Leyland Technical Centre",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600086",
    contactPerson: "Suresh Iyer",
    email: "fleet@ashokleyland.com",
    mobile: "9988776655",
    categories: ["ICV", "HCV"],
    models: {
      "ICV": ["E Comet 1110", "E Comet 1415", "E Comet 1115"],
      "HCV": ["E Comet 1615", "E Comet 1915", "E Comet 1922", "E Comet 2822"],
      "LCV": [],
      "Bus": [],
    },
  },
];

// Dealers linked to OEMs
export const dealers: Dealer[] = [
  { id: "DLR001", oemId: "OEM001", name: "Tata Motors Andheri", address: "Andheri East", city: "Mumbai", state: "Maharashtra", pincode: "400093", contactPerson: "Raj Mehta", email: "andheri@tatadealers.com", mobile: "9876501234" },
  { id: "DLR002", oemId: "OEM001", name: "Tata Motors Thane", address: "Thane West", city: "Thane", state: "Maharashtra", pincode: "400601", contactPerson: "Amit Joshi", email: "thane@tatadealers.com", mobile: "9876502345" },
  { id: "DLR003", oemId: "OEM001", name: "Tata Pune Central", address: "Pune Station Road", city: "Pune", state: "Maharashtra", pincode: "411001", contactPerson: "Sanjay Kulkarni", email: "pune@tatadealers.com", mobile: "9876503456" },
  { id: "DLR004", oemId: "OEM002", name: "Eicher Goregaon", address: "Goregaon East", city: "Mumbai", state: "Maharashtra", pincode: "400063", contactPerson: "Vinay Desai", email: "goregaon@eicherdealers.com", mobile: "9123401234" },
  { id: "DLR005", oemId: "OEM002", name: "Eicher Navi Mumbai", address: "Vashi", city: "Navi Mumbai", state: "Maharashtra", pincode: "400703", contactPerson: "Prakash Rao", email: "navimumbai@eicherdealers.com", mobile: "9123402345" },
  { id: "DLR006", oemId: "OEM003", name: "AL Dealers Kurla", address: "Kurla West", city: "Mumbai", state: "Maharashtra", pincode: "400070", contactPerson: "Mahesh Kumar", email: "kurla@aldealers.com", mobile: "9988701234" },
  { id: "DLR007", oemId: "OEM003", name: "AL Dealers Pune", address: "Hadapsar", city: "Pune", state: "Maharashtra", pincode: "411028", contactPerson: "Ramesh Patil", email: "pune@aldealers.com", mobile: "9988702345" },
];

// Retrofitters (not OEM-specific, apply broadly)
export const retrofitters: Retrofitter[] = [
  { id: "RET001", name: "Shigan Telematics Private Limited", address: "Unit 5, MIDC Taloja", city: "Navi Mumbai", state: "Maharashtra", pincode: "410208", contactPerson: "Rahul Shigan", email: "info@shigantelematics.com", mobile: "9111222333" },
  { id: "RET002", name: "Amol Prala Clean Energy Pvt. Ltd", address: "Plot 22, Chakan MIDC", city: "Pune", state: "Maharashtra", pincode: "410501", contactPerson: "Amol Prabhune", email: "retrofit@amolprala.com", mobile: "9222333444" },
  { id: "RET003", name: "Advantek Global", address: "Survey No. 45, Bhosari", city: "Pune", state: "Maharashtra", pincode: "411026", contactPerson: "Sandeep Jain", email: "sales@advantekglobal.in", mobile: "9333444555" },
];

// Helper functions for dropdown cascading
export function getOEMsByType(type: "New Vehicle" | "Retrofitter" | "all" = "all") {
  if (type === "all") return oems;
  return oems.filter(o => o.type === type);
}

export function getDealersByOEM(oemId: string) {
  return dealers.filter(d => d.oemId === oemId);
}

export function getCategoriesByOEM(oemId: string): VehicleCategory[] {
  const oem = oems.find(o => o.id === oemId);
  return oem?.categories || [];
}

export function getModelsByOEMAndCategory(oemId: string, category: VehicleCategory): string[] {
  const oem = oems.find(o => o.id === oemId);
  return oem?.models[category] || [];
}

// Vehicle category classification
export function classifyVehicleCategory(grossWeight: number): VehicleCategory {
  if (grossWeight >= 15) return "HCV";
  if (grossWeight >= 10) return "ICV";
  if (grossWeight > 3.5) return "LCV";
  return "LCV";
}

// Calculate vehicle age from registration date
export function calculateVehicleAge(registrationDate: string): { years: number; months: number } {
  const regDate = new Date(registrationDate);
  const now = new Date();
  const diffMs = now.getTime() - regDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  return { years, months };
}

// Compute incentive eligibility based on category sequence and vehicle type
export function computeIncentiveEligibility(
  vehicles: Vehicle[],
  mouId: string
): Map<string, { eligible: boolean; sequence: number; amount: number | null }> {
  const result = new Map<string, { eligible: boolean; sequence: number; amount: number | null }>()
  
  // Group by category + vehicleType within same MOU
  const groups = new Map<string, Vehicle[]>()
  
  vehicles
    .filter(v => v.mouId === mouId && v.onboardingType === "MIC_ASSISTED" && v.vehicleType !== "existing_cng")
    .forEach(v => {
      const key = `${v.category}_${v.vehicleType}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(v)
    })
  
  groups.forEach((groupVehicles) => {
    // Sort by categorySequence
    const sorted = [...groupVehicles].sort((a, b) => (a.categorySequence ?? 0) - (b.categorySequence ?? 0))
    const hasSecond = sorted.length >= 2
    
    sorted.forEach((v, idx) => {
      const eligible = hasSecond // all vehicles eligible if group has 2+
      const vType = v.vehicleType as "new_purchase" | "retrofit"
      const cat = v.category as keyof typeof INCENTIVE_RATES.new_purchase
      const amount = eligible && vType && cat ? INCENTIVE_RATES[vType]?.[cat] ?? null : null
      result.set(v.id, { eligible, sequence: idx + 1, amount })
    })
  })
  
  return result
}


export interface FleetOperator {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  pan: string;
  gstn: string;
  registeredAddress: string;
  deliveryAddress: string;
  status: FOStatus;
  onboardingType: OnboardingType;
  mouNumber?: string;
  mouExecutionDate?: string;
  mouExpiryDate?: string;
  vehiclesPurchased?: number;
  vehiclesRetrofitted?: number;
  totalVehicles: number;
  activeCards: number;
  createdAt: string;
  micId: string;
}

export interface Vehicle {
  id: string;
  foId: string;
  foName: string;
  vehicleNumber?: string;
  model: string;
  category: "HCV" | "ICV" | "LCV" | "Bus";
  oem: string;
  dealership: string;
  bookingReceiptUrl?: string;
  bookingDate: string;
  rcBookUrl?: string;
  registrationDate?: string;
  driverName?: string;
  driverContact?: string;
  status: VehicleStatus;
  l1SubmittedAt?: string;
  l1ApprovedAt?: string;
  l1RejectedAt?: string;
  l1Comments?: string;
  l1ApproverId?: string;
  l2SubmittedAt?: string;
  l2ApprovedAt?: string;
  l2RejectedAt?: string;
  l2Comments?: string;
  l2ApproverId?: string;
  cardNumber?: string;
  cardDispatchDate?: string;
  cardDeliveryDate?: string;
  trackingId?: string;
  cardActivatedAt?: string;
  onboardingType: OnboardingType;
  deliveryChallanUrl?: string;
  deliveryDate?: string;
  cngCertUrl?: string;
  eFitmentUrl?: string;
  vehicleType?: "new_purchase" | "retrofit";
  mouId?: string;                          // linked MOU number e.g. "MGL/MOU/2025/001"
  categorySequence?: number;               // order added within same MOU + category (1, 2, 3...)
  incentiveStatus?: IncentiveStatus;       // eligibility and approval state
  incentiveAmount?: number;                // computed incentive amount in INR
  incentiveApprovedBy?: string;            // ZIC or admin user ID
  incentiveApprovedAt?: string;            // approval timestamp
  incentiveNote?: string;                  // reason or note from approver
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  time: string;
  read: boolean;
  targetRole: UserRole | "all";
}

export interface CardTransaction {
  id: string;
  cardId: string;
  date: string;
  type: "load" | "spend" | "incentive" | "refund";
  wallet: "card" | "incentive";
  amount: number;
  status: "success" | "pending" | "failed";
  source?: string;
  campaign?: string;
}

export interface CardBalance {
  cardWallet: {
    balance: number;
    coins: number;
  };
  incentiveWallet: {
    balance: number;
    coins: number;
  };
}

// ─── Mock Card Transactions ───────────────────────────────────────────────────
export const mockCardTransactions: CardTransaction[] = [
  {
    id: "TXN001",
    cardId: "CARD001",
    date: "2024-05-10T10:15:00",
    type: "load",
    wallet: "card",
    amount: 1200,
    status: "success",
    source: "Parent Wallet Transfer",
  },
  {
    id: "TXN002",
    cardId: "CARD001",
    date: "2024-05-08T14:30:00",
    type: "incentive",
    wallet: "incentive",
    amount: 50,
    status: "success",
    campaign: "May Fuel Saver Offer",
  },
  {
    id: "TXN003",
    cardId: "CARD001",
    date: "2024-05-07T09:20:00",
    type: "spend",
    wallet: "card",
    amount: -800,
    status: "success",
    source: "Fuel Purchase",
  },
  {
    id: "TXN004",
    cardId: "CARD001",
    date: "2024-05-06T16:45:00",
    type: "spend",
    wallet: "card",
    amount: -650,
    status: "success",
    source: "Fuel Purchase",
  },
  {
    id: "TXN005",
    cardId: "CARD001",
    date: "2024-05-05T11:10:00",
    type: "load",
    wallet: "card",
    amount: 2000,
    status: "success",
    source: "Parent Wallet Transfer",
  },
  {
    id: "TXN006",
    cardId: "CARD001",
    date: "2024-05-04T08:30:00",
    type: "incentive",
    wallet: "incentive",
    amount: 100,
    status: "success",
    campaign: "Efficiency Bonus",
  },
  {
    id: "TXN007",
    cardId: "CARD001",
    date: "2024-05-03T15:20:00",
    type: "spend",
    wallet: "card",
    amount: -900,
    status: "success",
    source: "Fuel Purchase",
  },
  {
    id: "TXN008",
    cardId: "CARD001",
    date: "2024-05-02T10:45:00",
    type: "spend",
    wallet: "card",
    amount: -750,
    status: "success",
    source: "Fuel Purchase",
  },
  {
    id: "TXN009",
    cardId: "CARD001",
    date: "2024-05-01T12:30:00",
    type: "load",
    wallet: "card",
    amount: 1500,
    status: "success",
    source: "Parent Wallet Transfer",
  },
  {
    id: "TXN010",
    cardId: "CARD001",
    date: "2024-04-30T09:15:00",
    type: "spend",
    wallet: "card",
    amount: -850,
    status: "success",
    source: "Fuel Purchase",
  },
];

// ─── Mock Fleet Operators ───────────────────────────────────────────────────
export const mockFleetOperators: FleetOperator[] = [
  {
    id: "FO001",
    name: "ABC Logistics Pvt. Ltd.",
    contactNumber: "9876543210",
    email: "admin@abclogistics.com",
    pan: "AABCA1234F",
    gstn: "27AABCA1234F1Z5",
    registeredAddress: "Plot 45, MIDC Andheri East, Mumbai 400093",
    deliveryAddress: "Warehouse 12, Bhiwandi Industrial Estate, Thane 421302",
    status: "ACTIVE",
    onboardingType: "MIC_ASSISTED",
    mouNumber: "MGL/MOU/2025/001",
    mouExecutionDate: "2025-01-15",
    mouExpiryDate: "2026-01-14",
    vehiclesPurchased: 10,
    vehiclesRetrofitted: 5,
    totalVehicles: 12,
    activeCards: 8,
    createdAt: "2025-01-15",
    micId: "MIC001",
  },
  {
    id: "FO002",
    name: "Sunrise Transport Co.",
    contactNumber: "9123456789",
    email: "info@sunrisetransport.in",
    pan: "AAZST5678K",
    gstn: "27AAZST5678K1Z3",
    registeredAddress: "15 MG Road, Pune 411001",
    deliveryAddress: "Survey No. 88, Hinjewadi Phase 2, Pune 411057",
    status: "ACTIVE",
    onboardingType: "SELF_SERVICE",
    totalVehicles: 6,
    activeCards: 6,
    createdAt: "2025-02-10",
    micId: "MIC001",
  },
  {
    id: "FO003",
    name: "Metro Freight Solutions",
    contactNumber: "9988776655",
    email: "ops@metrofreight.com",
    pan: "AACMF9012P",
    gstn: "27AACMF9012P1Z8",
    registeredAddress: "Unit 3, Turbhe MIDC, Navi Mumbai 400703",
    deliveryAddress: "Unit 3, Turbhe MIDC, Navi Mumbai 400703",
    status: "PENDING_ACTIVATION",
    onboardingType: "MIC_ASSISTED",
    mouNumber: "MGL/MOU/2025/003",
    mouExecutionDate: "2025-03-01",
    mouExpiryDate: "2026-02-28",
    vehiclesPurchased: 20,
    vehiclesRetrofitted: 0,
    totalVehicles: 0,
    activeCards: 0,
    createdAt: "2025-03-01",
    micId: "MIC002",
  },
  {
    id: "FO004",
    name: "Rapid Delivery Services",
    contactNumber: "9765432100",
    email: "rapid@rds.co.in",
    pan: "AAKRD3456M",
    gstn: "27AAKRD3456M1Z1",
    registeredAddress: "67 Goregaon Link Road, Mumbai 400062",
    deliveryAddress: "67 Goregaon Link Road, Mumbai 400062",
    status: "ACTIVE",
    onboardingType: "SELF_SERVICE",
    totalVehicles: 3,
    activeCards: 3,
    createdAt: "2025-02-20",
    micId: "MIC001",
  },
  {
    id: "FO005",
    name: "Priya Transport Services",
    contactNumber: "9876505678",
    email: "priya@priyatransport.com",
    pan: "BCDPF5678G",
    gstn: "",
    registeredAddress: "Plot 45, Andheri East, Mumbai 400069",
    deliveryAddress: "Plot 45, Andheri East, Mumbai 400069",
    status: "ACTIVE",
    onboardingType: "SELF_SERVICE",
    totalVehicles: 3,
    activeCards: 1,
    createdAt: "2025-03-20",
    micId: "MIC001",
  },
  {
    id: "FO006",
    name: "Vijay Fleet Solutions",
    contactNumber: "9876506789",
    email: "vijay@vijayfleet.com",
    pan: "EFGVF6789H",
    gstn: "27EFGVF6789H1Z4",
    registeredAddress: "Plot 22, Vasai West, Mumbai 401202",
    deliveryAddress: "Plot 22, Vasai West, Mumbai 401202",
    status: "PENDING_ACTIVATION" as FOStatus,
    onboardingType: "MIC_ASSISTED" as OnboardingType,
    totalVehicles: 0,
    activeCards: 0,
    createdAt: "2025-03-28",
    micId: "MIC001",
  },
];

// ─── Mock Vehicles ──────────────────────────────────────────────────────────
export const mockVehicles: Vehicle[] = [
  {
    id: "VEH001",
    foId: "FO001",
    foName: "ABC Logistics Pvt. Ltd.",
    vehicleNumber: "MH04AB1234",
    model: "Tata LPT 2518",
    category: "HCV",
    oem: "Tata Motors",
    dealership: "Tata Motors Andheri",
    bookingDate: "2025-01-20",
    registrationDate: "2025-02-05",
    deliveryDate: "2025-02-05",
    driverName: "Ramesh Kumar",
    driverContact: "9876501234",
    status: "CARD_ACTIVE",
    l1SubmittedAt: "2025-01-22",
    l1ApprovedAt: "2025-01-24",
    l2SubmittedAt: "2025-02-06",
    l2ApprovedAt: "2025-02-08",
    cardNumber: "MGL****4521",
    cardDispatchDate: "2025-02-12",
    cardDeliveryDate: "2025-02-15",
    trackingId: "DTDC123456789",
    cardActivatedAt: "2025-02-16",
    onboardingType: "MIC_ASSISTED",
    deliveryChallanUrl: "delivery_challan_veh001.pdf",
    cngCertUrl: undefined,
    eFitmentUrl: undefined,
    rtoEndorsementUrl: undefined,
    deliveryDate: "2025-02-05",
    vehicleType: "new_purchase",
    mouId: "MGL/MOU/2025/001",
    categorySequence: 1,
    incentiveStatus: "paid",
    incentiveAmount: 15000,
  },
  {
    id: "VEH002",
    foId: "FO001",
    foName: "ABC Logistics Pvt. Ltd.",
    vehicleNumber: "MH04CD5678",
    model: "Ashok Leyland 1616",
    category: "HCV",
    oem: "Ashok Leyland",
    dealership: "AL Dealers Kurla",
    bookingDate: "2025-01-22",
    registrationDate: "2025-02-15",
    deliveryDate: "2025-02-10",
    status: "L2_SUBMITTED",
    l1SubmittedAt: "2025-01-25",
    l1ApprovedAt: "2025-01-27",
    l2SubmittedAt: "2025-02-11",
    onboardingType: "MIC_ASSISTED",
    deliveryChallanUrl: "delivery_challan_veh002.pdf",
    vehicleType: "new_purchase",
    mouId: "MGL/MOU/2025/001",
    categorySequence: 2,
    incentiveStatus: "approved",
    incentiveAmount: 15000,
  },
  {
    id: "VEH003",
    foId: "FO001",
    foName: "ABC Logistics Pvt. Ltd.",
    vehicleNumber: "MH04EF9012",
    model: "Eicher Pro 2095",
    category: "ICV",
    oem: "Eicher",
    dealership: "Eicher Goregaon",
    bookingDate: "2025-02-01",
    status: "L1_REJECTED",
    l1SubmittedAt: "2025-02-03",
    l1RejectedAt: "2025-02-05",
    l1Comments: "Vehicle booking receipt is unclear. Please re-upload a higher quality scan.",
    onboardingType: "MIC_ASSISTED",
    vehicleType: "new_purchase",
    mouId: "MGL/MOU/2025/001",
    categorySequence: 1,
    incentiveStatus: "not_eligible",
  },
  {
    id: "VEH004",
    foId: "FO002",
    foName: "Sunrise Transport Co.",
    vehicleNumber: "MH12GH3456",
    model: "Tata 407",
    category: "LCV",
    oem: "Tata Motors",
    dealership: "Tata Pune Central",
    bookingDate: "2025-02-12",
    registrationDate: "2025-02-25",
    status: "CARD_DISPATCHED",
    l1SubmittedAt: "2025-02-14",
    l1ApprovedAt: "2025-02-16",
    cardNumber: "MGL****7832",
    cardDispatchDate: "2025-03-01",
    trackingId: "BLUEDART987654",
    onboardingType: "SELF_SERVICE",
    vehicleType: "new_purchase",
  },
  {
    id: "VEH005",
    foId: "FO002",
    foName: "Sunrise Transport Co.",
    vehicleNumber: "MH12IJ7890",
    model: "Mahindra Bolero Pik-Up",
    category: "LCV",
    oem: "Mahindra",
    dealership: "Mahindra Pune West",
    bookingDate: "2025-02-15",
    status: "L1_SUBMITTED",
    l1SubmittedAt: "2025-02-17",
    onboardingType: "SELF_SERVICE",
    vehicleType: "new_purchase",
  },
  {
    id: "VEH006",
    foId: "FO004",
    foName: "Rapid Delivery Services",
    vehicleNumber: "MH02KL1122",
    model: "Force Traveller",
    category: "Bus",
    oem: "Force Motors",
    dealership: "Force Mumbai North",
    bookingDate: "2025-02-22",
    registrationDate: "2025-03-05",
    driverName: "Suresh Patil",
    driverContact: "9876543221",
    status: "CARD_ACTIVE",
    l1SubmittedAt: "2025-02-24",
    l1ApprovedAt: "2025-02-26",
    cardNumber: "MGL****2210",
    cardDispatchDate: "2025-03-08",
    cardDeliveryDate: "2025-03-10",
    trackingId: "SPEEDPOST112233",
    cardActivatedAt: "2025-03-11",
    onboardingType: "SELF_SERVICE",
    vehicleType: "new_purchase",
  },
  {
    id: "VEH007",
    foId: "FO001",
    foName: "ABC Logistics Pvt. Ltd.",
    vehicleNumber: "MH04MN3344",
    model: "Tata LPT 1109",
    category: "ICV",
    oem: "Tata Motors",
    dealership: "Tata Motors Andheri",
    bookingDate: "2025-03-01",
    registrationDate: "2025-03-10",
    driverName: "Suresh Patil",
    driverContact: "9876509988",
    status: "L1_APPROVED",
    l1SubmittedAt: "2025-03-05",
    l1ApprovedAt: "2025-03-07",
    onboardingType: "MIC_ASSISTED",
    bookingReceiptUrl: "booking_veh007.pdf",
    rcBookUrl: "rc_veh007.pdf",
    vehicleType: "new_purchase",
    mouId: "MGL/MOU/2025/001",
    categorySequence: 2,
    incentiveStatus: "eligible",
    incentiveAmount: 12000,
  },
  {
    id: "VEH008",
    foId: "FO001",
    foName: "ABC Logistics Pvt. Ltd.",
    vehicleNumber: "MH04PQ5566",
    model: "Ashok Leyland 1616",
    category: "HCV",
    oem: "Ashok Leyland",
    dealership: "AL Dealers Kurla",
    bookingDate: "2025-03-10",
    status: "L1_APPROVED",
    l1SubmittedAt: "2025-03-12",
    l1ApprovedAt: "2025-03-14",
    onboardingType: "MIC_ASSISTED",
    bookingReceiptUrl: "booking_veh008.pdf",
    rcBookUrl: "rc_veh008.pdf",
    vehicleType: "new_purchase",
    mouId: "MGL/MOU/2025/001",
    categorySequence: 3,
    incentiveStatus: "eligible",
    incentiveAmount: 15000,
  },
  {
    id: "VEH009",
    foId: "FO001",
    foName: "ABC Logistics Pvt. Ltd.",
    vehicleNumber: "MH04RR7788",
    model: "Ashok Leyland 1616",
    category: "HCV",
    oem: "Ashok Leyland",
    dealership: "AL Dealers Kurla",
    bookingDate: "2025-03-15",
    registrationDate: "2022-06-10",
    driverName: "Manoj Tiwari",
    driverContact: "9876504321",
    status: "L1_APPROVED",
    l1SubmittedAt: "2025-03-17",
    l1ApprovedAt: "2025-03-19",
    onboardingType: "MIC_ASSISTED",
    bookingReceiptUrl: "booking_veh009.pdf",
    rcBookUrl: "rc_veh009.pdf",
    vehicleType: "retrofit",
    mouId: "MGL/MOU/2025/001",
    categorySequence: 1,
    incentiveStatus: "not_eligible",
  },
  {
    id: "VEH010",
    foId: "FO005",
    foName: "Priya Transport Services",
    vehicleNumber: "MH01SS1001",
    model: "Tata 407",
    category: "LCV",
    oem: "Tata Motors",
    dealership: "Tata Motors Andheri",
    bookingDate: "2025-03-20",
    registrationDate: "2024-06-15",
    driverName: "Sunil Rao",
    driverContact: "9876506789",
    status: "CARD_ACTIVE",
    l1SubmittedAt: "2025-03-21",
    l1ApprovedAt: "2025-03-23",
    cardNumber: "MGL****9901",
    cardDispatchDate: "2025-03-28",
    cardDeliveryDate: "2025-03-30",
    cardActivatedAt: "2025-03-31",
    trackingId: "FEDEX112233",
    onboardingType: "SELF_SERVICE",
    bookingReceiptUrl: undefined,
    rcBookUrl: "rc_veh010.pdf",
    vehicleType: "new_purchase",
  },
  {
    id: "VEH011",
    foId: "FO005",
    foName: "Priya Transport Services",
    vehicleNumber: "MH01SS1002",
    model: "Mahindra Bolero Pik-Up",
    category: "LCV",
    oem: "Mahindra",
    dealership: "Mahindra Andheri",
    bookingDate: "2025-03-22",
    registrationDate: "2024-08-10",
    status: "L1_SUBMITTED",
    l1SubmittedAt: "2025-03-23",
    onboardingType: "SELF_SERVICE",
    rcBookUrl: "rc_veh011.pdf",
    vehicleType: "new_purchase",
  },
  {
    id: "VEH012",
    foId: "FO005",
    foName: "Priya Transport Services",
    vehicleNumber: "MH01SS1003",
    model: "Eicher Pro 2095",
    category: "ICV",
    oem: "Eicher",
    dealership: "Eicher Goregaon",
    bookingDate: "2025-03-25",
    registrationDate: "2023-11-20",
    status: "L1_REJECTED",
    l1SubmittedAt: "2025-03-26",
    l1RejectedAt: "2025-03-28",
    l1Comments: "RC Book is not clearly legible. Please upload a higher quality scan.",
    onboardingType: "SELF_SERVICE",
    vehicleType: "new_purchase",
  },
  {
    id: "VEH013",
    foId: "FO001",
    foName: "ABC Logistics Pvt. Ltd.",
    vehicleNumber: "MH04KL9876",
    model: "BharatBenz 4923",
    category: "HCV",
    oem: "BharatBenz",
    dealership: "BharatBenz Mumbai",
    bookingDate: "2025-04-01",
    registrationDate: undefined,
    driverName: "Vikram Singh",
    driverContact: "9876507654",
    status: "L1_SUBMITTED",
    l1SubmittedAt: "2025-04-02",
    onboardingType: "MIC_ASSISTED",
    bookingReceiptUrl: "booking_veh013.pdf",
    rcBookUrl: undefined,
    vehicleType: "new_purchase",
    mouId: "MGL/MOU/2025/001",
    categorySequence: 4,
    incentiveStatus: "not_eligible",
  },
];

// ─── Mock Notifications ─────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  {
    id: "N001",
    title: "New L1 Approval Pending",
    message: "Vehicle MH04CD5678 (ABC Logistics) requires L1 review",
    type: "warning",
    time: "10 min ago",
    read: false,
    targetRole: "mic",
  },
  {
    id: "N002",
    title: "New L2 Approval Pending",
    message: "Vehicle VEH002 - ABC Logistics submitted L2 documents",
    type: "warning",
    time: "25 min ago",
    read: false,
    targetRole: "zic",
  },
  {
    id: "N003",
    title: "Card Activated",
    message: "Card MGL****2210 for Rapid Delivery Services is now active",
    type: "success",
    time: "1 hr ago",
    read: true,
    targetRole: "mic",
  },
  {
    id: "N004",
    title: "Document Rejected",
    message: "Your vehicle MH04EF9012 documents were rejected. Please review comments and resubmit.",
    type: "error",
    time: "2 hr ago",
    read: false,
    targetRole: "fleet-operator",
  },
  {
    id: "N005",
    title: "New FO Registration",
    message: "Metro Freight Solutions has completed registration. Awaiting activation.",
    type: "info",
    time: "3 hr ago",
    read: false,
    targetRole: "mic",
  },
  {
    id: "N006",
    title: "Card Dispatched",
    message: "Your card MGL****7832 has been dispatched. Tracking: BLUEDART987654",
    type: "success",
    time: "1 day ago",
    read: true,
    targetRole: "fleet-operator",
  },
  {
    id: "N007",
    title: "MoU Expiry Alert",
    message: "MoU MGL/MOU/2025/001 for ABC Logistics expires in 30 days",
    type: "warning",
    time: "1 day ago",
    read: true,
    targetRole: "mic",
  },
];

// ─── Status helpers ─────────────────────────────────────────────────────────
export const vehicleStatusConfig: Record<VehicleStatus, { label: string; color: string; bg: string }> = {
  DRAFT: { label: "Draft", color: "text-gray-600", bg: "bg-gray-100" },
  L1_SUBMITTED: { label: "L1 Submitted", color: "text-blue-700", bg: "bg-blue-100" },
  L1_APPROVED: { label: "L1 Approved", color: "text-green-700", bg: "bg-green-100" },
  L1_REJECTED: { label: "L1 Rejected", color: "text-red-700", bg: "bg-red-100" },
  L2_SUBMITTED: { label: "L2 Submitted", color: "text-amber-700", bg: "bg-amber-100" },
  L2_APPROVED: { label: "L2 Approved", color: "text-green-700", bg: "bg-green-100" },
  L2_REJECTED: { label: "L2 Rejected", color: "text-red-700", bg: "bg-red-100" },
  CARD_PRINTED: { label: "Card Printed", color: "text-purple-700", bg: "bg-purple-100" },
  CARD_DISPATCHED: { label: "Card Dispatched", color: "text-indigo-700", bg: "bg-indigo-100" },
  CARD_ACTIVE: { label: "Card Active", color: "text-emerald-700", bg: "bg-emerald-100" },
};

export const foStatusConfig: Record<FOStatus, { label: string; color: string; bg: string }> = {
  PENDING_ACTIVATION: { label: "Pending Activation", color: "text-amber-700", bg: "bg-amber-100" },
  ACTIVE: { label: "Active", color: "text-green-700", bg: "bg-green-100" },
  SUSPENDED: { label: "Suspended", color: "text-red-700", bg: "bg-red-100" },
};

// ─── Chart data ─────────────────────────────────────────────────────────────
export const monthlyOnboardingData = [
  { month: "Sep", operators: 4, vehicles: 12 },
  { month: "Oct", operators: 6, vehicles: 18 },
  { month: "Nov", operators: 5, vehicles: 22 },
  { month: "Dec", operators: 8, vehicles: 31 },
  { month: "Jan", operators: 10, vehicles: 38 },
  { month: "Feb", operators: 7, vehicles: 29 },
];

export const cardStatusData = [
  { name: "Active", value: 45, fill: "#2EAD4B" },
  { name: "Dispatched", value: 12, fill: "#1565C0" },
  { name: "Printed", value: 8, fill: "#F5A800" },
  { name: "Pending", value: 18, fill: "#90EE90" },
];

export const approvalTrendData = [
  { month: "Sep", approved: 18, rejected: 3 },
  { month: "Oct", approved: 24, rejected: 5 },
  { month: "Nov", approved: 31, rejected: 4 },
  { month: "Dec", approved: 28, rejected: 6 },
  { month: "Jan", approved: 35, rejected: 3 },
  { month: "Feb", approved: 22, rejected: 2 },
];
