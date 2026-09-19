import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  ShoppingBag,
  Calendar,
  Plus,
  Mic,
  MicOff,
  Trash2,
  CheckCircle,
  Clock,
  ArrowLeft,
  Volume2
} from 'lucide-react';
import { listenToVoiceInput } from '../../services/speechService';

export const ChoresSection: React.FC = () => {
  const {
    chores,
    groceries,
    addChore,
    toggleChoreCompleted,
    deleteChore,
    addGroceryItem,
    toggleGroceryPurchased,
    deleteGroceryItem,
    setActiveTab,
    readAloud
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'today' | 'groceries' | 'chores' | 'appointments'>('today');

  // Form states
  const [newChoreTitle, setNewChoreTitle] = useState('');
  const [newChoreCategory, setNewChoreCategory] = useState<'chore' | 'reminder' | 'appointment'>('chore');
  const [newChoreDate, setNewChoreDate] = useState(new Date().toISOString().split('T')[0]);
  const [newChoreTime, setNewChoreTime] = useState('09:00');
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Grocery voice listening state
  const [newGroceryInput, setNewGroceryInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleVoiceListen = () => {
    if (isListening) return;
    setIsListening(true);
    readAloud('Listening... Please speak your grocery item name clearly.');

    listenToVoiceInput(
      (transcript) => {
        setNewGroceryInput(transcript);
        addGroceryItem(transcript);
        setIsListening(false);
      },
      () => setIsListening(false),
      (err) => {
        alert(err);
        setIsListening(false);
      }
    );
  };

  const handleChoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChoreTitle.trim()) return;

    const targetCategory = activeSubTab === 'appointments' ? 'appointment' : newChoreCategory;

    addChore({
      title: newChoreTitle.trim(),
      category: targetCategory,
      dueDate: newChoreDate,
      dueTime: newChoreTime,
      completed: false,
      doctorName: targetCategory === 'appointment' ? newDoctorName : undefined,
      notes: newNotes,
      sharedWithFamily: true
    });

    setNewChoreTitle('');
    setNewDoctorName('');
    setNewNotes('');
    setActiveSubTab('today');
  };

  const handleAddGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroceryInput.trim()) return;
    addGroceryItem(newGroceryInput.trim());
    setNewGroceryInput('');
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = chores.filter(c => c.dueDate <= todayStr);
  const appointmentsList = chores.filter(c => c.category === 'appointment');

  return (
    <div>
      {/* Top Navigation */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setActiveTab('home')} className="btn btn-home">
            <ArrowLeft size={22} />
            <span>HOME</span>
          </button>
          <h1 className="font-heading" style={{ fontSize: 'var(--title-font-size)', color: 'var(--accent-chores)' }}>
            📝 Chores, Groceries & Appointments
          </h1>
        </div>

        <button onClick={() => readAloud('Chores and Reminders section. View today tasks, shared family grocery list, and doctor appointments.')} className="btn btn-secondary">
          <Volume2 size={20} />
          <span>Read Page</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSubTab('today')}
          className={`btn ${activeSubTab === 'today' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backgroundColor: activeSubTab === 'today' ? 'var(--accent-chores)' : undefined }}
        >
          <Clock size={20} />
          <span>Today ({todayTasks.filter(t => !t.completed).length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('groceries')}
          className={`btn ${activeSubTab === 'groceries' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backgroundColor: activeSubTab === 'groceries' ? 'var(--accent-chores)' : undefined }}
        >
          <ShoppingBag size={20} />
          <span>Grocery List ({groceries.filter(g => !g.purchased).length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('chores')}
          className={`btn ${activeSubTab === 'chores' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backgroundColor: activeSubTab === 'chores' ? 'var(--accent-chores)' : undefined }}
        >
          <CheckSquare size={20} />
          <span>All Tasks</span>
        </button>
        <button
          onClick={() => setActiveSubTab('appointments')}
          className={`btn ${activeSubTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backgroundColor: activeSubTab === 'appointments' ? 'var(--accent-chores)' : undefined }}
        >
          <Calendar size={20} />
          <span>Doctor Appointments</span>
        </button>
      </div>

      {/* TAB 1: Combined Today View */}
      {activeSubTab === 'today' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 className="font-heading">Today's Combined Agenda</h2>
          {todayTasks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
              <CheckCircle size={48} color="var(--status-normal)" style={{ marginBottom: 12 }} />
              <h3>All clear for today!</h3>
              <p style={{ color: 'var(--text-muted)' }}>You have completed all scheduled daily chores and appointments.</p>
            </div>
          ) : (
            todayTasks.map(task => (
              <div
                key={task.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: task.completed ? 0.6 : 1,
                  borderLeft: task.category === 'appointment' ? '6px solid var(--accent-health)' : '6px solid var(--accent-chores)'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.category === 'appointment' ? '🩺 ' : '📌 '}
                    {task.title}
                  </div>
                  {task.dueTime && <div style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 600 }}>Due Time: {task.dueTime}</div>}
                  {task.notes && <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Note: {task.notes}</div>}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => toggleChoreCompleted(task.id)}
                    className={`btn ${task.completed ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ backgroundColor: !task.completed ? 'var(--status-normal)' : undefined }}
                  >
                    <CheckCircle size={22} />
                    <span>{task.completed ? 'Done' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Shared Grocery List with Voice Input */}
      {activeSubTab === 'groceries' && (
        <div>
          {/* Add Grocery Box */}
          <div className="card" style={{ backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary)' }}>
            <h3 className="font-heading" style={{ marginBottom: 12 }}>Add Grocery Item (Shared with Family)</h3>
            <form onSubmit={handleAddGrocery} style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Type or click microphone to speak (e.g. Almond milk)"
                value={newGroceryInput}
                onChange={e => setNewGroceryInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleVoiceListen}
                className="btn btn-secondary"
                style={{ backgroundColor: isListening ? 'var(--accent-emergency)' : undefined, color: isListening ? '#fff' : undefined }}
                title="Speak item name"
              >
                {isListening ? <MicOff size={22} /> : <Mic size={22} color="var(--primary)" />}
                <span>{isListening ? 'Listening...' : 'Voice'}</span>
              </button>
              <button type="submit" className="btn btn-primary">
                <Plus size={20} />
                <span>ADD</span>
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {groceries.map(g => (
              <div
                key={g.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  opacity: g.purchased ? 0.6 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="checkbox"
                    checked={g.purchased}
                    onChange={() => toggleGroceryPurchased(g.id)}
                    style={{ width: 24, height: 24, cursor: 'pointer' }}
                  />
                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, textDecoration: g.purchased ? 'line-through' : 'none' }}>
                      {g.name}
                    </span>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Quantity: {g.quantity} • Added by {g.addedBy}
                    </div>
                  </div>
                </div>

                <button onClick={() => deleteGroceryItem(g.id)} className="btn btn-secondary btn-icon">
                  <Trash2 size={20} color="var(--accent-emergency)" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3 & 4: Add / View Chores & Doctor Appointments */}
      {(activeSubTab === 'chores' || activeSubTab === 'appointments') && (
        <div>
          {/* Add Form Card */}
          <div className="card">
            <h3 className="font-heading" style={{ marginBottom: 16 }}>
              {activeSubTab === 'appointments' ? 'Schedule Doctor Appointment' : 'Add New Task / Chore'}
            </h3>
            <form onSubmit={handleChoreSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title / Doctor Visit *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={activeSubTab === 'appointments' ? 'e.g. Cardiologist Follow-up with Dr. Chen' : 'e.g. Water balcony plants'}
                  value={newChoreTitle}
                  onChange={e => setNewChoreTitle(e.target.value)}
                  required
                />
              </div>

              {activeSubTab === 'chores' && (
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newChoreCategory}
                    onChange={e => setNewChoreCategory(e.target.value as any)}
                  >
                    <option value="chore">General Chore</option>
                    <option value="reminder">Personal Reminder</option>
                    <option value="appointment">Doctor Appointment</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newChoreDate}
                    onChange={e => setNewChoreDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={newChoreTime}
                    onChange={e => setNewChoreTime(e.target.value)}
                  />
                </div>
              </div>

              {activeSubTab === 'appointments' && (
                <div className="form-group">
                  <label className="form-label">Doctor / Clinic Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dr. Robert Chen"
                    value={newDoctorName}
                    onChange={e => setNewDoctorName(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Notes / Reminders</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="e.g. Remember to bring medical reports and pill bottle"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--accent-chores)', width: '100%' }}>
                <Plus size={20} />
                <span>SAVE {activeSubTab === 'appointments' ? 'APPOINTMENT' : 'TASK'}</span>
              </button>
            </form>
          </div>

          {/* List of Tasks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
            {(activeSubTab === 'appointments' ? appointmentsList : chores).map(item => (
              <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{item.title}</h4>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                    📅 Date: {item.dueDate} {item.dueTime ? `at ${item.dueTime}` : ''}
                  </div>
                  {item.notes && <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>📝 {item.notes}</div>}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => toggleChoreCompleted(item.id)} className="btn btn-secondary">
                    {item.completed ? 'Done' : 'Mark Done'}
                  </button>
                  <button onClick={() => deleteChore(item.id)} className="btn btn-secondary btn-icon">
                    <Trash2 size={20} color="var(--accent-emergency)" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
