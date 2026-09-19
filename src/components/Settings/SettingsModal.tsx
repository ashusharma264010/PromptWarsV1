import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Key,
  LogOut,
  Sparkles,
  Check,
  Shield,
  Phone,
  Plus,
  Trash2,
  Users,
  Stethoscope
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    geminiApiKey,
    setGeminiApiKey,
    accessibility,
    updateAccessibility,
    updateEmergencyProfile,
    addFamilyMember,
    deleteFamilyMember,
    addDoctorContact,
    deleteDoctorContact,
    logout
  } = useApp();

  const [keyInput, setKeyInput] = useState(geminiApiKey);
  const [savedKeySuccess, setSavedKeySuccess] = useState(false);

  // Quick Edit States
  const [emergencyName, setEmergencyName] = useState(currentUser.emergencyContactName);
  const [emergencyPhone, setEmergencyPhone] = useState(currentUser.emergencyContact);
  const [bloodGroup, setBloodGroup] = useState(currentUser.bloodGroup);

  // New Family Member inline input
  const [famName, setFamName] = useState('');
  const [famRelation, setFamRelation] = useState('');
  const [famPhone, setFamPhone] = useState('');

  if (!isOpen) return null;

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(keyInput.trim());
    setSavedKeySuccess(true);
    setTimeout(() => setSavedKeySuccess(false), 2500);
  };

  const handleSaveEmergencyQuick = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmergencyProfile({
      emergencyContactName: emergencyName,
      emergencyContact: emergencyPhone,
      bloodGroup
    });
    alert('Emergency profile updated!');
  };

  const handleAddFamQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!famName.trim() || !famPhone.trim()) return;
    addFamilyMember({
      name: famName.trim(),
      relation: famRelation.trim() || 'Relative',
      phone: famPhone.trim(),
      role: 'family',
      isPrimaryCaregiver: false
    });
    setFamName('');
    setFamRelation('');
    setFamPhone('');
  };

  return (
    <div className="modal-overlay" role="dialog" aria-labelledby="settings-title" aria-modal="true">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 id="settings-title" className="font-heading" style={{ fontSize: '1.6rem' }}>
            ⚙️ Settings & Account Management
          </h2>
          <button onClick={onClose} className="btn btn-secondary btn-icon">
            <X size={24} />
          </button>
        </div>

        {/* User Profile Summary */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={26} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{currentUser.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Role: <strong>{currentUser.role.toUpperCase()}</strong> • Phone: {currentUser.phone}
              </div>
            </div>
          </div>
        </div>

        {/* NEW: Edit Emergency Info Section in Settings */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Phone size={20} color="var(--accent-emergency)" />
            <h3 className="font-heading" style={{ fontSize: '1.2rem' }}>Edit Emergency Contact & Medical Info</h3>
          </div>
          <form onSubmit={handleSaveEmergencyQuick}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Emergency Contact Name"
                value={emergencyName}
                onChange={e => setEmergencyName(e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Emergency Contact Phone"
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 10 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Blood Group (e.g. O+)"
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.9rem' }}>
              Save Emergency Info
            </button>
          </form>
        </div>

        {/* NEW: Family Members Management Section in Settings */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Users size={20} color="var(--accent-family)" />
            <h3 className="font-heading" style={{ fontSize: '1.2rem' }}>Family Members & Caregivers</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {(currentUser.familyMembersList || []).map(member => (
              <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--bg-card-hover)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.95rem' }}>
                  <strong>{member.name}</strong> ({member.relation}) — {member.phone}
                </span>
                <button onClick={() => deleteFamilyMember(member.id)} className="btn btn-secondary btn-icon" style={{ width: 32, height: 32 }}>
                  <Trash2 size={16} color="var(--accent-emergency)" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Add Family Form */}
          <form onSubmit={handleAddFamQuick} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 6 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Name"
              value={famName}
              onChange={e => setFamName(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '8px' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Relation"
              value={famRelation}
              onChange={e => setFamRelation(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '8px' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Phone"
              value={famPhone}
              onChange={e => setFamPhone(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '8px' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              + Add
            </button>
          </form>
        </div>

        {/* Gemini AI API Key Input */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Sparkles size={22} color="var(--accent-chores)" />
            <h3 className="font-heading" style={{ fontSize: '1.2rem' }}>Gemini AI API Key</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 12 }}>
            Enter a custom Gemini API key for live AI health trends and insurer site resolution.
          </p>
          <form onSubmit={handleSaveApiKey} style={{ display: 'flex', gap: 8 }}>
            <input
              type="password"
              className="form-input"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              style={{ flex: 1, fontSize: '0.95rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>
              {savedKeySuccess ? <Check size={18} /> : <Key size={18} />}
              <span>{savedKeySuccess ? 'Saved!' : 'Save Key'}</span>
            </button>
          </form>
        </div>

        {/* Accessibility Preferences */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 className="font-heading" style={{ fontSize: '1.2rem', marginBottom: 12 }}>
            👁️ Accessibility Preferences
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Text Display Size</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Baseline font size across all screens</div>
              </div>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '8px 12px' }}
                value={accessibility.fontScale}
                onChange={e => updateAccessibility({ fontScale: e.target.value as any })}
              >
                <option value="standard">Standard (18px)</option>
                <option value="large">Large (21px)</option>
                <option value="extra-large">Extra Large (25px)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
              <div>
                <strong>High Contrast Theme</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pure black background with high visibility yellow text</div>
              </div>
              <button
                onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
                className="btn btn-secondary"
                style={{ padding: '6px 14px', backgroundColor: accessibility.highContrast ? '#facc15' : undefined, color: accessibility.highContrast ? '#000' : undefined }}
              >
                {accessibility.highContrast ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => { logout(); onClose(); }}
          className="btn btn-danger"
          style={{ width: '100%' }}
        >
          <LogOut size={20} />
          <span>LOGOUT OF ACCOUNT</span>
        </button>
      </div>
    </div>
  );
};
