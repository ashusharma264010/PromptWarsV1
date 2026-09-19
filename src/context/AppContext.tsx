import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  FamilyMember,
  DoctorContact,
  Medicine,
  AdherenceLog,
  ChoreItem,
  GroceryItem,
  InsurancePolicy,
  HealthStatEntry,
  AiHealthSummary,
  NotificationItem,
  AccessibilitySettings,
  ActiveTab
} from '../types';
import { evaluateHealthStat } from '../services/healthRuleEngine';
import { generateHealthTrendInsight } from '../services/aiInterpreter';
import { resolveInsurerWebsite } from '../services/aiResolver';
import { speakText } from '../services/speechService';

const INITIAL_DOCTORS: DoctorContact[] = [
  { id: 'doc_1', name: 'Dr. Robert Chen', specialty: 'Cardiologist', phone: '+1 (555) 321-7890', clinicOrHospital: 'City General Heart Center' },
  { id: 'doc_2', name: 'Dr. Lisa Patel', specialty: 'Endocrinologist', phone: '+1 (555) 654-3210', clinicOrHospital: 'Metabolic Health Clinic' }
];

const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'fam_1', name: 'David Evans', relation: 'Son', phone: '+1 (555) 987-6543', role: 'family', isPrimaryCaregiver: true },
  { id: 'fam_2', name: 'Sarah Evans', relation: 'Daughter', phone: '+1 (555) 888-2211', role: 'family', isPrimaryCaregiver: false }
];

// Initial Sample Profiles
const INITIAL_SENIOR_PROFILE: UserProfile = {
  id: 'senior_margaret',
  name: 'Margaret Evans',
  pin: '1234',
  role: 'senior',
  phone: '+1 (555) 234-5678',
  emergencyContact: '+1 (555) 987-6543',
  emergencyContactName: 'David Evans (Son)',
  bloodGroup: 'O Positive (O+)',
  allergies: ['Penicillin', 'Sulfa drugs'],
  primaryDoctor: 'Dr. Robert Chen (Cardiologist)',
  doctorPhone: '+1 (555) 321-7890',
  doctorsList: INITIAL_DOCTORS,
  familyMembersList: INITIAL_FAMILY_MEMBERS,
  linkedFamilyId: 'family_david',
  linkedFamilyName: 'David Evans',
  inviteCode: 'FAM-7892'
};

const INITIAL_CAREGIVER_PROFILE: UserProfile = {
  id: 'family_david',
  name: 'David Evans',
  pin: '5678',
  role: 'family',
  phone: '+1 (555) 987-6543',
  emergencyContact: '+1 (555) 234-5678',
  emergencyContactName: 'Margaret Evans (Mother)',
  bloodGroup: 'A Positive (A+)',
  allergies: ['None'],
  primaryDoctor: 'Dr. Sarah Miller',
  doctorPhone: '+1 (555) 444-1122',
  doctorsList: INITIAL_DOCTORS,
  familyMembersList: INITIAL_FAMILY_MEMBERS,
  linkedFamilyId: 'senior_margaret',
  linkedFamilyName: 'Margaret Evans (Mother)',
  inviteCode: 'FAM-7892'
};

// Initial Sample Medicines with Custom Time Reminders & Intervals
const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med_1',
    name: 'Amlodipine (Blood Pressure)',
    dosage: '5 mg - 1 Tablet',
    frequency: 'once_daily',
    frequencyText: 'Once Daily at 08:00 AM',
    totalQuantityPurchased: 30,
    remainingQuantity: 4, // LOW STOCK
    lowStockThreshold: 5,
    dailyConsumptionRate: 1,
    timesOfDay: ['08:00'],
    instructions: 'Take with water before breakfast',
    prescribingDoctor: 'Dr. Robert Chen'
  },
  {
    id: 'med_2',
    name: 'Metformin (Blood Sugar)',
    dosage: '500 mg - 1 Tablet',
    frequency: 'every_x_hours',
    customIntervalHours: 12,
    frequencyText: 'Every 12 Hours (08:00 AM, 08:00 PM)',
    totalQuantityPurchased: 60,
    remainingQuantity: 18,
    lowStockThreshold: 10,
    dailyConsumptionRate: 2,
    timesOfDay: ['08:00', '20:00'],
    instructions: 'Take right after meals',
    prescribingDoctor: 'Dr. Lisa Patel'
  },
  {
    id: 'med_3',
    name: 'Multivitamin Senior Formula',
    dosage: '1 Capsule',
    frequency: 'custom_interval',
    customIntervalHours: 24,
    frequencyText: 'Custom Time: 01:00 PM Daily',
    totalQuantityPurchased: 90,
    remainingQuantity: 45,
    lowStockThreshold: 7,
    dailyConsumptionRate: 1,
    timesOfDay: ['13:00'],
    instructions: 'Take with full glass of water',
    prescribingDoctor: 'Dr. Robert Chen'
  }
];

