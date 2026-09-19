import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ExternalLink,
  Plus,
  Clock,
  Edit3,
  Trash2,
  Phone,
  ArrowLeft,
  Volume2,
  Sparkles,
  Filter,
  HeartPulse,
  Car,
  Home,
  ShieldAlert
} from 'lucide-react';
import { PolicyType } from '../../types';

export const InsuranceSection: React.FC = () => {
  const {
    policies,
    addPolicy,
    updatePolicyUrl,
    deletePolicy,
    setActiveTab,
    readAloud
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'add'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isResolvingAi, setIsResolvingAi] = useState(false);

  // Form State
  const [type, setType] = useState<PolicyType>('Health');
  const [insurerName, setInsurerName] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [premiumAmount, setPremiumAmount] = useState(350);
  const [renewalDate, setRenewalDate] = useState(
    new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [manualUrl, setManualUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!insurerName.trim() || !policyNumber.trim()) return;

    setIsResolvingAi(true);
    readAloud(`Resolving official insurer portal for ${insurerName}...`);

    await addPolicy({
      type,
      insurerName: insurerName.trim(),
      policyNumber: policyNumber.trim(),
      premiumAmount,
      renewalDate,
      officialWebsiteUrl: manualUrl.trim() || undefined,
      manualUrlOverride: manualUrl.trim() || undefined,
      notes: notes.trim()
    });

    setIsResolvingAi(false);
    setInsurerName('');
    setPolicyNumber('');
    setManualUrl('');
    setNotes('');
    setActiveSubTab('all');
  };

  const nowMs = Date.now();

  const filteredPolicies = policies.filter(p => {
    if (selectedCategory === 'ALL') return true;
    return p.type.toUpperCase() === selectedCategory.toUpperCase();
  });

  return (
    <div>
      {/* Header Bar */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setActiveTab('home')} className="btn btn-home">
            <ArrowLeft size={22} />
            <span>HOME</span>
          </button>
          <h1 className="font-heading" style={{ fontSize: 'var(--title-font-size)', color: 'var(--accent-insurance)' }}>
            🛡️ Segregated Insurance Vault
          </h1>
        </div>

        <button onClick={() => readAloud('Insurance Vault. Filter and manage health, car, term, and home insurance policies.')} className="btn btn-secondary">
          <Volume2 size={20} />
          <span>Read Page</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => setActiveSubTab('all')}
          className={`btn ${activeSubTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backgroundColor: activeSubTab === 'all' ? 'var(--accent-insurance)' : undefined }}
        >
          <ShieldCheck size={20} />
          <span>All Policies ({policies.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('add')}
          className={`btn ${activeSubTab === 'add' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backgroundColor: activeSubTab === 'add' ? 'var(--accent-insurance)' : undefined }}
        >
          <Plus size={20} />
          <span>Add New Policy</span>
        </button>
      </div>

      {/* Segregation Category Filter Bar */}
      {activeSubTab === 'all' && (
        <div className="card" style={{ padding: '14px 20px', backgroundColor: 'var(--bg-card-hover)', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Filter size={18} color="var(--primary)" /> Segregate By Type:
            </span>

            {['ALL', 'Health', 'Car', 'Term', 'Home', 'Other'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: '0.9rem' }}
              >
                {cat === 'Health' && <HeartPulse size={16} />}
                {cat === 'Car' && <Car size={16} />}
                {cat === 'Home' && <Home size={16} />}
                {cat === 'Term' && <ShieldAlert size={16} />}
                <span>{cat === 'ALL' ? 'All Policies' : cat}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: Policy List */}
      {activeSubTab === 'all' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {filteredPolicies.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
              <h3>No policies found in category "{selectedCategory}"</h3>
              <p style={{ color: 'var(--text-muted)' }}>Tap "Add New Policy" above to add one.</p>
            </div>
          ) : (
            filteredPolicies.map(pol => {
              const diffDays = Math.ceil((new Date(pol.renewalDate).getTime() - nowMs) / (1000 * 3600 * 24));
              const isDueSoon = diffDays <= 30;

              const targetUrl = pol.manualUrlOverride || pol.officialWebsiteUrl || `https://www.google.com/search?q=${encodeURIComponent(pol.insurerName)}`;

              return (
                <div key={pol.id} className="card" style={{ borderLeft: isDueSoon ? '6px solid var(--status-borderline)' : '6px solid var(--accent-insurance)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span className="status-badge badge-info" style={{ textTransform: 'uppercase' }}>
                          {pol.type} Policy
                        </span>
                        {isDueSoon && (
                          <span className="status-badge badge-warning">
                            <Clock size={16} /> Renew in {diffDays} Days ({pol.renewalDate})
                          </span>
                        )}
                      </div>

                      <h2 className="font-heading" style={{ fontSize: '1.5rem', marginTop: 4 }}>
                        {pol.insurerName}
                      </h2>

                      <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', margin: '6px 0' }}>
                        Policy #: {pol.policyNumber}
                      </div>

                      <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                        Premium: ${pol.premiumAmount}/year • Renewal Date: <strong>{pol.renewalDate}</strong>
                      </div>

                      {pol.notes && (
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: 6 }}>
                          📝 {pol.notes}
                        </div>
                      )}

                      {pol.customerSupportPhone && (
                        <div style={{ fontSize: '0.95rem', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-family)', fontWeight: 600 }}>
                          <Phone size={16} /> Customer Support: {pol.customerSupportPhone}
                        </div>
                      )}
                    </div>

                    {/* Right Action Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ backgroundColor: 'var(--accent-insurance)', padding: '12px 20px', fontSize: '1.05rem', textDecoration: 'none' }}
                        onClick={() => readAloud(`Opening official portal for ${pol.insurerName} in a new tab.`)}
                      >
                        <ExternalLink size={20} />
                        <span>OPEN INSURER PORTAL</span>
                      </a>

                      {pol.isAiResolvedUrl && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Sparkles size={14} color="var(--accent-chores)" /> GenAI Resolved Link
                        </span>
                      )}

                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <button
                          onClick={() => {
                            const newU = prompt(`Edit official portal website link for ${pol.insurerName}:`, targetUrl);
                            if (newU !== null) updatePolicyUrl(pol.id, newU.trim());
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                          <Edit3 size={16} /> Edit Link
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove policy for ${pol.insurerName}?`)) deletePolicy(pol.id);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.85rem', color: 'var(--accent-emergency)' }}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: Add New Policy Form */}
      {activeSubTab === 'add' && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <ShieldCheck size={28} color="var(--accent-insurance)" />
            <h2 className="font-heading">Add Insurance Policy</h2>
          </div>

          <form onSubmit={handleAddSubmit}>
            <div className="form-group">
              <label className="form-label">Policy Type Category *</label>
              <select className="form-select" value={type} onChange={e => setType(e.target.value as PolicyType)}>
                <option value="Health">Health Insurance</option>
                <option value="Car">Motor / Car Insurance</option>
                <option value="Term">Term Life Insurance</option>
                <option value="Home">Home Insurance</option>
                <option value="Other">Other Policy</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Insurer Provider Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Star Health, Medicare, Blue Cross, HDFC ERGO"
                value={insurerName}
                onChange={e => setInsurerName(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
                ✨ GenAI will automatically resolve the official portal URL & customer support phone for you.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Policy Number *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. P/181112/01/2026"
                value={policyNumber}
                onChange={e => setPolicyNumber(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Annual Premium ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={premiumAmount}
                  onChange={e => setPremiumAmount(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Next Renewal Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={renewalDate}
                  onChange={e => setRenewalDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Manual Website Link (Optional Override)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://www.your-insurer.com (Leave blank to use GenAI resolution)"
                value={manualUrl}
                onChange={e => setManualUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes & Coverage Details</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="e.g. Covers senior hospitalization up to $50,000"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: 'var(--accent-insurance)', width: '100%', marginTop: 10 }}
              disabled={isResolvingAi}
            >
              <Plus size={20} />
              <span>{isResolvingAi ? 'RESOLVING AI PORTAL...' : 'SAVE POLICY'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
