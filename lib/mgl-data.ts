// MGL Fleet Platform - Mock Data & Types

export type UserRole = "mic" | "zic" | "fleet-operator" | "login";

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

export type FOStatus = "PENDING_ACTIVATION" | "ACTIVE" | "SUSPENDED";
export type OnboardingType = "MIC_ASSISTED" | "SELF_SERVICE";

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
    deliveryChallanUrl: "challan_veh001.pdf",
    deliveryDate: "2025-02-05",
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
    registrationDate: "2025-02-10",
    status: "L2_SUBMITTED",
    l1SubmittedAt: "2025-01-25",
    l1ApprovedAt: "2025-01-27",
    l2SubmittedAt: "2025-02-11",
    onboardingType: "MIC_ASSISTED",
    deliveryChallanUrl: "challan_veh002.pdf",
    deliveryDate: "2025-02-10",
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
