import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Pill,
  CheckCircle2,
  XCircle,
  Plus,
  AlertTriangle,
  History,
  Trash2,
  Edit3,
  Volume2,
  Clock,
  ArrowLeft,
  Clock3
} from 'lucide-react';
import { FrequencyType } from '../../types';

export const MedicineSection: React.FC = () => {
  const {
    medicines,
    adherenceLogs,
    markMedicineTaken,
    markMedicineSkipped,
    addMedicine,
    updateMedicineQuantity,
    deleteMedicine,
    setActiveTab,
    readAloud
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'today' | 'all' | 'logs' | 'add'>('today');

  // Form State for New Medicine
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('once_daily');
  const [customIntervalHours, setCustomIntervalHours] = useState<number>(8);
  const [totalQuantityPurchased, setTotalQuantityPurchased] = useState(30);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [instructions, setInstructions] = useState('');
  const [prescribingDoctor, setPrescribingDoctor] = useState('');

  // Custom Time Reminders List (e.g. ["08:00", "20:00"])
  const [timeReminders, setTimeReminders] = useState<string[]>(['08:00']);
  const [newTimeInput, setNewTimeInput] = useState('14:00');

  const handleAddTimeReminder = () => {
    if (!newTimeInput || timeReminders.includes(newTimeInput)) return;
    setTimeReminders([...timeReminders, newTimeInput]);
  };

  const handleRemoveTimeReminder = (t: string) => {
    setTimeReminders(timeReminders.filter(time => time !== t));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    let frequencyText = 'Once Daily';
    let dailyRate = 1;

    if (frequency === 'twice_daily') {
      frequencyText = 'Twice Daily';
      dailyRate = 2;
    } else if (frequency === 'thrice_daily') {
      frequencyText = 'Three Times Daily';
      dailyRate = 3;
    } else if (frequency === 'every_x_hours') {
      frequencyText = `Every ${customIntervalHours} Hours`;
      dailyRate = Math.round(24 / customIntervalHours);
    } else if (frequency === 'custom_interval') {
      frequencyText = `Custom Schedule (${timeReminders.length} times/day)`;
      dailyRate = timeReminders.length || 1;
    }

    addMedicine({
      name: name.trim(),
      dosage: dosage.trim(),
      frequency,
      customIntervalHours: frequency === 'every_x_hours' ? customIntervalHours : undefined,
      frequencyText,
      totalQuantityPurchased,
      remainingQuantity: totalQuantityPurchased,
      lowStockThreshold,
      dailyConsumptionRate: dailyRate,
      timesOfDay: timeReminders,
      instructions: instructions.trim() || 'Take with water',
      prescribingDoctor: prescribingDoctor.trim() || undefined
    });

    // Reset form
    setName('');
    setDosage('');
    setInstructions('');
    setPrescribingDoctor('');
    setTimeReminders(['08:00']);
    setActiveSubTab('all');
  };

  const lowStockMeds = medicines.filter(m => m.remainingQuantity <= m.lowStockThreshold);

  return (
    <div>
      {/* Top Header with Back to Home */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setActiveTab('home')} className="btn btn-home">
            <ArrowLeft size={22} />
            <span>HOME</span>
          </button>
          <h1 className="font-heading" style={{ fontSize: 'var(--title-font-size)', color: 'var(--accent-medicine)' }}>
            💊 Medicine Management & Reminders
          </h1>
        </div>

        <button onClick={() => readAloud('Medicines section. Configure custom intervals, set daily time reminders, and track pill stock.')} className="btn btn-secondary">
          <Volume2 size={20} />
          <span>Read Page</span>
        </button>
      </div>

      {/* Low Stock Alert Box if any */}
      {lowStockMeds.length > 0 && (
        <div className="card" style={{ borderColor: 'var(--accent-emergency)', backgroundColor: '#fff5f5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <AlertTriangle size={28} color="var(--accent-emergency)" />
            <h3 className="font-heading" style={{ color: 'var(--accent-emergency)' }}>
              Low Stock Reorder Alert ({lowStockMeds.length})
            </h3>
          </div>
          <p style={{ marginBottom: 12 }}>
            The following medicine supply is running low. Please reorder or update remaining count:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lowStockMeds.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '10px 16px', borderRadius: '12px', border: '1px solid #fca5a5' }}>
                <div>
                  <strong>{m.name}</strong> — {m.remainingQuantity} doses left (Alert threshold: {m.lowStockThreshold})
                </div>
                <button
                  onClick={() => {
                    const newQty = prompt(`Refilled ${m.name}? Enter new total remaining doses:`, String(m.totalQuantityPurchased));
                    if (newQty && !isNaN(Number(newQty))) updateMedicineQuantity(m.id, Number(newQty));
                  }}
                  className="btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.9rem' }}
                >
                  Mark Refilled
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab Navigation */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSubTab('today')}
          className={`btn ${activeSubTab === 'today' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backgroundColor: activeSubTab === 'today' ? 'var(--accent-medicine)' : undefined }}
        >
          <Clock size={20} />
          <span>Today's Schedule</span>
        </button>
        <button
          onClick={() => setActiveSubTab('all')}
          className={`btn ${activeSubTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backgroundColor: activeSubTab === 'all' ? 'var(--accent-medicine)' : undefined }}
        >
          <Pill size={20} />
          <span>All Inventory ({medicines.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`btn ${activeSubTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backgroundColor: activeSubTab === 'logs' ? 'var(--accent-medicine)' : undefined }}
        >
          <History size={20} />
          <span>Adherence Logs</span>
        </button>
        <button
          onClick={() => setActiveSubTab('add')}
          className={`btn ${activeSubTab === 'add' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backgroundColor: activeSubTab === 'add' ? 'var(--accent-medicine)' : undefined }}
        >
          <Plus size={20} />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* TAB 1: Today's Schedule with Custom Time Reminders */}
      {activeSubTab === 'today' && (
        <div>
          <h2 className="font-heading" style={{ marginBottom: 16 }}>Today's Scheduled Medicines & Time Reminders</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {medicines.map(med => (
              <div key={med.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{med.name}</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                    Dosage: {med.dosage} • {med.frequencyText}
                  </div>

                  {/* Scheduled Time Badges */}
                  {med.timesOfDay && med.timesOfDay.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      <Clock3 size={18} color="var(--accent-chores)" />
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)' }}>Daily Reminder Times:</span>
                      {med.timesOfDay.map((t, idx) => (
                        <span key={idx} className="status-badge badge-info" style={{ padding: '4px 10px', fontSize: '0.85rem' }}>
                          ⏰ {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: 6 }}>
                    📝 Instructions: {med.instructions}
                  </div>
                  <div style={{ marginTop: 6, fontSize: '0.95rem' }}>
                    📦 Remaining Supply: <strong style={{ color: med.remainingQuantity <= med.lowStockThreshold ? 'var(--accent-emergency)' : 'var(--text-main)' }}>{med.remainingQuantity} doses</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => markMedicineTaken(med.id)}
                    className="btn btn-primary"
                    style={{ backgroundColor: 'var(--status-normal)', padding: '14px 22px', fontSize: '1.1rem' }}
                    aria-label={`Mark ${med.name} as Taken`}
                  >
                    <CheckCircle2 size={24} />
                    <span>MARK TAKEN</span>
                  </button>
                  <button
                    onClick={() => markMedicineSkipped(med.id)}
                    className="btn btn-secondary"
                    style={{ padding: '14px 18px', fontSize: '1.05rem', color: 'var(--accent-emergency)' }}
                    aria-label={`Mark ${med.name} as Skipped`}
                  >
                    <XCircle size={22} />
                    <span>Skip</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: All Inventory */}
      {activeSubTab === 'all' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {medicines.map(med => (
            <div key={med.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{med.name}</h3>
                  <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Dosage: {med.dosage}</p>
                  <p style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 700 }}>Frequency: {med.frequencyText}</p>
                  
                  {med.timesOfDay && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      {med.timesOfDay.map((t, idx) => (
                        <span key={idx} className="status-badge badge-info" style={{ fontSize: '0.8rem', padding: '2px 8px' }}>
                          ⏰ {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {med.prescribingDoctor && <p style={{ fontSize: '0.9rem', marginTop: 4 }}>Prescribed by: {med.prescribingDoctor}</p>}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: med.remainingQuantity <= med.lowStockThreshold ? 'var(--accent-emergency)' : 'var(--status-normal)' }}>
                    {med.remainingQuantity} / {med.totalQuantityPurchased} remaining
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Low Stock Threshold: {med.lowStockThreshold}</div>
                  
                  <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        const newQ = prompt(`Adjust remaining stock for ${med.name}:`, String(med.remainingQuantity));
                        if (newQ !== null && !isNaN(Number(newQ))) updateMedicineQuantity(med.id, Number(newQ));
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    >
                      <Edit3 size={16} /> Adjust Stock
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${med.name}?`)) deleteMedicine(med.id);
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
          ))}
        </div>
      )}

      {/* TAB 3: Adherence History Logs */}
      {activeSubTab === 'logs' && (
        <div className="card">
          <h3 className="font-heading" style={{ marginBottom: 16 }}>Adherence & Dose History</h3>
          {adherenceLogs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No dose logs recorded yet today.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {adherenceLogs.map(log => (
                <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <strong>{log.medicineName}</strong> ({log.dosage}) — Scheduled {log.scheduledTime}
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Logged by {log.loggedBy} on {new Date(log.actionTime).toLocaleString()}
                    </div>
                  </div>
                  <span className={`status-badge ${log.status === 'taken' ? 'badge-success' : 'badge-alert'}`}>
                    {log.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Add New Medicine Form with Custom Intervals & Time Reminders */}
      {activeSubTab === 'add' && (
        <div className="card">
          <h3 className="font-heading" style={{ marginBottom: 16 }}>Add New Medicine & Custom Reminders</h3>
          <form onSubmit={handleAddSubmit}>
            <div className="form-group">
              <label className="form-label">Medicine Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Lisinopril or Vitamin D3"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dosage *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 10 mg - 1 Tablet"
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                required
              />
            </div>

            {/* Custom Interval Selection */}
            <div className="form-group">
              <label className="form-label">Dosage Interval / Frequency</label>
              <select className="form-select" value={frequency} onChange={e => setFrequency(e.target.value as FrequencyType)}>
                <option value="once_daily">Once Daily</option>
                <option value="twice_daily">Twice Daily</option>
                <option value="thrice_daily">Three Times Daily</option>
                <option value="every_x_hours">Custom Hourly Interval (Every X Hours)</option>
                <option value="custom_interval">Custom Time Reminders</option>
                <option value="as_needed">As Needed</option>
              </select>
            </div>

            {/* If Custom Hourly Interval */}
            {frequency === 'every_x_hours' && (
              <div className="form-group" style={{ backgroundColor: 'var(--primary-light)', padding: '16px', borderRadius: '12px' }}>
                <label className="form-label">Repeat Interval (Hours)</label>
                <input
                  type="number"
                  className="form-input"
                  value={customIntervalHours}
                  onChange={e => setCustomIntervalHours(Number(e.target.value))}
                  min={1}
                  max={48}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
                  Medicine will be scheduled every {customIntervalHours} hours.
                </span>
              </div>
            )}

            {/* Custom Specific Time Reminders Picker */}
            <div className="form-group" style={{ border: '2px dashed var(--border-color)', padding: '16px', borderRadius: '16px', marginBottom: 18 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock3 size={18} color="var(--primary)" />
                Configured Daily Time Reminders ({timeReminders.length})
              </label>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {timeReminders.map(time => (
                  <span key={time} className="status-badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.95rem' }}>
                    ⏰ {time}
                    <button
                      type="button"
                      onClick={() => handleRemoveTimeReminder(time)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-emergency)', fontWeight: 800 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, maxWidth: 300 }}>
                <input
                  type="time"
                  className="form-input"
                  value={newTimeInput}
                  onChange={e => setNewTimeInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddTimeReminder}
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px' }}
                >
                  + Add Time
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Total Quantity Purchased</label>
                <input
                  type="number"
                  className="form-input"
                  value={totalQuantityPurchased}
                  onChange={e => setTotalQuantityPurchased(Number(e.target.value))}
                  min={1}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Low Stock Alert Threshold</label>
                <input
                  type="number"
                  className="form-input"
                  value={lowStockThreshold}
                  onChange={e => setLowStockThreshold(Number(e.target.value))}
                  min={1}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Prescribing Doctor (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Dr. Robert Chen"
                value={prescribingDoctor}
                onChange={e => setPrescribingDoctor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Special Instructions</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="e.g. Take with food in the morning"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--accent-medicine)', width: '100%', marginTop: 12 }}>
              <Plus size={20} />
              <span>SAVE MEDICINE & TIME REMINDERS</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
