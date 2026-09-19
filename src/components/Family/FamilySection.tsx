import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle,
  Copy,
  ArrowLeft,
  Volume2,
  RefreshCw,
  Trash2,
  Phone,
  Plus
} from 'lucide-react';
import { Role } from '../../types';

export const FamilySection: React.FC = () => {
  const {
    currentUser,
    isCaregiverMode,
    switchProfile,
    addFamilyMember,
    deleteFamilyMember,
    setActiveTab,
    readAloud
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Form states for adding family member
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('family');

  const handleCopyCode = () => {
    if (currentUser.inviteCode) {
      navigator.clipboard.writeText(currentUser.inviteCode);
      setCopied(true);
      readAloud('Invitation code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addFamilyMember({
      name: name.trim(),
      relation: relation.trim() || 'Relative',
      phone: phone.trim(),
      role,
      isPrimaryCaregiver: false
    });

    setName('');
    setRelation('');
    setPhone('');
    setIsAddingMember(false);
  };

  return (
    <div>
      {/* Top Header */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setActiveTab('home')} className="btn btn-home">
            <ArrowLeft size={22} />
            <span>HOME</span>
          </button>
          <h1 className="font-heading" style={{ fontSize: 'var(--title-font-size)', color: 'var(--accent-family)' }}>
            👨‍👩‍👧‍👦 Family Group & Caregiver Management
          </h1>
        </div>

        <button onClick={() => readAloud('Family Care section. Manage linked family members, caregiver access, and invite new relatives.')} className="btn btn-secondary">
          <Volume2 size={20} />
          <span>Read Page</span>
        </button>
      </div>

      {/* Account Mode Switcher Banner */}
      <div className="card" style={{ backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 className="font-heading" style={{ color: 'var(--primary)' }}>
              Active View: {isCaregiverMode ? 'Caregiver View (David)' : 'Senior View (Margaret)'}
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              {isCaregiverMode
                ? "You are managing Margaret's full profile remotely. All actions affect her medicines, chores, and stats."
                : "You are logged in as Margaret. Linked family members can view and manage your account with full permissions."}
            </p>
          </div>

          <button
            onClick={() => switchProfile(isCaregiverMode ? 'senior' : 'family')}
            className="btn btn-primary"
            style={{ padding: '12px 20px' }}
          >
            <RefreshCw size={20} />
            <span>SWITCH TO {isCaregiverMode ? 'SENIOR VIEW' : 'CAREGIVER VIEW'}</span>
          </button>
        </div>
      </div>

      {/* Linked Members List Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 className="font-heading">Linked Family Members ({currentUser.familyMembersList?.length || 0})</h3>
          <button
            onClick={() => setIsAddingMember(!isAddingMember)}
            className="btn btn-primary"
            style={{ backgroundColor: 'var(--accent-family)', padding: '8px 16px', fontSize: '0.95rem' }}
          >
            <UserPlus size={18} />
            <span>ADD FAMILY MEMBER</span>
          </button>
        </div>

        {/* Add Family Member Form */}
        {isAddingMember && (
          <div style={{ backgroundColor: 'var(--bg-card-hover)', padding: '20px', borderRadius: '16px', marginBottom: 20, border: '2px solid var(--border-color)' }}>
            <h4 className="font-heading" style={{ marginBottom: 12 }}>Add New Family Member / Relative</h4>
            <form onSubmit={handleAddMemberSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sarah Evans"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Relationship *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Daughter, Son, Spouse, Nurse"
                    value={relation}
                    onChange={e => setRelation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. +1 (555) 888-2211"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Account Role</label>
                  <select className="form-select" value={role} onChange={e => setRole(e.target.value as Role)}>
                    <option value="family">Family Caregiver</option>
                    <option value="senior">Senior Co-Owner</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--accent-family)', width: '100%', marginTop: 8 }}>
                <Plus size={20} />
                <span>SAVE FAMILY MEMBER</span>
              </button>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Senior Account Owner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '16px', border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} color="var(--accent-family)" />
              </div>
              <div>
                <strong style={{ fontSize: '1.2rem' }}>Margaret Evans</strong> (Account Owner)
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Phone: {currentUser.phone} • Role: Senior</div>
              </div>
            </div>
            <span className="status-badge badge-success">SENIOR OWNER</span>
          </div>

          {/* Dynamic Family Members List */}
          {(currentUser.familyMembersList || []).map(member => (
            <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '16px', border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={24} color="var(--primary)" />
                </div>
                <div>
                  <strong style={{ fontSize: '1.2rem' }}>{member.name}</strong> ({member.relation})
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Phone: {member.phone} • Access: Full Caregiver</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <a href={`tel:${member.phone}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <Phone size={16} /> Call
                </a>
                <button onClick={() => deleteFamilyMember(member.id)} className="btn btn-secondary btn-icon">
                  <Trash2 size={18} color="var(--accent-emergency)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Family Member */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <UserPlus size={26} color="var(--accent-family)" />
          <h3 className="font-heading">Invite Family Member with Passcode</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
          Share this unique 6-digit family invitation code with your adult child or relative to link their phone to your account.
        </p>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, padding: '10px 20px', letterSpacing: 3, backgroundColor: 'var(--bg-card-hover)', border: '2px dashed var(--primary)', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
            {currentUser.inviteCode || 'FAM-7892'}
          </div>
          <button onClick={handleCopyCode} className="btn btn-secondary">
            {copied ? <CheckCircle size={20} color="var(--status-normal)" /> : <Copy size={20} />}
            <span>{copied ? 'COPIED!' : 'COPY'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
