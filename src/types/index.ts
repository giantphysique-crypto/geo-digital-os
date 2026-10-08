export type UserRole =
  | 'Admin'
  | 'Management'
  | 'Tender Team'
  | 'Supply Chain'
  | 'CRM'
  | 'Accounts'
  | 'Data Management'
  | 'HR';

export type TenderStatus =
  | 'New'
  | 'Under Review'
  | 'Eligible'
  | 'Not Eligible'
  | 'Preparing'
  | 'Ready for Submission'
  | 'Submitted'
  | 'Under Evaluation'
  | 'Won'
  | 'Lost'
  | 'Cancelled';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface TenderDocumentItem {
  id: string;
  tenderId: string;
  title: string;
  category: 'Statutory' | 'Technical' | 'Financial' | 'OEM' | 'Affidavit' | 'Other';
  isRequired: boolean;
  isAvailable: boolean;
  expiryDate?: string;
  responsiblePerson: string;
  verificationStatus: 'Verified' | 'Pending Review' | 'Rejected' | 'Missing';
  uploadedFile?: string;
  notes?: string;
}

export interface TenderHistoryItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  note?: string;
}

export interface Tender {
  id: string;
  tenderNumber: string;
  title: string;
  department: string;
  organization: string;
  state: string;
  district: string;
  customerId?: string;
  tenderSource: 'GeM' | 'CPP Portal' | 'State e-Procurement' | 'Direct Institutional';
  tenderPortal: string;
  tenderUrl: string;
  product: string;
  quantity: number;
  estimatedValue: number; // in INR
  emdAmount: number; // in INR
  tenderFee: number; // in INR
  issueDate: string;
  submissionDeadline: string;
  openingDate: string;
  eligibilityRequirements: string;
  technicalRequirements: string;
  financialRequirements: string;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  priority: Priority;
  status: TenderStatus;
  notes: string;
  documentChecklist: TenderDocumentItem[];
  history: TenderHistoryItem[];
  orderId?: string; // Connected when won
}

export type OrderStatus =
  | 'New'
  | 'Confirmed'
  | 'Procurement Pending'
  | 'Ready for Dispatch'
  | 'Dispatched'
  | 'In Transit'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export type ProcurementStatus = 'Not Required' | 'Pending' | 'PO Issued' | 'In Production' | 'Received';
export type DispatchStatus = 'Packing Pending' | 'Packed' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Delivery Issue';
export type InvoiceStatus = 'Not Invoiced' | 'Invoiced' | 'Partially Paid' | 'Paid' | 'Overdue';
export type PaymentStatus = 'Pending' | 'Partially Paid' | 'Received' | 'Overdue';

export interface Order {
  id: string;
  orderNumber: string;
  tenderId: string;
  tenderNumber: string;
  customerId: string;
  customerName: string;
  department: string;
  state: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  orderDate: string;
  requiredDeliveryDate: string;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  status: OrderStatus;
  procurementStatus: ProcurementStatus;
  dispatchStatus: DispatchStatus;
  invoiceStatus: InvoiceStatus;
  paymentStatus: PaymentStatus;
  invoiceId?: string;
  dispatchId?: string;
  procurementId?: string;
  notes?: string;
  inventoryReserved: number;
}

export interface Customer {
  id: string;
  organizationName: string;
  department: string;
  contactPerson: string;
  designation: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  district: string;
  gstNumber: string;
  customerType: 'State Govt Department' | 'Central Ministry' | 'Skill Mission' | 'Tribal Welfare' | 'Autonomous Institute' | 'NGO / SHG Federation';
  totalTenderValue: number;
  notes: string;
  createdDate: string;
}

export interface ProductInventory {
  id: string;
  sku: string;
  name: string;
  model: string;
  brand: 'USHA' | 'Geo Toolkit' | 'USHA Allied';
  category: 'Sewing Machine' | 'Industrial Machine' | 'Vocational Toolkit' | 'Accessories & Spares';
  description: string;
  unitPrice: number;
  quantityAvailable: number;
  reservedQuantity: number;
  minimumStock: number;
  location: string;
  supplier: string;
  stockStatus: 'Available' | 'Reserved' | 'Low Stock' | 'Out of Stock';
  lastRestocked: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'Inward' | 'Outward' | 'Reserved' | 'Released';
  quantity: number;
  referenceType: 'Purchase Order' | 'Order' | 'Tender Allocation' | 'Audit Adjustment';
  referenceId: string;
  timestamp: string;
  performedBy: string;
}

export interface ProcurementItem {
  id: string;
  purchaseRequirementNumber: string;
  orderId?: string;
  orderNumber?: string;
  tenderId?: string;
  supplier: string;
  product: string;
  productId: string;
  quantity: number;
  costPerUnit: number;
  totalCost: number;
  poNumber?: string;
  status: 'Requirement Created' | 'PO Issued' | 'In Production' | 'Dispatched by OEM' | 'Received at Warehouse';
  createdDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  notes?: string;
}

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location: string;
  description: string;
  completed: boolean;
}

