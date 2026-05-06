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

// Slab-based incentive types for MOUs
export interface IncentiveSlab {
  slabNumber: number
  fromVehicle: number
  toVehicle: number
  rates: {
    new_purchase: { HCV: number; ICV: number; LCV: number; Bus: number }
    retrofit: { HCV: number; ICV: number; LCV: number; Bus: number }
  }
}

export interface MOUIncentiveConfig {
  mouId: string
  slabs: IncentiveSlab[]
}

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

// Mock MOU incentive configs
export const mockMOUIncentiveConfigs: MOUIncentiveConfig[] = [
  {
    mouId: "MGL/MOU/2025/001",
    slabs: [
      {
        slabNumber: 1,
        fromVehicle: 1,
        toVehicle: 5,
        rates: {
          new_purchase: { HCV: 15000, ICV: 12000, LCV: 8000, Bus: 10000 },
          retrofit:     { HCV: 10000, ICV: 8000,  LCV: 5000, Bus: 7000  },
        },
      },
      {
        slabNumber: 2,
        fromVehicle: 6,
        toVehicle: 10,
        rates: {
          new_purchase: { HCV: 18000, ICV: 14000, LCV: 10000, Bus: 12000 },
          retrofit:     { HCV: 12000, ICV: 10000, LCV: 7000,  Bus: 9000  },
        },
      },
      {
        slabNumber: 3,
        fromVehicle: 11,
        toVehicle: 15,
        rates: {
          new_purchase: { HCV: 20000, ICV: 16000, LCV: 12000, Bus: 14000 },
          retrofit:     { HCV: 14000, ICV: 12000, LCV: 9000,  Bus: 11000 },
        },
      },
    ],
  },
];

// Helper functions for incentive calculations
export function getIncentiveAmount(
  mouId: string,
  vehicleSequence: number,
  vehicleType: "new_purchase" | "retrofit",
  category: "HCV" | "ICV" | "LCV" | "Bus"
): number | null {
  const config = mockMOUIncentiveConfigs.find(c => c.mouId === mouId);
  if (!config) return null;
  const slab = config.slabs.find(s => vehicleSequence >= s.fromVehicle && vehicleSequence <= s.toVehicle);
  if (!slab) return null;
  return slab.rates[vehicleType][category] ?? null;
}

