import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneCall,
  AlertOctagon,
  ShieldCheck,
  ArrowLeft,
  Volume2,
  ExternalLink,
  Edit3,
  Plus,
  Trash2,
  Stethoscope,
  Check
} from 'lucide-react';

export const EmergencySection: React.FC = () => {
  const {
    currentUser,
    policies,
    updateEmergencyProfile,
    addDoctorContact,
    deleteDoctorContact,
    setActiveTab,
    readAloud
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Edit profile form state
  const [emergencyName, setEmergencyName] = useState(currentUser.emergencyContactName);
  const [emergencyPhone, setEmergencyPhone] = useState(currentUser.emergencyContact);
  const [bloodGroup, setBloodGroup] = useState(currentUser.bloodGroup);
  const [allergiesStr, setAllergiesStr] = useState(currentUser.allergies.join(', '));
  const [primaryDoctor, setPrimaryDoctor] = useState(currentUser.primaryDoctor);
  const [doctorPhone, setDoctorPhone] = useState(currentUser.doctorPhone);

  // Add Doctor Form state
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');
  const [docPhone, setDocPhone] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmergencyProfile({
      emergencyContactName: emergencyName.trim(),
      emergencyContact: emergencyPhone.trim(),
      bloodGroup: bloodGroup.trim(),
      allergies: allergiesStr.split(',').map(a => a.trim()).filter(Boolean),
      primaryDoctor: primaryDoctor.trim(),
      doctorPhone: doctorPhone.trim()
    });
    setIsEditingProfile(false);
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docPhone.trim()) return;
    addDoctorContact({
      name: docName.trim(),
      specialty: docSpecialty.trim() || 'General Practitioner',
      phone: docPhone.trim()
    });
    setDocName('');
    setDocSpecialty('');
    setDocPhone('');
    setIsAddingDoctor(false);
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
          <h1 className="font-heading" style={{ fontSize: 'var(--title-font-size)', color: 'var(--accent-emergency)' }}>
            🚨 Emergency Info & Speed Dial
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="btn btn-secondary">
            <Edit3 size={18} />
            <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Emergency Details'}</span>
          </button>
          <button onClick={() => readAloud('Emergency Info section. Fast read-only view of your family contacts, doctor list, blood group, allergies, and policies.')} className="btn btn-secondary">
            <Volume2 size={20} />
            <span>Read Page</span>
          </button>
        </div>
      </div>

      {/* Edit Emergency Info Form Card */}
      {isEditingProfile && (
        <div className="card" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--primary-light)', marginBottom: 20 }}>
          <h3 className="font-heading" style={{ marginBottom: 14, color: 'var(--primary)' }}>
            ✏️ Edit Emergency & Medical Contacts
          </h3>
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Emergency Contact Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={emergencyName}
                  onChange={e => setEmergencyName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Contact Phone *</label>
                <input
                  type="text"
                  className="form-input"
                  value={emergencyPhone}
                  onChange={e => setEmergencyPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <input
                  type="text"
                  className="form-input"
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Known Allergies (Comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  value={allergiesStr}
                  onChange={e => setAllergiesStr(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Primary Doctor Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={primaryDoctor}
                  onChange={e => setPrimaryDoctor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Doctor Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={doctorPhone}
                  onChange={e => setDoctorPhone(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }}>
              <Check size={20} />
              <span>SAVE EMERGENCY DETAILS</span>
            </button>
          </form>
        </div>
      )}

      {/* Speed Dial Action Bar */}
      <div className="card" style={{ backgroundColor: '#fee2e2', borderColor: 'var(--accent-emergency)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <AlertOctagon size={36} color="var(--accent-emergency)" />
          <div>
            <h2 className="font-heading" style={{ color: 'var(--accent-emergency)' }}>
              Emergency Quick Dial
            </h2>
            <p style={{ fontSize: '1rem', color: '#991b1b' }}>
              Tap below to dial immediate family or emergency services directly from your phone.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <a
            href={`tel:${currentUser.emergencyContact}`}
            className="btn btn-primary"
            style={{ backgroundColor: 'var(--accent-emergency)', padding: '16px', fontSize: '1.15rem' }}
          >
            <PhoneCall size={24} />
            <span>Call {currentUser.emergencyContactName}</span>
          </a>

          <a
            href={`tel:${currentUser.doctorPhone}`}
            className="btn btn-primary"
            style={{ backgroundColor: 'var(--primary)', padding: '16px', fontSize: '1.15rem' }}
          >
            <PhoneCall size={24} />
            <span>Call Doctor ({currentUser.primaryDoctor})</span>
          </a>

          <a
            href="tel:911"
            className="btn btn-danger"
            style={{ padding: '16px', fontSize: '1.15rem', backgroundColor: '#991b1b' }}
          >
            <PhoneCall size={24} />
            <span>DIAL 911 / 112</span>
          </a>
        </div>
      </div>

      {/* Critical Medical Profile */}
      <div className="card">
        <h2 className="font-heading" style={{ marginBottom: 16 }}>Critical Medical Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <div style={{ backgroundColor: 'var(--bg-card-hover)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Patient Name</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{currentUser.name}</div>
          </div>

          <div style={{ backgroundColor: '#fff1f2', padding: '16px', borderRadius: '16px', border: '1px solid #fecdd3' }}>
            <div style={{ fontSize: '0.9rem', color: '#9f1239' }}>Blood Type</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-health)' }}>{currentUser.bloodGroup}</div>
          </div>

          <div style={{ backgroundColor: '#fef3c7', padding: '16px', borderRadius: '16px', border: '1px solid #fde047' }}>
            <div style={{ fontSize: '0.9rem', color: '#92400e' }}>Known Allergies</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#b45309' }}>
              {currentUser.allergies.join(', ') || 'None'}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-card-hover)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Primary Physician</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{currentUser.primaryDoctor}</div>
            <div style={{ fontSize: '0.95rem', color: 'var(--primary)' }}>{currentUser.doctorPhone}</div>
          </div>
        </div>
      </div>

      {/* List of Doctors Contacts */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Stethoscope size={26} color="var(--primary)" />
            <h2 className="font-heading">Physicians & Specialist Contacts List</h2>
          </div>

          <button onClick={() => setIsAddingDoctor(!isAddingDoctor)} className="btn btn-secondary" style={{ padding: '6px 14px' }}>
            <Plus size={18} />
            <span>Add Doctor</span>
          </button>
        </div>

        {isAddingDoctor && (
          <form onSubmit={handleAddDoctorSubmit} style={{ backgroundColor: 'var(--bg-card-hover)', padding: '16px', borderRadius: '16px', marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Doctor Name (e.g. Dr. Miller)"
                value={docName}
                onChange={e => setDocName(e.target.value)}
                required
              />
              <input
                type="text"
                className="form-input"
                placeholder="Specialty (e.g. Neurologist)"
                value={docSpecialty}
                onChange={e => setDocSpecialty(e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Phone Number"
                value={docPhone}
                onChange={e => setDocPhone(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: 12, width: '100%' }}>
              SAVE DOCTOR CONTACT
            </button>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(currentUser.doctorsList || []).map(doc => (
            <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong style={{ fontSize: '1.2rem' }}>{doc.name}</strong> — <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{doc.specialty}</span>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Phone: {doc.phone}</div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <a href={`tel:${doc.phone}`} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.9rem' }}>
                  <PhoneCall size={16} /> Call
                </a>
                <button onClick={() => deleteDoctorContact(doc.id)} className="btn btn-secondary btn-icon">
                  <Trash2 size={18} color="var(--accent-emergency)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insurance Policies At a Glance */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={28} color="var(--accent-insurance)" />
            <h2 className="font-heading">Insurance Policies at a Glance</h2>
          </div>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hospital Desk Read-Only View</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {policies.map(policy => (
            <div key={policy.id} style={{ padding: '18px', borderRadius: '16px', border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <span className="status-badge badge-info" style={{ marginBottom: 6 }}>{policy.type} Insurance</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{policy.insurerName}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>
                    Policy No: {policy.policyNumber}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Renewal Expiry: {policy.renewalDate} • Support Tel: {policy.customerSupportPhone || '1-800-555-0199'}
                  </div>
                </div>

                {policy.officialWebsiteUrl && (
                  <a
                    href={policy.manualUrlOverride || policy.officialWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ padding: '10px 16px', fontSize: '0.95rem' }}
                  >
                    <ExternalLink size={18} />
                    <span>Open Web Portal</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