export interface PincodeInfo {
  pincode: string;
  city: string;
  district: string;
  state: string;
  zone: 'Zone A (Intra-City)' | 'Zone B (Intra-State / Regional)' | 'Zone C (Metro-to-Metro)' | 'Zone D (Rest of India)' | 'Zone E (Special / Remote / NE / J&K)';
  hubName: string;
  serviceableSurface: boolean;
  serviceableExpress: boolean;
  serviceableHeavyB2B: boolean;
  isCodAvailable: boolean;
}

export interface CourierCarrierOption {
  id: string;
  carrierName: string;
  carrierCode: 'delhivery' | 'bluedart' | 'vrl' | 'tci' | 'safexpress' | 'dtdc' | 'xpressbees';
  serviceType: 'Surface B2B Cargo' | 'Express Air Priority' | 'Heavy Freight Truckload' | 'Regional Express';
  mode: 'Surface' | 'Air' | 'Express';
  etdDays: number;
  estimatedDeliveryDate: string;
  rating: number;
  onTimeRate: number;
  baseRatePerKg: number;
  freightCharge: number;
  fuelSurcharge: number;
  docketFee: number;
  gstAmount: number;
  totalCost: number;
  isRecommended?: boolean;
  isFastest?: boolean;
  isCheapest?: boolean;
  isBestB2B?: boolean;
  serviceable: boolean;
  carrierFeatures: string[];
  pickupCutoffTime: string;
}

export interface DispatchRecord {
  id: string;
  dispatchNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  product: string;
  quantity: number;
  packingStatus: 'Packing Pending' | 'Packed';
  dispatchDate: string;
  transporter: string;
  carrierCode?: 'delhivery' | 'bluedart' | 'vrl' | 'tci' | 'safexpress' | 'dtdc' | 'xpressbees' | string;
  trackingNumber: string;
  vehicleNumber: string;
  lrNumber: string;
  eWayBillNumber: string;
  expectedDelivery: string;
  actualDelivery?: string;
  proofOfDeliveryUrl?: string;
  deliveryStatus: DispatchStatus;
  deliveryNotes?: string;
  originPinCode?: string;
  originCity?: string;
  destinationPinCode?: string;
  destinationState: string;
  destinationDistrict: string;
  deadWeightKg?: number;
  volumetricWeightKg?: number;
  chargeableWeightKg?: number;
  dimensionsCm?: { length: number; width: number; height: number };
  boxCount?: number;
  freightCost?: number;
  driverPhone?: string;
  currentGpsLocation?: string;
  trackingHistory?: TrackingEvent[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  department: string;
  invoiceDate: string;
  dueDate: string;
  invoiceValue: number;
  amountReceived: number;
  outstandingAmount: number;
  paymentStatus: InvoiceStatus;
  gstAmount: number;
  remindersCount: number;
  lastReminderDate?: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  paymentMode: 'PFMS Govt Treasury' | 'RTGS' | 'NEFT' | 'DD' | 'Cheque';
  referenceNumber: string;
  bankName: string;
  receivedBy: string;
  notes?: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  department: 'Tender' | 'Supply Chain' | 'CRM' | 'Accounts' | 'Data Management' | 'HR' | 'Management';
  role: string;
  phone: string;
  email: string;
  joiningDate: string;
  managerName: string;
  status: 'Active' | 'On Leave' | 'Field Visit';
  attendanceStatus: 'Present' | 'Work From Home' | 'On Leave' | 'Field Visit';
  activeTasks: number;
  completedTasks: number;
  performanceRating: number; // 1-5
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  department: 'Tender' | 'Supply Chain' | 'CRM' | 'Accounts' | 'Data Management' | 'HR' | 'Management';
  priority: Priority;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  relatedType?: 'Tender' | 'Customer' | 'Order' | 'Procurement' | 'Dispatch' | 'Invoice' | 'General';
  relatedId?: string;
  relatedName?: string;
  commentsCount: number;
  createdDate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'Tender' | 'Inventory' | 'Order' | 'Dispatch' | 'Accounts' | 'Task' | 'System';
  priority: Priority;
  timestamp: string;
  read: boolean;
  linkType?: 'tender' | 'order' | 'inventory' | 'invoice' | 'task' | 'customer';
  linkId?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  recordId: string;
  recordTitle: string;
  previousValue?: string;
  newValue?: string;
}

export interface AutomationRule {
  id: string;
  title: string;
  triggerEvent: string;
  condition: string;
  action: string;
  isActive: boolean;
  executionsCount: number;
  lastTriggered?: string;
}

export interface MasterDocument {
  id: string;
  name: string;
  category: 'Company Registration' | 'Taxation' | 'OEM Authorization' | 'Financial & Audited' | 'Quality & Certifications' | 'Affidavits';
  documentNumber: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  fileSize: string;
  responsibleEmployee: string;
}