const INITIAL_ADHERENCE: AdherenceLog[] = [
  {
    id: 'log_1',
    medicineId: 'med_1',
    medicineName: 'Amlodipine',
    dosage: '5 mg',
    scheduledTime: '08:00 AM',
    actionTime: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: 'taken',
    loggedBy: 'Margaret Evans'
  }
];

const INITIAL_CHORES: ChoreItem[] = [
  {
    id: 'chore_1',
    title: 'Water patio garden plants',
    category: 'chore',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '10:00',
    completed: false,
    sharedWithFamily: true
  },
  {
    id: 'chore_2',
    title: 'Doctor Appointment: Dr. Robert Chen (BP Follow-up)',
    category: 'appointment',
    dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
    dueTime: '11:00',
    completed: false,
    doctorName: 'Dr. Robert Chen',
    notes: 'Bring current BP log printout and medicine bottle.',
    sharedWithFamily: true
  }
];

const INITIAL_GROCERIES: GroceryItem[] = [
  { id: 'groc_1', name: 'Low sodium almond milk', quantity: '2 Cartons', purchased: false, addedBy: 'Margaret' },
  { id: 'groc_2', name: 'Fresh blueberries & apples', quantity: '1 Box', purchased: false, addedBy: 'David' }
];

const INITIAL_POLICIES: InsurancePolicy[] = [
  {
    id: 'pol_1',
    type: 'Health',
    insurerName: 'Star Health & Allied Insurance',
    policyNumber: 'P/181112/01/2026/00912',
    premiumAmount: 480,
    renewalDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0], // RENEWAL DUE IN 5 DAYS
    officialWebsiteUrl: 'https://www.starhealth.in',
    isAiResolvedUrl: true,
    customerSupportPhone: '1800-425-2255',
    notes: 'Comprehensive Senior Health Care Policy covering hospitalization and lab tests.'
  },
  {
    id: 'pol_2',
    type: 'Car',
    insurerName: 'HDFC ERGO General Insurance',
    policyNumber: '2311-2009-8812-01',
    premiumAmount: 220,
    renewalDate: '2026-11-20',
    officialWebsiteUrl: 'https://www.hdfcergo.com',
    isAiResolvedUrl: true,
    customerSupportPhone: '022-62346234',
    notes: 'Auto policy covering Honda Civic with roadside assistance.'
  },
  {
    id: 'pol_3',
    type: 'Term',
    insurerName: 'LIC of India Term Plan',
    policyNumber: 'LIC-7729-1092',
    premiumAmount: 600,
    renewalDate: '2026-12-15',
    officialWebsiteUrl: 'https://licindia.in',
    isAiResolvedUrl: true,
    customerSupportPhone: '022-68276827',
    notes: 'Life coverage protection.'
  }
];

const INITIAL_HEALTH_STATS: HealthStatEntry[] = [
  {
    id: 'stat_1',
    type: 'bp',
    timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    dateStr: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
    valueNumeric1: 122,
    valueNumeric2: 80,
    unit: 'mmHg',
    status: 'Normal',
    statusReason: 'Reading (122/80 mmHg) is healthy.'
  },
  {
    id: 'stat_2',
    type: 'bp',
    timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    dateStr: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
    valueNumeric1: 138,
    valueNumeric2: 88,
    unit: 'mmHg',
    status: 'Borderline',
    statusReason: 'Reading (138/88 mmHg) is in High Blood Pressure Stage 1.'
  },
  {
    id: 'stat_3',
    type: 'bp',
    timestamp: new Date().toISOString(),
    dateStr: new Date().toISOString().split('T')[0],
    valueNumeric1: 128,
    valueNumeric2: 82,
    unit: 'mmHg',
    status: 'Normal',
    statusReason: 'Reading (128/82 mmHg) is stable.'
  },
  {
    id: 'stat_4',
    type: 'glucose',
    timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    dateStr: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString().split('T')[0],
    valueNumeric1: 94,
    unit: 'mg/dL',
    status: 'Normal',
    statusReason: 'Blood sugar (94 mg/dL) is standard.'
  },
  {
    id: 'stat_5',
    type: 'temperature',
    timestamp: new Date().toISOString(),
    dateStr: new Date().toISOString().split('T')[0],
    valueNumeric1: 98.4,
    unit: '°F',
    status: 'Normal',
    statusReason: 'Body temperature (98.4°F) is normal.'
  }
];

