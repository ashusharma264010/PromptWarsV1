export type Role = 'senior' | 'family';

export interface DoctorContact {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  clinicOrHospital?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string; // e.g. "Son", "Daughter", "Nurse", "Spouse"
  phone: string;
  role: Role;
  isPrimaryCaregiver: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  pin: string; // 4-digit numeric PIN
  role: Role;
  phone: string;
  emergencyContact: string;
  emergencyContactName: string;
  bloodGroup: string;
  allergies: string[];
  primaryDoctor: string;
  doctorPhone: string;
  doctorsList: DoctorContact[];
  familyMembersList: FamilyMember[];
  linkedFamilyId?: string;
  linkedFamilyName?: string;
  inviteCode?: string;
}

export type FrequencyType = 'once_daily' | 'twice_daily' | 'thrice_daily' | 'every_x_hours' | 'custom_interval' | 'as_needed';

export interface Medicine {
  id: string;
  name: string;
  dosage: string; // e.g. "500 mg" or "1 tablet"
  frequency: FrequencyType;
  frequencyText: string; // e.g. "Every 6 Hours (8 AM, 2 PM, 8 PM)"
  customIntervalHours?: number; // e.g. every 4 hours, every 8 hours
  totalQuantityPurchased: number;
  remainingQuantity: number;
  lowStockThreshold: number; // e.g., alert when 5 units or 3 days remaining
  dailyConsumptionRate: number; // e.g. 2 tablets per day
  timesOfDay: string[]; // Specific time reminders e.g. ["08:00", "14:00", "20:00"]
  instructions: string; // e.g. "Take after food"
  prescribingDoctor?: string;
}

export interface AdherenceLog {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string; // ISO or HH:mm
  actionTime: string; // ISO date string
  status: 'taken' | 'skipped';
  loggedBy: string; // User name or 'Voice Assistant'
}

export interface ChoreItem {
  id: string;
  title: string;
  category: 'chore' | 'reminder' | 'appointment';
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  completed: boolean;
  assignedTo?: string;
  doctorName?: string;
  notes?: string;
  sharedWithFamily: boolean;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: string;
  purchased: boolean;
  addedBy: string;
  category?: string;
}

export type PolicyType = 'Health' | 'Car' | 'Term' | 'Home' | 'Other';

export interface InsurancePolicy {
  id: string;
  type: PolicyType;
  insurerName: string;
  policyNumber: string;
  premiumAmount: number;
  renewalDate: string; // YYYY-MM-DD
  officialWebsiteUrl?: string;
  isAiResolvedUrl?: boolean;
  manualUrlOverride?: string;
  customerSupportPhone?: string;
  documentName?: string;
  notes?: string;
}

export type StatType = 'glucose' | 'bp' | 'temperature';
export type StatStatus = 'Normal' | 'Borderline' | 'Abnormal';

export interface HealthStatEntry {
  id: string;
  type: StatType;
  timestamp: string; // ISO string
  dateStr: string; // YYYY-MM-DD
  valueNumeric1: number; // Fasting Glucose mg/dL OR Systolic mmHg OR Temp °F
  valueNumeric2?: number; // Diastolic mmHg for BP
  unit: string; // mg/dL, mmHg, °F
  status: StatStatus;
  statusReason: string;
  note?: string;
  loggedViaVoice?: boolean;
}

export interface AiHealthSummary {
  overallHealthStatus: 'Optimal' | 'Good' | 'Attention Needed';
  overallTrend: string;
  plainLanguageSummary: string;
  recommendation: string;
  suggestDoctorVisit: boolean;
  generatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'medicine' | 'chore' | 'appointment' | 'insurance' | 'health';
  urgency: 'high' | 'medium' | 'low';
  timeframe: 'today' | 'this_week';
  date?: string;
  actionTab?: ActiveTab;
}

export interface AccessibilitySettings {
  fontScale: 'standard' | 'large' | 'extra-large'; // 100%, 120%, 140%
  highContrast: boolean;
  speechSpeed: number; // 0.8 to 1.2
  voiceInputEnabled: boolean;
  soundEnabled: boolean;
  /** Master switch for all TTS narration (default: true) */
  speakEnabled: boolean;
}

export type ActiveTab = 'home' | 'medicines' | 'chores' | 'insurance' | 'health' | 'emergency' | 'family' | 'settings';