export function getSlabNumber(
  mouId: string,
  vehicleSequence: number
): number | null {
  const config = mockMOUIncentiveConfigs.find(c => c.mouId === mouId);
  if (!config) return null;
  const slab = config.slabs.find(s => vehicleSequence >= s.fromVehicle && vehicleSequence <= s.toVehicle);
  return slab?.slabNumber ?? null;
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
    .filter(v => v.mouId === mouId && v.onboardingType === "MIC_ASSISTED")
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


// ─── Driver Pairing Policy - Three-Level Inheritance Model ───────────────────
export type PolicyLevel = "platform" | "fleet" | "vehicle_type" | "pairing"

export interface PairingPolicyConfig {
  level: PolicyLevel
  scopeId?: string              // null=platform, fo_id=fleet, vehicle_type=HCV/ICV etc, pairing_id
  expiryHours?: number | null   // null = inherit from level above
  maxUses?: number | null       // null = inherit
  maxUsesPerCode?: number | null
  codeType?: "single_use" | "multi_use" | null
  repairingTrigger?: "never" | "monthly" | "on_vehicle_change" | null
  deliveryMethod?: "sms" | "whatsapp" | "email" | null
}

// Resolved effective policy — all fields populated after walking the chain
export interface EffectivePairingPolicy {
  expiryHours: number | null    // null = no expiry
  maxUses: number | null        // null = unlimited
  codeType: "single_use" | "multi_use"
  repairingTrigger: "never" | "monthly" | "on_vehicle_change"
  deliveryMethod: "sms" | "whatsapp" | "email"
  resolvedFrom: {
    expiryHours: PolicyLevel
    maxUses: PolicyLevel
    codeType: PolicyLevel
    repairingTrigger: PolicyLevel
    deliveryMethod: PolicyLevel
  }
}

// Keep DriverPairingPolicy as alias for backward compat
export type DriverPairingPolicy = PairingPolicyConfig

export interface Driver {
  id: string
  foId: string
  foName?: string
  name: string
  contactNumber?: string
  phone?: string
  email?: string
  licenseNumber?: string
  licenseExpiry?: string
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "active" | "inactive" | "suspended"
  assignedVehicleId?: string
  assignedVehicleIds: string[]
  pairingCode?: string
  pairingCodeExpiry?: string | null
  pairingCodeUsed?: number
  pairingPolicy: PairingPolicyConfig
  createdAt: string
  lastPairedAt?: string
  notes?: string
  inviteCode?: string
  inviteCodeExpiry?: string
  inviteCodeUsed?: boolean
}

// Platform-level default policy
export const PLATFORM_DEFAULT_POLICY: PairingPolicyConfig = {
  level: "platform",
  expiryHours: 168,        // 7 days max at platform level
  maxUses: null,           // unlimited
  codeType: "multi_use",
  repairingTrigger: "monthly",
  deliveryMethod: "sms",
}

// Fleet-level policies per FO
export const mockFleetPolicies: PairingPolicyConfig[] = [
  {
    level: "fleet",
    scopeId: "FO001",
    expiryHours: 24,         // override: tighter than platform
    maxUses: null,           // inherit: unlimited
    codeType: "multi_use",   // inherit
    repairingTrigger: "monthly", // inherit
    deliveryMethod: "whatsapp",  // override: prefer WhatsApp
  },
]

// Vehicle-type-level policies
export const mockVehicleTypePolicies: PairingPolicyConfig[] = [
  {
    level: "vehicle_type",
    scopeId: "HCV",
    expiryHours: 72,         // HCV drivers assigned less frequently — 72h override
    maxUses: null,
    codeType: null,          // inherit
    repairingTrigger: null,  // inherit
    deliveryMethod: null,    // inherit
  },
]

// Policy resolution helper function
export function resolveEffectivePolicy(
  foId: string,
  vehicleType?: string,
  pairingOverride?: Partial<PairingPolicyConfig>
): EffectivePairingPolicy {
  const platform = PLATFORM_DEFAULT_POLICY
  const fleet = mockFleetPolicies.find(p => p.scopeId === foId)
  const vType = vehicleType ? mockVehicleTypePolicies.find(p => p.scopeId === vehicleType) : undefined

  // Walk chain: pairing > vehicle_type > fleet > platform
  // Take first non-null value, most restrictive wins for numeric fields
  const resolve = <T>(field: keyof PairingPolicyConfig, fallback: T): { value: T; level: PolicyLevel } => {
    if (pairingOverride?.[field] !== undefined && pairingOverride?.[field] !== null)
      return { value: pairingOverride[field] as T, level: "pairing" }
    if (vType?.[field] !== undefined && vType?.[field] !== null)
      return { value: vType[field] as T, level: "vehicle_type" }
    if (fleet?.[field] !== undefined && fleet?.[field] !== null)
      return { value: fleet[field] as T, level: "fleet" }
    return { value: (platform[field] ?? fallback) as T, level: "platform" }
  }

  const expiry = resolve<number | null>("expiryHours", 168)
  const maxUses = resolve<number | null>("maxUses", null)
  const codeType = resolve<"single_use" | "multi_use">("codeType", "multi_use")
  const trigger = resolve<"never" | "monthly" | "on_vehicle_change">("repairingTrigger", "monthly")
  const delivery = resolve<"sms" | "whatsapp" | "email">("deliveryMethod", "sms")

  return {
    expiryHours: expiry.value,
    maxUses: maxUses.value,
    codeType: codeType.value,
    repairingTrigger: trigger.value,
    deliveryMethod: delivery.value,
    resolvedFrom: {
      expiryHours: expiry.level,
      maxUses: maxUses.level,
      codeType: codeType.level,
      repairingTrigger: trigger.level,
      deliveryMethod: delivery.level,
    }
  }
}


// ─── Driver Vehicle Binding - First-Class Entity ────────────────────────────
export type BindingState = "pending_binding" | "active" | "suspended" | "revoked"
export type PairingCodeState = "pending" | "used" | "expired"
export type AuthMode = "pairing_code" | "pin" | "biometric"

export interface DriverVehicleBinding {
  bindingId: string
  driverId: string
  vehicleId: string
  foId: string
  authMode: AuthMode
  state: BindingState
  pairingCode?: string
  pairingCodeState?: PairingCodeState
  effectivePolicy?: EffectivePairingPolicy
  policyVersionRef?: string
  policyStampedAt?: string
  policyHistory?: Array<{
    policy: EffectivePairingPolicy
    stampedAt: string
    reason: "initial" | "reissued" | "fleet_policy_changed"
  }>
  spendLimitPerFueling?: number | null
  spendLimitPerDay?: number | null
  shiftStart?: string
  shiftEnd?: string
  tripId?: string
  createdAt: string
  activatedAt?: string
  revokedAt?: string
  notes?: string
}

export const mockDrivers: Driver[] = [
  {
    id: "DRV001",
    foId: "FO001",
    name: "Ramesh Kumar",
    licenseNumber: "MH04DL20250001",
    licenseExpiry: "2028-05-15",
    phone: "9876501234",
    email: "ramesh@abc.com",
    status: "ACTIVE",
    assignedVehicleId: "VEH001",
    assignedVehicleIds: ["VEH001"],
    pairingCode: "RK7842",
    pairingCodeExpiry: "2026-04-20",
    pairingCodeUsed: 5,
    lastPairedAt: "12 Apr 2026, 9:45 AM",
    createdAt: "2025-02-01",
    pairingPolicy: { codeType: "single_use", expiryHours: 24, maxUsesPerCode: 1, repairingTrigger: "monthly" },
    inviteCodeUsed: true,
  },
  {
    id: "DRV002",
    foId: "FO001",
    name: "Suneel Patel",
    licenseNumber: "MH04DL20250002",
    licenseExpiry: "2028-08-22",
    phone: "9876502345",
    email: "suneel@abc.com",
    status: "ACTIVE",
    assignedVehicleId: "VEH007",
    assignedVehicleIds: ["VEH007"],
    pairingCode: "SP4521",
    pairingCodeExpiry: "2026-04-15",
    pairingCodeUsed: 0,
    createdAt: "2025-03-07",
    pairingPolicy: { codeType: "single_use", expiryHours: 24, maxUsesPerCode: 1, repairingTrigger: "monthly" },
    inviteCodeUsed: true,
  },
  {
    id: "DRV003",
    foId: "FO001",
    name: "Micheal Thomas",
    licenseNumber: "MH04DL20250003",
    licenseExpiry: "2027-11-10",
    phone: "9876503456",
    status: "ACTIVE",
    assignedVehicleIds: [],
    createdAt: "2025-03-19",
    pairingCode: "MT9163",
    pairingCodeExpiry: "2026-04-18",
    pairingPolicy: { codeType: "single_use", expiryHours: 24, maxUsesPerCode: 1, repairingTrigger: "monthly" },
    inviteCodeUsed: false,
    inviteCode: "MT9163",
    inviteCodeExpiry: "2026-04-30",
  },
  {
    id: "DRV005",
    foId: "FO001",
    name: "Amalendu Mishra",
    licenseNumber: "MH04DL20250005",
    licenseExpiry: "2029-02-28",
    phone: "9876505678",
    email: "amalendu@abc.com",
    status: "ACTIVE",
    assignedVehicleIds: ["VEH002", "VEH008"],
    pairingCode: "AM3377",
    pairingCodeExpiry: "2026-04-22",
    pairingCodeUsed: 8,
    lastPairedAt: "20 Mar 2026, 3:20 PM",
    createdAt: "2025-02-10",
    pairingPolicy: { codeType: "multi_use", expiryHours: 72, maxUsesPerCode: null, repairingTrigger: "on_vehicle_change" },
    inviteCodeUsed: true,
  },
]

export const mockDriverVehicleBindings: DriverVehicleBinding[] = [
  {
    bindingId: "BND001",
    driverId: "DRV001",
    vehicleId: "VEH001",
    foId: "FO001",
    authMode: "pairing_code",
    state: "active",
    pairingCode: "RK7842",
    pairingCodeState: "used",
    effectivePolicy: resolveEffectivePolicy("FO001", "HCV"),
    policyVersionRef: "FPOL-FO001-v1",
    policyStampedAt: "2025-01-20",
    policyHistory: [
      {
        policy: resolveEffectivePolicy("FO001", "HCV"),
        stampedAt: "2025-01-20",
        reason: "initial",
      }
    ],
    spendLimitPerFueling: 2000,
    spendLimitPerDay: 5000,
    shiftStart: "06:00",
    shiftEnd: "22:00",
    createdAt: "2025-01-20",
    activatedAt: "2026-04-10",
  },
  {
    bindingId: "BND002",
    driverId: "DRV002",
    vehicleId: "VEH007",
    foId: "FO001",
    authMode: "pairing_code",
    state: "active",
    pairingCode: "SP4521",
    pairingCodeState: "pending",
    effectivePolicy: resolveEffectivePolicy("FO001", "HCV"),
    policyVersionRef: "FPOL-FO001-v1",
    policyStampedAt: "2025-03-07",
    policyHistory: [
      {
        policy: resolveEffectivePolicy("FO001", "HCV"),
        stampedAt: "2025-03-07",
        reason: "initial",
      }
    ],
    spendLimitPerFueling: null,
    spendLimitPerDay: null,
    createdAt: "2025-03-07",
  },
  {
    bindingId: "BND003",
    driverId: "DRV003",
    vehicleId: "VEH009",
    foId: "FO001",
    authMode: "pairing_code",
    state: "pending_binding",
    pairingCode: "MT9163",
    pairingCodeState: "pending",
    effectivePolicy: resolveEffectivePolicy("FO001", "ICV"),
    policyVersionRef: "FPOL-FO001-v1",
    policyStampedAt: "2025-03-19",
    policyHistory: [
      {
        policy: resolveEffectivePolicy("FO001", "ICV"),
        stampedAt: "2025-03-19",
        reason: "initial",
      }
    ],
    createdAt: "2025-03-19",
  },
  {
    bindingId: "BND004",
    driverId: "DRV005",
    vehicleId: "VEH002",
    foId: "FO001",
    authMode: "pairing_code",
    state: "active",
    pairingCode: "AM3377",
    pairingCodeState: "used",
    effectivePolicy: resolveEffectivePolicy("FO001", "HCV"),
    policyVersionRef: "FPOL-FO001-v1",
    policyStampedAt: "2025-02-10",
    policyHistory: [
      {
        policy: resolveEffectivePolicy("FO001", "HCV"),
        stampedAt: "2025-02-10",
        reason: "initial",
      }
    ],
    spendLimitPerFueling: 3000,
    spendLimitPerDay: 8000,
    shiftStart: "05:00",
    shiftEnd: "23:00",
    createdAt: "2025-02-10",
    activatedAt: "2026-03-15",
    notes: "Pool driver — primary vehicle",
  },
  {
    bindingId: "BND005",
    driverId: "DRV005",
    vehicleId: "VEH008",
    foId: "FO001",
    authMode: "pairing_code",
    state: "active",
    pairingCode: "AM3377",
    pairingCodeState: "used",
    effectivePolicy: resolveEffectivePolicy("FO001", "HCV"),
    policyVersionRef: "FPOL-FO001-v1",
    policyStampedAt: "2025-02-10",
    policyHistory: [
      {
        policy: resolveEffectivePolicy("FO001", "HCV"),
        stampedAt: "2025-02-10",
        reason: "initial",
      }
    ],
    spendLimitPerFueling: 3000,
    spendLimitPerDay: 8000,
    createdAt: "2025-02-10",
    activatedAt: "2026-03-20",
    notes: "Pool driver — secondary vehicle",
  },
]

export function reissueBinding(
  binding: DriverVehicleBinding,
  vehicleType: string,
  pairingOverride?: Partial<PairingPolicyConfig>
): DriverVehicleBinding {
  const newPolicy = resolveEffectivePolicy(binding.foId, vehicleType, pairingOverride)
  const newCode = Math.random().toString(36).substring(2, 8).toUpperCase()

  return {
    ...binding,
    pairingCode: newCode,
    pairingCodeState: "pending",
    effectivePolicy: newPolicy,
    policyVersionRef: `FPOL-${binding.foId}-v${Date.now()}`,
    policyStampedAt: new Date().toISOString().split("T")[0],
    policyHistory: [
      ...(binding.policyHistory ?? []),
      {
        policy: binding.effectivePolicy!,
        stampedAt: binding.policyStampedAt ?? binding.createdAt,
        reason: "reissued",
      }
    ],
    activatedAt: undefined,
    state: "pending_binding",
  }
}


export interface FleetOperator {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  pan: string;
  gstn: string;
  gstnTradeName?: string;
  entityType?: string;
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
  rtoEndorsementUrl?: string;
  typeApprovalUrl?: string;
  taxInvoiceUrl?: string;
  rtoReceiptUrl?: string;
  vehicleType?: "new_purchase" | "retrofit";
  mouId?: string;                          // linked MOU number e.g. "MGL/MOU/2025/001"
  categorySequence?: number;               // order added within same MOU + category (1, 2, 3...)
  slabNumber?: number;                     // which incentive slab this vehicle falls in
  incentiveStatus?: IncentiveStatus;       // eligibility and approval state
  incentiveAmount?: number;                // computed incentive amount in INR
  incentiveType?: "standard" | "milestone_slab"; // type of incentive mechanism
  incentiveApprovedBy?: string;            // ZIC or admin user ID
  incentiveApprovedAt?: string;            // approval timestamp
  incentiveNote?: string;
  vahaaanData?: { status: string; blacklist_status: string; registered_at: string; issue_date: string; expiry_date: string; owner_data: { name: string; mobile: string }; vehicle_data: { maker_description: string; maker_model: string; category: string; fuel_type: string; body_type: string; chassis_number: string; engine_number: string; color: string; gross_weight: string; manufactured_date: string }; insurance_data: { company: string; policy_number: string; expiry_date: string }; pucc_data: { pucc_number: string; expiry_date: string } };                  // reason or note from approver
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
    gstnTradeName: "Rajesh Gupta Transport Services",
    entityType: "Proprietorship",
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
    gstnTradeName: "Sharma Transport Pvt. Ltd.",
    entityType: "Private Limited",
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
    gstnTradeName: "Mumbai Fleet Services",
    entityType: "Partnership",
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
    gstnTradeName: "",
    entityType: "Proprietorship",
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
    vehicleType: "new_purchase",
    mouId: "MGL/MOU/2025/001",
    categorySequence: 1,
    slabNumber: 1,
    incentiveStatus: "paid",
    incentiveType: "standard",
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
    slabNumber: 1,
    incentiveStatus: "approved",
    incentiveType: "standard",
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
    slabNumber: 1,
    incentiveStatus: "not_eligible",
    incentiveType: "standard",
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
    slabNumber: 1,
    incentiveStatus: "eligible",
    incentiveAmount: 12000,
    incentiveType: "standard",
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
    slabNumber: 1,
    incentiveStatus: "eligible",
    incentiveAmount: 15000,
    incentiveType: "standard",
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
    slabNumber: 1,
    incentiveStatus: "not_eligible",
    incentiveType: "standard",
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
    vahaaanData: { status: "ACTIVE", blacklist_status: "false", registered_at: "RTO Mumbai Central, Maharashtra", issue_date: "2022-03-15", expiry_date: "2037-03-14", owner_data: { name: "Priya Transport Services", mobile: "9876543210" }, vehicle_data: { maker_description: "TATA MOTORS LTD", maker_model: "LPT 1918", category: "HCV", fuel_type: "CNG", body_type: "GOODS CARRIER", chassis_number: "MAT445203NEB12345", engine_number: "275IDTCR4CNL12345", color: "WHITE", gross_weight: "19000", manufactured_date: "2022-02" }, insurance_data: { company: "National Insurance Co. Ltd", policy_number: "420100/31/2024/12345", expiry_date: "2025-03-14" }, pucc_data: { pucc_number: "PUCC123456", expiry_date: "2025-09-15" } },
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
    status: "SUBMITTED",
    l1SubmittedAt: "2025-03-23",
    onboardingType: "SELF_SERVICE",
    rcBookUrl: "rc_veh011.pdf",
    vehicleType: "new_purchase",
    vahaaanData: { status: "ACTIVE", blacklist_status: "false", registered_at: "RTO Andheri, Maharashtra", issue_date: "2024-08-10", expiry_date: "2039-08-09", owner_data: { name: "Priya Transport Services", mobile: "9876543210" }, vehicle_data: { maker_description: "MAHINDRA AND MAHINDRA", maker_model: "BOLERO PIK-UP", category: "LCV", fuel_type: "CNG", body_type: "GOODS CARRIER", chassis_number: "MA1PU2HRPNM12345", engine_number: "DIECRPNM12345", color: "WHITE", gross_weight: "2500", manufactured_date: "2024-07" }, insurance_data: { company: "HDFC ERGO Insurance", policy_number: "2311/12345/00/000", expiry_date: "2026-08-09" }, pucc_data: { pucc_number: "PUCC654321", expiry_date: "2026-02-10" } },
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
    status: "APPROVED",
    l1SubmittedAt: "2025-03-26",
    l1RejectedAt: "2025-03-28",
    l1Comments: "RC Book is not clearly legible. Please upload a higher quality scan.",
    onboardingType: "SELF_SERVICE",
    vehicleType: "new_purchase",
    vahaaanData: { status: "ACTIVE", blacklist_status: "false", registered_at: "RTO Goregaon, Maharashtra", issue_date: "2023-11-20", expiry_date: "2038-11-19", owner_data: { name: "Priya Transport Services", mobile: "9876543210" }, vehicle_data: { maker_description: "EICHER MOTORS LTD", maker_model: "PRO 2095", category: "ICV", fuel_type: "CNG", body_type: "GOODS CARRIER", chassis_number: "MBIEB4BPNM12345", engine_number: "E494CPNM12345", color: "WHITE", gross_weight: "9500", manufactured_date: "2023-10" }, insurance_data: { company: "New India Assurance Co. Ltd", policy_number: "31010031230100000", expiry_date: "2025-11-19" }, pucc_data: { pucc_number: "PUCC789012", expiry_date: "2025-05-20" } },
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
    vahaaanData: { status: "ACTIVE", blacklist_status: "false", registered_at: "RTO Goregaon, Maharashtra", issue_date: "2023-11-20", expiry_date: "2038-11-19", owner_data: { name: "Priya Transport Services", mobile: "9876543210" }, vehicle_data: { maker_description: "EICHER MOTORS LTD", maker_model: "PRO 2095", category: "ICV", fuel_type: "CNG", body_type: "GOODS CARRIER", chassis_number: "MBIEB4BPNM12345", engine_number: "E494CPNM12345", color: "WHITE", gross_weight: "9500", manufactured_date: "2023-10" }, insurance_data: { company: "New India Assurance Co. Ltd", policy_number: "31010031230100000", expiry_date: "2025-11-19" }, pucc_data: { pucc_number: "PUCC789012", expiry_date: "2025-05-20" } },
  },
  {
    id: "VEH020",
    foId: "FO001",
    foName: "ABC Logistics Pvt. Ltd.",
    vehicleNumber: "MH04HCV0006",
    model: "Tata LPT 2518",
    category: "HCV" as const,
    oem: "Tata Motors",
    dealership: "Tata Motors Andheri",
    bookingDate: "2025-04-01",
    registrationDate: "2025-04-10",
    status: "CARD_ACTIVE" as VehicleStatus,
    l1SubmittedAt: "2025-04-02",
    l1ApprovedAt: "2025-04-04",
    l2SubmittedAt: "2025-04-11",
    l2ApprovedAt: "2025-04-13",
    cardNumber: "MGL****7001",
    cardActivatedAt: "2025-04-15",
    onboardingType: "MIC_ASSISTED" as OnboardingType,
    vehicleType: "new_purchase" as const,
    mouId: "MGL/MOU/2025/001",
    categorySequence: 6,
    slabNumber: 2,
    incentiveStatus: "eligible" as IncentiveStatus,
    incentiveAmount: 18000,
    incentiveType: "milestone_slab",
    bookingReceiptUrl: "booking_veh020.pdf",
    rcBookUrl: "rc_veh020.pdf",
  },
  {
    id: "VEH021",
    foId: "FO001",
    foName: "ABC Logistics Pvt. Ltd.",
    vehicleNumber: "MH04HCV0007",
    model: "Ashok Leyland 1616",
    category: "HCV" as const,
    oem: "Ashok Leyland",
    dealership: "AL Dealers Kurla",
    bookingDate: "2025-04-05",
    registrationDate: "2025-04-15",
    status: "CARD_ACTIVE" as VehicleStatus,
    l1SubmittedAt: "2025-04-06",
    l1ApprovedAt: "2025-04-08",
    l2SubmittedAt: "2025-04-16",
    l2ApprovedAt: "2025-04-18",
    cardNumber: "MGL****7002",
    cardActivatedAt: "2025-04-20",
    onboardingType: "MIC_ASSISTED" as OnboardingType,
    vehicleType: "new_purchase" as const,
    mouId: "MGL/MOU/2025/001",
    categorySequence: 7,
    slabNumber: 2,
    incentiveStatus: "eligible" as IncentiveStatus,
    incentiveAmount: 18000,
    incentiveType: "milestone_slab",
    bookingReceiptUrl: "booking_veh021.pdf",
    rcBookUrl: "rc_veh021.pdf",
    vahaaanData: { status: "ACTIVE", blacklist_status: "false", registered_at: "RTO Goregaon, Maharashtra", issue_date: "2023-11-20", expiry_date: "2038-11-19", owner_data: { name: "Priya Transport Services", mobile: "9876543210" }, vehicle_data: { maker_description: "EICHER MOTORS LTD", maker_model: "PRO 2095", category: "ICV", fuel_type: "CNG", body_type: "GOODS CARRIER", chassis_number: "MBIEB4BPNM12345", engine_number: "E494CPNM12345", color: "WHITE", gross_weight: "9500", manufactured_date: "2023-10" }, insurance_data: { company: "New India Assurance Co. Ltd", policy_number: "31010031230100000", expiry_date: "2025-11-19" }, pucc_data: { pucc_number: "PUCC789012", expiry_date: "2025-05-20" } },
  },
  {
    id: "VEH022",
    foId: "FO001",
    foName: "ABC Logistics Pvt. Ltd.",
    vehicleNumber: "MH04LCV0001",
    model: "Tata 407",
    category: "LCV" as const,
    oem: "Tata Motors",
    dealership: "Tata Motors Andheri",
    bookingDate: "2025-04-10",
    registrationDate: "2025-04-18",
    status: "CARD_ACTIVE" as VehicleStatus,
    l1SubmittedAt: "2025-04-11",
    l1ApprovedAt: "2025-04-13",
    l2SubmittedAt: "2025-04-19",
    l2ApprovedAt: "2025-04-21",
    cardNumber: "MGL****8001",
    cardActivatedAt: "2025-04-22",
    onboardingType: "MIC_ASSISTED" as OnboardingType,
    vehicleType: "new_purchase" as const,
    mouId: "MGL/MOU/2025/001",
    categorySequence: 1,
    slabNumber: 1,
    incentiveStatus: "not_eligible" as IncentiveStatus,
    bookingReceiptUrl: "booking_veh022.pdf",
    rcBookUrl: "rc_veh022.pdf",
  },
  {
    id: "VEH023",
    foId: "FO001",
    foName: "ABC Logistics Pvt. Ltd.",
    vehicleNumber: "MH04BUS0001",
    model: "Force Traveller",
    category: "Bus" as const,
    oem: "Force Motors",
    dealership: "Force Motors Thane",
    bookingDate: "2025-04-12",
    registrationDate: "2025-04-20",
    status: "CARD_ACTIVE" as VehicleStatus,
    l1SubmittedAt: "2025-04-13",
    l1ApprovedAt: "2025-04-15",
    l2SubmittedAt: "2025-04-21",
    l2ApprovedAt: "2025-04-23",
    cardNumber: "MGL****8002",
    cardActivatedAt: "2025-04-24",
    onboardingType: "MIC_ASSISTED" as OnboardingType,
    vehicleType: "new_purchase" as const,
    mouId: "MGL/MOU/2025/001",
    categorySequence: 1,
    slabNumber: 1,
    incentiveStatus: "not_eligible" as IncentiveStatus,
    bookingReceiptUrl: "booking_veh023.pdf",
    rcBookUrl: "rc_veh023.pdf",
    vahaaanData: { status: "ACTIVE", blacklist_status: "false", registered_at: "RTO Goregaon, Maharashtra", issue_date: "2023-11-20", expiry_date: "2038-11-19", owner_data: { name: "Priya Transport Services", mobile: "9876543210" }, vehicle_data: { maker_description: "EICHER MOTORS LTD", maker_model: "PRO 2095", category: "ICV", fuel_type: "CNG", body_type: "GOODS CARRIER", chassis_number: "MBIEB4BPNM12345", engine_number: "E494CPNM12345", color: "WHITE", gross_weight: "9500", manufactured_date: "2023-10" }, insurance_data: { company: "New India Assurance Co. Ltd", policy_number: "31010031230100000", expiry_date: "2025-11-19" }, pucc_data: { pucc_number: "PUCC789012", expiry_date: "2025-05-20" } },
  },
  {
    id: "VEH024",
    foId: "FO001",
    foName: "ABC Logistics Pvt. Ltd.",
    vehicleNumber: "MH04HCV0008",
    model: "Eicher Pro 3018",
    category: "HCV" as const,
    oem: "Eicher",
    dealership: "Eicher Goregaon",
    bookingDate: "2025-04-15",
    status: "L1_SUBMITTED" as VehicleStatus,
    l1SubmittedAt: "2025-04-16",
    onboardingType: "MIC_ASSISTED" as OnboardingType,
    vehicleType: "new_purchase" as const,
    mouId: "MGL/MOU/2025/001",
    categorySequence: 8,
    slabNumber: 2,
    incentiveStatus: "not_eligible" as IncentiveStatus,
    incentiveType: "milestone_slab",
    bookingReceiptUrl: "booking_veh024.pdf",
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
  SUBMITTED: { label: "Under MIC Review", color: "text-amber-700", bg: "bg-amber-100" },
  APPROVED: { label: "Approved", color: "text-blue-700", bg: "bg-blue-100" },
  CARD_ISSUED: { label: "Card Being Issued", color: "text-purple-700", bg: "bg-purple-100" },
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
  INACTIVE: { label: "Inactive", color: "text-gray-600", bg: "bg-gray-100" },
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
]

export interface ROStation {
  id: number
  name: string
  ownership: string
  address: string
  latitude: number | null
  longitude: number | null
  mapsLink: string
}

export const mockROStations: ROStation[] = [
  { id: 1, name: "City Gate Station, Sion", ownership: "MGL", address: "Sewri - Chembur Rd, Opp Anik Bus Depot, Trombay Industrial Area, Sion", latitude: 19.04731651, longitude: 72.87875819, mapsLink: "https://www.google.com/maps?q=19.04731651,72.8787582" },
  { id: 2, name: "Rameshwar Engg.", ownership: "MGL", address: "Plot No. F-20, MIDC Phase-2, KalyanShil Road, MIDC, Dombivali (E), Dist Thane", latitude: 19.19328464, longitude: 73.09599218, mapsLink: "https://www.google.com/maps?q=19.19328464,73.09599218" },
  { id: 3, name: "Bharat Coaltar, Goregaon (E)", ownership: "MGL", address: "1-A, Cama Municipal Industrial Estate, Off. Western Exp. Highway, Goregaon (E), Mumbai", latitude: 19.15984494, longitude: 72.85712143, mapsLink: "https://www.google.com/maps?q=19.15984494,72.85712143" },
  { id: 4, name: "Samrudh Auto, Kurla (W)", ownership: "MGL", address: "No 9, Next to NEXA Showroom, Lal Bahadur Shastri Marg, Kurla West", latitude: 19.08494312, longitude: 72.89067812, mapsLink: "https://www.google.com/maps?q=19.08494312,72.89067812" },
  { id: 5, name: "Ketki Enterprise, Dahisar (E)", ownership: "MGL", address: "C.T.S No. 296/A, Near Shree Krishna Industrial Estate, Ketkipada Road, Dahisar", latitude: 19.25674725, longitude: 72.87168827, mapsLink: "https://www.google.com/maps?q=19.25674725,72.87168827" },
  { id: 6, name: "Green Gas Allied Services", ownership: "MGL", address: "Plot no.30, Industrial Area, Ulhasnagar - 421004", latitude: 19.21879519, longitude: 73.15502686, mapsLink: "https://www.google.com/maps?q=19.21879519,73.15502686" },
  { id: 7, name: "MGL-Dindoshi Depot", ownership: "MGL", address: "MGL-Dindoshi, Mulund Link Road, Goregaon (E) Mumbai 400065", latitude: 19.1762964, longitude: 72.86537174, mapsLink: "https://www.google.com/maps?q=19.1762964,72.86537174" },
  { id: 8, name: "Sai Kripa Gas STN.", ownership: "MGL", address: "CTS NO-452, Village Marve Road, Malavni, Next to HPCL Petrol Pump, Malad (W) Mumbai", latitude: 19.19697529, longitude: 72.81474803, mapsLink: "https://www.google.com/maps?q=19.19697529,72.81474803" },
  { id: 9, name: "MGL-NMMT Turbhe Depot", ownership: "MGL", address: "Plot No. 1 Turbhe Depot Sector 20 Vashi", latitude: 19.07339754, longitude: 73.01729082, mapsLink: "https://www.google.com/maps?q=19.07339754,73.01729082" },
  { id: 10, name: "Panvel Ind. Fast. Pvt Ltd", ownership: "MGL", address: "Plot No. 33, Kamothe, Panvel", latitude: 19.02219515, longitude: 73.09904759, mapsLink: "https://www.google.com/maps?q=19.02219515,73.09904759" },
  { id: 11, name: "MGL-Taloja", ownership: "MGL", address: "J-93/2 Taloja MIDC Area Navi Mumbai", latitude: 19.0736361, longitude: 73.14016612, mapsLink: "https://www.google.com/maps?q=19.0736361,73.14016612" },
  { id: 12, name: "Hind CNG Filling Station, Kalyan", ownership: "MGL", address: "Kalyan Bhiwandi Bypass Naka, Near TATA Showroom, Pimpalgaon, Kalyan, Thane", latitude: 19.26114527, longitude: 73.09122221, mapsLink: "https://www.google.com/maps?q=19.26114527,73.09122221" },
  { id: 13, name: "MGL-Ambernath", ownership: "MGL", address: "CNG Pump, Kalyan - Badlapur Rd, Dattanagar, Ambernath, Maharashtra 421505", latitude: 19.195224858479, longitude: 73.2117839650296, mapsLink: "https://www.google.com/maps?q=19.195224858479,73.2117839650296" },
  { id: 14, name: "Sanjay Kadam, Owala", ownership: "MGL", address: "1, Ghodbunder Road, Owale, Thane West", latitude: 19.27785003, longitude: 72.9578873, mapsLink: "https://www.google.com/maps?q=19.27785003,72.9578873" },
  { id: 15, name: "S.K CNG Station, Jogeshwari (W)", ownership: "MGL", address: "CNG Station, Opp. Cemetery, Relief Road, Oshiwara, Jogeshwari", latitude: 19.14907402, longitude: 72.83993244, mapsLink: "https://www.google.com/maps?q=19.14907402,72.83993244" },
  { id: 16, name: "Hind Auto CNG Filling Station, Bhiwandi", ownership: "MGL", address: "S. No. 144, Bhiwandi Wada Highway, Village Shelar, Taluka Bhiwandi, Dist Thane", latitude: 19.3172650952808, longitude: 73.066209074808, mapsLink: "https://www.google.com/maps?q=19.3172650952808,73.066209074808" },
  { id: 17, name: "Jay Hind Filling Station, Bhiwandi", ownership: "MGL", address: "S. No. 9/1, Village Purna, Old Agra Road, Taluka Bhiwandi, Dist. Thane", latitude: 19.26396854, longitude: 73.03237217, mapsLink: "https://www.google.com/maps?q=19.26396854,73.03237217" },
  { id: 18, name: "Jay Shree Ram Enterprises", ownership: "MGL", address: "Neral - Badlapur Rd, MIDC, Badlapur, Maharashtra 421503", latitude: 19.1825204612356, longitude: 73.21598294477469, mapsLink: "https://www.google.com/maps?q=19.1825204612356,73.2159829447747" },
  { id: 19, name: "Green Energy Station", ownership: "MGL", address: "Plot No. C-2, Village Morivali, Ambernath Badlapur Road, Taluka Ambernath, Dist Thane", latitude: 19.19072103, longitude: 73.19662939, mapsLink: "https://www.google.com/maps?q=19.19072103,73.19662939" },
  { id: 20, name: "Kwality Chemicals", ownership: "MGL", address: "Plot No. 174, MIDC Phase I, Khambalpada Road, Dombivali (E), Thane", latitude: 19.21888791, longitude: 73.10752592, mapsLink: "https://www.google.com/maps?q=19.21888791,73.10752593" },
  { id: 21, name: "Dhanlaxmi Enterprise", ownership: "MGL", address: "H no 22, Gaimukh Gaon, Ghodbunder Road, Thane W", latitude: 19.28460054, longitude: 72.94243317, mapsLink: "https://www.google.com/maps?q=19.28460054,72.94243317" },
  { id: 22, name: "SGR Group, Kalyan", ownership: "MGL", address: "Parking Plaza, Durga Mata Chowk, Kalyan West", latitude: 19.24889997, longitude: 73.11901802, mapsLink: "https://www.google.com/maps?q=19.24889997,73.11901802" },
  { id: 23, name: "Vicky & Tejas Automobiles, Lodhivali", ownership: "MGL", address: "Survey No.4, Village Lodhivali, Old Mumbai Pune Highway, Taluka Khalapur, Dist. Raigad", latitude: 18.90178512, longitude: 73.21349373, mapsLink: "https://www.google.com/maps?q=18.90178512,73.21349373" },
  { id: 24, name: "Sun Automobile, Thane", ownership: "MGL", address: "Plot No. A-120, Wagle Industrial Estate, MIDC, Thane", latitude: 19.193633, longitude: 72.94979821, mapsLink: "https://www.google.com/maps?q=19.193633,72.94979821" },
  { id: 25, name: "Amul Chemicals Industries, Rabale", ownership: "MGL", address: "Reliance Corporate Park, MIDC Industrial Area, Ghansoli", latitude: 19.13200872, longitude: 73.00372768, mapsLink: "https://www.google.com/maps?q=19.13200872,73.00372768" },
  { id: 26, name: "Ashirwad Enterprises, Kamba", ownership: "MGL", address: "S.16/1, Kamba Gaon, Kalyan Murbad Road, Kamba", latitude: 19.25049101, longitude: 73.19780992, mapsLink: "https://www.google.com/maps?q=19.25049101,73.19780992" },
  { id: 27, name: "KG Rathod CNG Station, Mira-Bhayander", ownership: "MGL", address: "CNG Station, Mira Bhayender Road, Near Reliance Petrol Pump, Bhayander (E) 400006", latitude: 19.28970985, longitude: 72.86464832, mapsLink: "https://www.google.com/maps?q=19.28970985,72.86464832" },
  { id: 28, name: "Chris Enterprises Mira Road", ownership: "MGL", address: "Opp Christine Heights, Navghar Village, Mari Gold Road, Mira Road (E), Thane 401107", latitude: 19.28870285, longitude: 72.87679522, mapsLink: "https://www.google.com/maps?q=19.28870285,72.87679522" },
  { id: 29, name: "GOM Mankhurd", ownership: "MGL", address: "Jeejabai Bhosale Marg, Mankhurd West, Govandi East, Mumbai", latitude: 19.0568116418549, longitude: 72.93063628706931, mapsLink: "https://www.google.com/maps?q=19.0568116418549,72.9306362870693" },
  { id: 30, name: "GOM Badlapur", ownership: "MGL", address: "Neral - Badlapur Rd, MIDC, Badlapur, Maharashtra 421503", latitude: 19.15506657, longitude: 73.23988555, mapsLink: "https://www.google.com/maps?q=19.15506657,73.23988555" },
  { id: 31, name: "GoM Malad", ownership: "MGL", address: "CTS no 1188, Village Malad, Opp Jain Sabkuch Food Plaza, Malad (W) 400064", latitude: 19.17521894, longitude: 72.83747302, mapsLink: "https://www.google.com/maps?q=19.17521894,72.83747302" },
  { id: 32, name: "Haji Liyakat CNG Station, Neral", ownership: "MGL", address: "Shop No 1 Karjat Kalyan Road, Near Pahunchar Hotel, Neral, Maharashtra 410101", latitude: 19.01611247, longitude: 73.32207081, mapsLink: "https://www.google.com/maps?q=19.01611247,73.32207082" },
  { id: 33, name: "MGL-MSRTC Vitthalwadi", ownership: "MGL", address: "Vitthalwadi Station, Ulhasnagar, Maharashtra 421306", latitude: 19.22743827, longitude: 73.14903169, mapsLink: "https://www.google.com/maps?q=19.22743827,73.14903169" },
  { id: 34, name: "GoM Ghatkopar", ownership: "MGL", address: "Off Eastern Express Highway, Kamraj Nagar, Ghatkopar W", latitude: 19.07099289, longitude: 72.90887915, mapsLink: "https://www.google.com/maps?q=19.07099289,72.90887915" },
  { id: 35, name: "Kanhaiya Traders", ownership: "MGL", address: "124/4, Near Ritu Hyundai, Gove Village, Bhiwandi, Maharashtra 421311", latitude: 19.25461371, longitude: 73.09618011, mapsLink: "https://www.google.com/maps?q=19.25461371,73.09618011" },
  { id: 36, name: "Laxmi Jyot CNG Station", ownership: "MGL", address: "Padmashree Mohammad Rafi Marg, Kailash Colony, Ulhasnagar, Maharashtra 421004", latitude: 19.21031068, longitude: 73.16122025, mapsLink: "https://www.google.com/maps?q=19.21031068,73.16122026" },
  { id: 37, name: "Pranaya Gas, Ulhasnagar", ownership: "MGL", address: "Behind Sai Baba Mandir, Dolphin Club Road, Shantinagar, Ulhasnagar-421003", latitude: 19.2353036, longitude: 73.15066879, mapsLink: "https://www.google.com/maps?q=19.2353036,73.15066879" },
  { id: 38, name: "CGS Savroli", ownership: "MGL", address: "MH SH 104, Niphan, Maharashtra 410203", latitude: 18.80165084, longitude: 73.28197774, mapsLink: "https://www.google.com/maps?q=18.80165084,73.28197774" },
  { id: 39, name: "Rameshwar CNG Centre", ownership: "MGL", address: "Survey No. 43A/2, Sawarsai, Pen, Raigad", latitude: 18.73021628, longitude: 73.14630194, mapsLink: "https://www.google.com/maps?q=18.73021628,73.14630194" },
  { id: 40, name: "MSRTC Roha Private CNG Station", ownership: "MGL", address: "Survey No. 203/1, MSRTC Roha Bus Depot, Roha, Raigad, Maharashtra 402109", latitude: 18.441516, longitude: 73.11032457, mapsLink: "https://www.google.com/maps?q=18.441516,73.11032457" },
  { id: 41, name: "Apoorva Hospitality, Taloja MIDC", ownership: "MGL", address: "PAP 168 Opposite Aditya Birla, Navda, Taloja, Panvel", latitude: 19.05600626, longitude: 73.10628798, mapsLink: "https://www.google.com/maps?q=19.05600626,73.10628798" },
  { id: 42, name: "MGL TEZ Ghatkopar Depot", ownership: "MGL TEZ", address: "Ghatkopar Bus Depot, Mankur, Ghatkopar", latitude: 19.07099289, longitude: 72.90887915, mapsLink: "https://www.google.com/maps?q=19.07099289,72.90887915" },
  { id: 43, name: "MGL Tez Goregaon Depot", ownership: "MGL TEZ", address: "Goregaon BEST Depot, Near Goregaon W Metro Station, Goregaon West", latitude: 19.15327664, longitude: 72.83874951, mapsLink: "https://www.google.com/maps?q=19.15327664,72.83874952" },
  { id: 44, name: "Jaya CNG, Mira Road", ownership: "MGL", address: "Bhaktivedanta Swami Marg, Opp Delta Garden, Mira Road East", latitude: 19.26942603, longitude: 72.8752058, mapsLink: "https://www.google.com/maps?q=19.26942603,72.8752058" },
  { id: 45, name: "P.P. Kharpatil CNG Station", ownership: "MGL", address: "Survey no. 28/2/1/A, Village Bhom, Taluka Uran, Dist. Raigad", latitude: 18.8844975, longitude: 73.04940357, mapsLink: "https://www.google.com/maps?q=18.8844975,73.04940357" },
  { id: 46, name: "Shree Omkar Gas Filling Station", ownership: "MGL", address: "Survey no. 188/1, Village Shirdhon, Taluka Panvel, Dist. Raigad-410221", latitude: 18.93035981, longitude: 73.12764912, mapsLink: "https://www.google.com/maps?q=18.93035981,73.12764912" },
  { id: 47, name: "Indrajeet Waghmare, Shahad", ownership: "Private", address: "Shahad Brg, Shahad, Ulhasnagar, Maharashtra 421103", latitude: null, longitude: null, mapsLink: "" },
  { id: 48, name: "R V CNG Station, Roha", ownership: "MGL", address: "Survey No. 146/3, Village Chikani, Taluka Roha", latitude: 18.52919925, longitude: 73.14789632, mapsLink: "https://www.google.com/maps?q=18.52919925,73.14789632" },
  { id: 49, name: "Shree Samarth Krupa, Golavali", ownership: "OMC (BPCL)", address: "Near Sunanda Circle, Padlegaon, Kalyan Shilphata Road, Tal Kalyan, Dist Thane", latitude: 19.15212414, longitude: 73.0609893, mapsLink: "https://www.google.com/maps?q=19.15212414,73.0609893" },
  { id: 50, name: "Shree Samarth Krupa Gas Services", ownership: "MGL", address: "1, Kalyan - Shilphata Rd, Shilphata, Thane, Maharashtra 421204", latitude: 19.14390301, longitude: 73.04819354, mapsLink: "https://www.google.com/maps?q=19.14390301,73.04819354" },
  { id: 51, name: "MSRTC Bhiwandi Private CNG Station", ownership: "MGL", address: "Quresh Nagar, Gokul Nagar, Bhiwandi, Maharashtra 421302", latitude: 19.30279651, longitude: 73.06567638, mapsLink: "https://www.google.com/maps?q=19.30279651,73.06567639" },
  { id: 52, name: "Inspire Engineering, Uttan", ownership: "MGL", address: "Plot Num 100/8, Uttan Gorai Road, Rai Village, Bhayander West, Thane 401101", latitude: 19.29405252, longitude: 72.81658003, mapsLink: "https://www.google.com/maps?q=19.29405252,72.81658003" },
  { id: 53, name: "Avdhoot Enterprises", ownership: "MGL", address: "Survey No. 38/18/B, Village Jite, Taluka Pen, District Raigad", latitude: 18.81588334, longitude: 73.09128244, mapsLink: "https://www.google.com/maps?q=18.81588334,73.09128245" },
  { id: 54, name: "Mauli Enterprises", ownership: "MGL", address: "77/4, Hal Budruk, Next to Reliance Petrol Pump, Mumbai-Pune Old Expressway, Khopoli 410203", latitude: 18.80968421, longitude: 73.31468661, mapsLink: "https://www.google.com/maps?q=18.80968421,73.31468661" },
  { id: 55, name: "Shree Agencies, Poladpur", ownership: "MGL", address: "Shop No.1, 1972, M.G. Road, Mahad, Raigad-402301", latitude: 18.0202157, longitude: 73.46795926, mapsLink: "https://www.google.com/maps?q=18.0202157,73.46795927" },
  { id: 56, name: "Shree Dattakrupa CNG Station, Mangaon", ownership: "MGL", address: "Survey No. 178/1/2, Village Koshte Khurd, Tehsil Mangaon, District Raigad", latitude: 18.28073383, longitude: 73.29896931, mapsLink: "https://www.google.com/maps?q=18.28073383,73.29896931" },
  { id: 57, name: "MSRTC Pen Private CNG Station", ownership: "MGL", address: "Survey No. 194B, Ramwadi, Pen, Raigad, Maharashtra 402107", latitude: 18.73139182, longitude: 73.08355929, mapsLink: "https://www.google.com/maps?q=18.73139182,73.08355929" },
  { id: 58, name: "Gujarat Service Center, Arthur Road", ownership: "OMC (IOCL)", address: "Next to Kasturba Hospital, Arthur Road, Sane Guruji Marg, Mumbai 400011", latitude: 18.98529919, longitude: 72.83113851, mapsLink: "https://www.google.com/maps?q=18.98529919,72.83113851" },
  { id: 59, name: "Royal Service Station, Andheri (E)", ownership: "OMC (IOCL)", address: "Near Hotel Leela, Andheri (E), Mumbai 400059", latitude: 19.10962243, longitude: 72.87422075, mapsLink: "https://www.google.com/maps?q=19.10962243,72.87422075" },
  { id: 60, name: "Amar Automobiles, Wadi Bunder", ownership: "OMC (BPCL)", address: "46 Wadi Bunder, P D'Mello Road, Mumbai 400010", latitude: 18.96055963, longitude: 72.84372221, mapsLink: "https://www.google.com/maps?q=18.96055963,72.84372221" },
  { id: 61, name: "Highway Automobiles, Ghatkopar (W)", ownership: "OMC (BPCL)", address: "LBS Marg, Nityanand Marg, Ghatkopar West", latitude: 19.09541427, longitude: 72.91524549, mapsLink: "https://www.google.com/maps?q=19.09541427,72.91524549" },
  { id: 62, name: "Shree Kedarnath Petroleum", ownership: "OMC (IOCL)", address: "Dahisar - Waklan Rd, Dahisar, Adivali", latitude: null, longitude: null, mapsLink: "" },
  { id: 63, name: "Kapadia Brothers, Malad (W)", ownership: "OMC (HPCL)", address: "S.V. Road, Malad (W) Mumbai 400064", latitude: 19.19547509, longitude: 72.84685343, mapsLink: "https://www.google.com/maps?q=19.19547509,72.84685343" },
  { id: 64, name: "Gurunanak Auto, Andheri (E)", ownership: "OMC (BPCL)", address: "82 Andheri Kurla Road, Andheri (E) Mumbai 400093", latitude: 19.11621033, longitude: 72.85655851, mapsLink: "https://www.google.com/maps?q=19.11621033,72.85655851" },
  { id: 65, name: "Charkop Petroleum, Charkop", ownership: "OMC (BPCL)", address: "Plot no. 186, 90ft Road, Behind Vasant Complex, Kandivali (W), Mumbai 400067", latitude: 19.21540903, longitude: 72.83653966, mapsLink: "https://www.google.com/maps?q=19.21540903,72.83653967" },
  { id: 66, name: "Mahaveer Auto, Bhandup (W)", ownership: "OMC (BPCL)", address: "S-86, Plot No. 3, Maruti Mandir Rd, Subhash Nagar, Bhandup West, Mumbai 400078", latitude: 19.15569293, longitude: 72.93796356, mapsLink: "https://www.google.com/maps?q=19.15569293,72.93796357" },
  { id: 67, name: "I Carport, Sahar", ownership: "OMC (IOCL)", address: "Mumbai International Airport, Terminal 2, Sahar, Mumbai 400009", latitude: 19.10266054, longitude: 72.87409062, mapsLink: "https://www.google.com/maps?q=19.10266054,72.87409062" },
  { id: 68, name: "Diamond Auto Service, Chembur", ownership: "OMC (HPCL)", address: "Sion Trombay Road, Near Akbarallys, Chembur Naka, Mumbai", latitude: 19.05349253, longitude: 72.89245452, mapsLink: "https://www.google.com/maps?q=19.05349253,72.89245453" },
  { id: 69, name: "Pushpak Auto, Jogeshwari (E)", ownership: "OMC (IOCL)", address: "Jogeshwari-Vikhroli Link Road, Jogeshwari (E) Mumbai 400060", latitude: 19.13945236, longitude: 72.86476706, mapsLink: "https://www.google.com/maps?q=19.13945236,72.86476706" },
  { id: 70, name: "Excel Service Station, Vile Parle (W)", ownership: "OMC (HPCL)", address: "V.M Road, Juhu Vile Parle Scheme, Vile Parle (W), Mumbai 400056", latitude: 19.0983781843031, longitude: 72.83975192100991, mapsLink: "https://www.google.com/maps?q=19.0983781843031,72.8397519210099" },
  { id: 71, name: "Fort Motors, Goregaon (E)", ownership: "OMC (IOCL)", address: "Fort Motors, Goregaon (E)", latitude: 19.16022829, longitude: 72.85865526, mapsLink: "https://www.google.com/maps?q=19.16022829,72.85865526" },
  { id: 72, name: "BPCL Mahape", ownership: "OMC (BPCL)", address: "Plot no 5, Mahape MIDC Rd, Reliance Corporate Park, MIDC, Mahape, Navi Mumbai 400701", latitude: 19.11482334, longitude: 73.01591909, mapsLink: "https://www.google.com/maps?q=19.11482334,73.01591909" },
  { id: 73, name: "COCO Sahar", ownership: "OMC (IOCL)", address: "CTS NO 145, Servo Corner, Cargo Complex, Andheri (E) 400069", latitude: 19.10047359, longitude: 72.86443185, mapsLink: "https://www.google.com/maps?q=19.10047359,72.86443185" },
  { id: 74, name: "Manhas Auto, Sewree", ownership: "OMC (BPCL)", address: "A D Marg, Sewri West, Opp Municipal Market, Near Sewri Bus Depot", latitude: 18.99865596, longitude: 72.84935779, mapsLink: "https://www.google.com/maps?q=18.99865596,72.84935779" },
  { id: 75, name: "Raj Fleet Centre, Palaspe", ownership: "OMC (HPCL)", address: "National Highway 4, Old Mumbai Pune Road, Palaspe Phata, Panvel, Navi Mumbai 410206", latitude: 18.97140189, longitude: 73.13159213, mapsLink: "https://www.google.com/maps?q=18.97140189,73.13159213" },
  { id: 76, name: "Joaquim Petroleum, Deonar", ownership: "OMC (IOCL)", address: "Sion - Trombay Rd, Opposite Telecom Factory Road, Deonar, Chembur, Mumbai", latitude: 19.04453741, longitude: 72.9162323, mapsLink: "https://www.google.com/maps?q=19.04453741,72.9162323" },
  { id: 77, name: "Venus Auto Centre, Kalamboli", ownership: "OMC (IOCL)", address: "National Highway No-4, Sector 2, Kalamboli, Navi Mumbai 410206", latitude: 19.01309283, longitude: 73.10815768, mapsLink: "https://www.google.com/maps?q=19.01309283,73.10815768" },
]