interface AppContextType {
  // Auth & Profile
  currentUser: UserProfile;
  isLoggedIn: boolean;
  isCaregiverMode: boolean;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  loginWithPin: (pin: string) => boolean;
  logout: () => void;
  switchProfile: (role: 'senior' | 'family') => void;

  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Accessibility
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  readAloud: (text: string) => void;

  // Emergency & Family Settings Editing
  updateEmergencyProfile: (data: Partial<UserProfile>) => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  deleteFamilyMember: (id: string) => void;
  addDoctorContact: (doctor: Omit<DoctorContact, 'id'>) => void;
  deleteDoctorContact: (id: string) => void;

  // Medicines
  medicines: Medicine[];
  adherenceLogs: AdherenceLog[];
  markMedicineTaken: (medicineId: string) => void;
  markMedicineSkipped: (medicineId: string) => void;
  addMedicine: (med: Omit<Medicine, 'id'>) => void;
  updateMedicineQuantity: (medicineId: string, newQty: number) => void;
  deleteMedicine: (medicineId: string) => void;

  // Chores & Appointments & Groceries
  chores: ChoreItem[];
  groceries: GroceryItem[];
  addChore: (chore: Omit<ChoreItem, 'id'>) => void;
  toggleChoreCompleted: (id: string) => void;
  deleteChore: (id: string) => void;
  addGroceryItem: (name: string, quantity?: string) => void;
  toggleGroceryPurchased: (id: string) => void;
  deleteGroceryItem: (id: string) => void;

  // Insurance
  policies: InsurancePolicy[];
  addPolicy: (policy: Omit<InsurancePolicy, 'id'>) => Promise<void>;
  updatePolicyUrl: (id: string, newUrl: string) => void;
  deletePolicy: (id: string) => void;

  // Health Stats
  healthStats: HealthStatEntry[];
  aiSummary: AiHealthSummary | null;
  logHealthStat: (type: 'bp' | 'glucose' | 'temperature', val1: number, val2?: number, note?: string) => Promise<void>;
  refreshAiSummary: () => Promise<void>;

  // Cross links
  bookDoctorFromHealth: (doctorName?: string, reason?: string) => void;

  // Calculated Badges & Daily/Weekly Notifications
  notifications: NotificationItem[];
  dueMedicinesCount: number;
  lowStockCount: number;
  dueChoresCount: number;
  upcomingRenewalsCount: number;
  abnormalHealthCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('famcare_user');
    return saved ? JSON.parse(saved) : INITIAL_SENIOR_PROFILE;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isCaregiverMode, setIsCaregiverMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => localStorage.getItem('famcare_gemini_key') || '');

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('famcare_accessibility');
    const defaults = {
      fontScale: 'large' as const,
      highContrast: false,
      speechSpeed: 0.9,
      voiceInputEnabled: true,
      soundEnabled: true,
      speakEnabled: true,
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('famcare_medicines');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [adherenceLogs, setAdherenceLogs] = useState<AdherenceLog[]>(() => {
    const saved = localStorage.getItem('famcare_adherence');
    return saved ? JSON.parse(saved) : INITIAL_ADHERENCE;
  });

  const [chores, setChores] = useState<ChoreItem[]>(() => {
    const saved = localStorage.getItem('famcare_chores');
    return saved ? JSON.parse(saved) : INITIAL_CHORES;
  });

  const [groceries, setGroceries] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem('famcare_groceries');
    return saved ? JSON.parse(saved) : INITIAL_GROCERIES;
  });

  const [policies, setPolicies] = useState<InsurancePolicy[]>(() => {
    const saved = localStorage.getItem('famcare_policies');
    return saved ? JSON.parse(saved) : INITIAL_POLICIES;
  });

  const [healthStats, setHealthStats] = useState<HealthStatEntry[]>(() => {
    const saved = localStorage.getItem('famcare_health_stats');
    return saved ? JSON.parse(saved) : INITIAL_HEALTH_STATS;
  });

  const [aiSummary, setAiSummary] = useState<AiHealthSummary | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('famcare_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('famcare_accessibility', JSON.stringify(accessibility));
  }, [accessibility]);

  useEffect(() => {
    localStorage.setItem('famcare_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('famcare_adherence', JSON.stringify(adherenceLogs));
  }, [adherenceLogs]);

  useEffect(() => {
    localStorage.setItem('famcare_chores', JSON.stringify(chores));
  }, [chores]);

  useEffect(() => {
    localStorage.setItem('famcare_groceries', JSON.stringify(groceries));
  }, [groceries]);

  useEffect(() => {
    localStorage.setItem('famcare_policies', JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem('famcare_health_stats', JSON.stringify(healthStats));
  }, [healthStats]);

  useEffect(() => {
    refreshAiSummary();
  }, [healthStats]);

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    localStorage.setItem('famcare_gemini_key', key);
  };

  const loginWithPin = (pin: string): boolean => {
    if (pin === INITIAL_SENIOR_PROFILE.pin) {
      setCurrentUser(INITIAL_SENIOR_PROFILE);
      setIsCaregiverMode(false);
      setIsLoggedIn(true);
      return true;
    }
    if (pin === INITIAL_CAREGIVER_PROFILE.pin) {
      setCurrentUser(INITIAL_CAREGIVER_PROFILE);
      setIsCaregiverMode(true);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setActiveTab('home');
  };

  const switchProfile = (role: 'senior' | 'family') => {
    if (role === 'senior') {
      setCurrentUser(INITIAL_SENIOR_PROFILE);
      setIsCaregiverMode(false);
    } else {
      setCurrentUser(INITIAL_CAREGIVER_PROFILE);
      setIsCaregiverMode(true);
    }
  };

  const updateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...newSettings }));
  };

  const readAloud = (text: string) => {
    // Respect the global speak toggle; silently no-op when disabled
    if (accessibility.speakEnabled === false) return;
    speakText(text, accessibility.speechSpeed);
  };

  // Emergency & Family Profile Management
  const updateEmergencyProfile = (data: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
    readAloud('Emergency profile details updated successfully.');
  };

  const addFamilyMember = (memberData: Omit<FamilyMember, 'id'>) => {
    const newFamMember: FamilyMember = {
      ...memberData,
      id: `fam_${Date.now()}`
    };
    setCurrentUser(prev => ({
      ...prev,
      familyMembersList: [...(prev.familyMembersList || []), newFamMember]
    }));
    readAloud(`Added ${newFamMember.name} as linked family member.`);
  };

  const deleteFamilyMember = (id: string) => {
    setCurrentUser(prev => ({
      ...prev,
      familyMembersList: (prev.familyMembersList || []).filter(f => f.id !== id)
    }));
  };

  const addDoctorContact = (docData: Omit<DoctorContact, 'id'>) => {
    const newDoc: DoctorContact = {
      ...docData,
      id: `doc_${Date.now()}`
    };
    setCurrentUser(prev => ({
      ...prev,
      doctorsList: [...(prev.doctorsList || []), newDoc]
    }));
    readAloud(`Added ${newDoc.name} to doctor contacts.`);
  };

  const deleteDoctorContact = (id: string) => {
    setCurrentUser(prev => ({
      ...prev,
      doctorsList: (prev.doctorsList || []).filter(d => d.id !== id)
    }));
  };

  // Medicine Actions
  const markMedicineTaken = (medicineId: string) => {
    setMedicines(prev => prev.map(m => {
      if (m.id === medicineId) {
        const updatedQty = Math.max(0, m.remainingQuantity - 1);
        return { ...m, remainingQuantity: updatedQty };
      }
      return m;
    }));

    const med = medicines.find(m => m.id === medicineId);
    if (med) {
      const newLog: AdherenceLog = {
        id: `log_${Date.now()}`,
        medicineId: med.id,
        medicineName: med.name,
        dosage: med.dosage,
        scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTime: new Date().toISOString(),
        status: 'taken',
        loggedBy: currentUser.name
      };
      setAdherenceLogs(prev => [newLog, ...prev]);
      readAloud(`Marked ${med.name} as taken.`);
    }
  };

  const markMedicineSkipped = (medicineId: string) => {
    const med = medicines.find(m => m.id === medicineId);
    if (med) {
      const newLog: AdherenceLog = {
        id: `log_${Date.now()}`,
        medicineId: med.id,
        medicineName: med.name,
        dosage: med.dosage,
        scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTime: new Date().toISOString(),
        status: 'skipped',
        loggedBy: currentUser.name
      };
      setAdherenceLogs(prev => [newLog, ...prev]);
      readAloud(`Marked ${med.name} as skipped.`);
    }
  };

  const addMedicine = (medData: Omit<Medicine, 'id'>) => {
    const newMed: Medicine = {
      ...medData,
      id: `med_${Date.now()}`
    };
    setMedicines(prev => [...prev, newMed]);
    readAloud(`Added new medicine: ${newMed.name}`);
  };

  const updateMedicineQuantity = (medicineId: string, newQty: number) => {
    setMedicines(prev => prev.map(m => m.id === medicineId ? { ...m, remainingQuantity: newQty } : m));
  };

  const deleteMedicine = (medicineId: string) => {
    setMedicines(prev => prev.filter(m => m.id !== medicineId));
  };

  // Chores & Groceries
  const addChore = (choreData: Omit<ChoreItem, 'id'>) => {
    const newChore: ChoreItem = {
      ...choreData,
      id: `chore_${Date.now()}`
    };
    setChores(prev => [newChore, ...prev]);
    readAloud(`Added ${newChore.category}: ${newChore.title}`);
  };

  const toggleChoreCompleted = (id: string) => {
    setChores(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const deleteChore = (id: string) => {
    setChores(prev => prev.filter(c => c.id !== id));
  };

  const addGroceryItem = (name: string, quantity: string = '1 item') => {
    if (!name.trim()) return;
    const newItem: GroceryItem = {
      id: `groc_${Date.now()}`,
      name: name.trim(),
      quantity: quantity || '1 item',
      purchased: false,
      addedBy: currentUser.name
    };
    setGroceries(prev => [newItem, ...prev]);
    readAloud(`Added ${name} to grocery list`);
  };

  const toggleGroceryPurchased = (id: string) => {
    setGroceries(prev => prev.map(g => g.id === id ? { ...g, purchased: !g.purchased } : g));
  };

  const deleteGroceryItem = (id: string) => {
    setGroceries(prev => prev.filter(g => g.id !== id));
  };

  // Insurance Actions
  const addPolicy = async (policyData: Omit<InsurancePolicy, 'id'>) => {
    const resolved = await resolveInsurerWebsite(policyData.insurerName, geminiApiKey);

    const newPolicy: InsurancePolicy = {
      ...policyData,
      id: `pol_${Date.now()}`,
      officialWebsiteUrl: policyData.officialWebsiteUrl || resolved.officialWebsiteUrl,
      customerSupportPhone: policyData.customerSupportPhone || resolved.customerSupportPhone,
      isAiResolvedUrl: resolved.isAiResolved
    };
    setPolicies(prev => [...prev, newPolicy]);
    readAloud(`Added policy for ${newPolicy.insurerName}`);
  };

  const updatePolicyUrl = (id: string, newUrl: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, manualUrlOverride: newUrl, officialWebsiteUrl: newUrl } : p));
  };

  const deletePolicy = (id: string) => {
    setPolicies(prev => prev.filter(p => p.id !== id));
  };

  // Health Stats Actions
  const logHealthStat = async (type: 'bp' | 'glucose' | 'temperature', val1: number, val2?: number, note?: string) => {
    const evaluation = evaluateHealthStat(type, val1, val2);
    
    let unit = 'mg/dL';
    if (type === 'bp') unit = 'mmHg';
    if (type === 'temperature') unit = '°F';

    const newEntry: HealthStatEntry = {
      id: `stat_${Date.now()}`,
      type,
      timestamp: new Date().toISOString(),
      dateStr: new Date().toISOString().split('T')[0],
      valueNumeric1: val1,
      valueNumeric2: val2,
      unit,
      status: evaluation.status,
      statusReason: evaluation.reason,
      note
    };

    const updated = [newEntry, ...healthStats];
    setHealthStats(updated);

    const spokenResult = `Logged ${type.toUpperCase()}: ${val1}${val2 ? '/' + val2 : ''} ${unit}. Result status is ${evaluation.status}.`;
    readAloud(spokenResult);
  };

  const refreshAiSummary = async () => {
    const summary = await generateHealthTrendInsight(healthStats.slice(0, 7), geminiApiKey);
    setAiSummary(summary);
  };

  const bookDoctorFromHealth = (doctorName: string = INITIAL_SENIOR_PROFILE.primaryDoctor, reason: string = 'Follow-up on recent health reading') => {
    const appointmentDate = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0];
    addChore({
      title: `Doctor Appointment with ${doctorName}`,
      category: 'appointment',
      dueDate: appointmentDate,
      dueTime: '10:30',
      completed: false,
      doctorName,
      notes: reason,
      sharedWithFamily: true
    });
    setActiveTab('chores');
    readAloud(`Created doctor appointment reminder with ${doctorName}.`);
  };

  // Calculated Daily & Weekly Notifications for Home Screen Tile
  const todayStr = new Date().toISOString().split('T')[0];
  const nowMs = Date.now();

  const notifications: NotificationItem[] = [];

  // Low Stock Medicines
  medicines.forEach(m => {
    if (m.remainingQuantity <= m.lowStockThreshold) {
      notifications.push({
        id: `notif_low_${m.id}`,
        title: `Low Stock: ${m.name}`,
        description: `Only ${m.remainingQuantity} doses remaining. Refill needed soon.`,
        type: 'medicine',
        urgency: 'high',
        timeframe: 'today',
        actionTab: 'medicines'
      });
    }
  });

  // Today Due Tasks & Appointments
  chores.filter(c => !c.completed && c.dueDate <= todayStr).forEach(c => {
    notifications.push({
      id: `notif_task_${c.id}`,
      title: c.category === 'appointment' ? `Doctor Visit Today: ${c.title}` : `Task Due: ${c.title}`,
      description: c.notes || `Scheduled for ${c.dueTime || 'today'}`,
      type: c.category === 'appointment' ? 'appointment' : 'chore',
      urgency: c.category === 'appointment' ? 'high' : 'medium',
      timeframe: 'today',
      actionTab: 'chores'
    });
  });

  // Upcoming Renewals within 30 days
  policies.forEach(p => {
    const diffDays = Math.ceil((new Date(p.renewalDate).getTime() - nowMs) / (1000 * 3600 * 24));
    if (diffDays <= 30) {
      notifications.push({
        id: `notif_pol_${p.id}`,
        title: `Insurance Renewal in ${diffDays} Days`,
        description: `${p.insurerName} (${p.type} Policy #${p.policyNumber}) renewal due on ${p.renewalDate}.`,
        type: 'insurance',
        urgency: diffDays <= 7 ? 'high' : 'medium',
        timeframe: diffDays <= 7 ? 'today' : 'this_week',
        actionTab: 'insurance'
      });
    }
  });

  // Abnormal Health Stats
  const latestAbnormal = healthStats.find(h => h.status === 'Abnormal');
  if (latestAbnormal) {
    notifications.push({
      id: `notif_health_${latestAbnormal.id}`,
      title: `Health Alert: Abnormal ${latestAbnormal.type.toUpperCase()}`,
      description: `Logged reading ${latestAbnormal.valueNumeric1}${latestAbnormal.valueNumeric2 ? '/' + latestAbnormal.valueNumeric2 : ''} ${latestAbnormal.unit}.`,
      type: 'health',
      urgency: 'high',
      timeframe: 'today',
      actionTab: 'health'
    });
  }

  const dueMedicinesCount = medicines.filter(m => m.remainingQuantity > 0).length;
  const lowStockCount = medicines.filter(m => m.remainingQuantity <= m.lowStockThreshold).length;
  const dueChoresCount = chores.filter(c => !c.completed && (c.dueDate <= todayStr)).length;
  const upcomingRenewalsCount = policies.filter(p => {
    const diffDays = (new Date(p.renewalDate).getTime() - nowMs) / (1000 * 3600 * 24);
    return diffDays <= 30;
  }).length;
  const abnormalHealthCount = healthStats.filter(h => h.status === 'Abnormal').length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        isCaregiverMode,
        geminiApiKey,
        setGeminiApiKey,
        loginWithPin,
        logout,
        switchProfile,

        activeTab,
        setActiveTab,

        accessibility,
        updateAccessibility,
        readAloud,

        updateEmergencyProfile,
        addFamilyMember,
        deleteFamilyMember,
        addDoctorContact,
        deleteDoctorContact,

        medicines,
        adherenceLogs,
        markMedicineTaken,
        markMedicineSkipped,
        addMedicine,
        updateMedicineQuantity,
        deleteMedicine,

        chores,
        groceries,
        addChore,
        toggleChoreCompleted,
        deleteChore,
        addGroceryItem,
        toggleGroceryPurchased,
        deleteGroceryItem,

        policies,
        addPolicy,
        updatePolicyUrl,
        deletePolicy,

        healthStats,
        aiSummary,
        logHealthStat,
        refreshAiSummary,

        bookDoctorFromHealth,

        notifications,
        dueMedicinesCount,
        lowStockCount,
        dueChoresCount,
        upcomingRenewalsCount,
        abnormalHealthCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
