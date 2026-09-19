import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Heart,
  Thermometer,
  Plus,
  Sparkles,
  CalendarPlus,
  Mic,
  MicOff,
  ArrowLeft,
  Volume2,
  RefreshCw,
  TrendingUp,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';
import { StatType } from '../../types';
import { listenToVoiceInput } from '../../services/speechService';

export const HealthStatsSection: React.FC = () => {
  const {
    healthStats,
    aiSummary,
    logHealthStat,
    refreshAiSummary,
    bookDoctorFromHealth,
    setActiveTab,
    readAloud
  } = useApp();

  const [activeStatType, setActiveStatType] = useState<StatType>('bp');
  const [val1, setVal1] = useState<number>(128); // Systolic / Glucose / Temp
  const [val2, setVal2] = useState<number>(82); // Diastolic for BP
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    if (isListening) return;
    setIsListening(true);
    readAloud('Listening for health numbers. Speak clearly, like: 120 over 80 or sugar 95.');

    listenToVoiceInput(
      (transcript) => {
        setIsListening(false);
        const numbers = transcript.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          if (activeStatType === 'bp' && numbers.length >= 2) {
            setVal1(parseInt(numbers[0]));
            setVal2(parseInt(numbers[1]));
          } else {
            setVal1(parseInt(numbers[0]));
          }
          readAloud(`Recognized value ${numbers.join(' ')}`);
        } else {
          alert(`Could not extract numbers from: "${transcript}". Please enter manually.`);
        }
      },
      () => setIsListening(false),
      () => setIsListening(false)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await logHealthStat(activeStatType, val1, activeStatType === 'bp' ? val2 : undefined, note);
    setIsSubmitting(false);
    setNote('');
  };

  // Filter entries for history & chart
  const filteredStats = healthStats
    .filter(s => s.type === activeStatType)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Compute overall health status summary
  const abnormalCount = healthStats.filter(h => h.status === 'Abnormal').length;
  const borderlineCount = healthStats.filter(h => h.status === 'Borderline').length;

  let overallHealthStatus: 'Optimal' | 'Good' | 'Attention Needed' = 'Optimal';
  let overallHealthBadgeClass = 'badge-success';
  let overallHealthMessage = 'Your recent health stats look stable and within healthy target boundaries.';

  if (abnormalCount > 0) {
    overallHealthStatus = 'Attention Needed';
    overallHealthBadgeClass = 'badge-alert';
    overallHealthMessage = `Attention Needed: You have ${abnormalCount} abnormal reading logged. Consider sharing with your doctor.`;
  } else if (borderlineCount > 0) {
    overallHealthStatus = 'Good';
    overallHealthBadgeClass = 'badge-warning';
    overallHealthMessage = 'Good: Your readings are manageable with a few slightly elevated entries. Keep tracking daily.';
  }

  // Generate SVG Line Chart Coordinates
  const chartWidth = 600;
  const chartHeight = 180;
  const padding = 40;

  const getChartPoints = () => {
    if (filteredStats.length === 0) return { pointsStr: '', nodes: [] };

    const values = filteredStats.map(s => s.valueNumeric1);
    const minVal = Math.min(...values, activeStatType === 'bp' ? 90 : activeStatType === 'glucose' ? 60 : 96) - 5;
    const maxVal = Math.max(...values, activeStatType === 'bp' ? 160 : activeStatType === 'glucose' ? 140 : 102) + 5;

    const range = maxVal - minVal || 1;

    const nodes = filteredStats.map((item, idx) => {
      const x = padding + (idx / Math.max(1, filteredStats.length - 1)) * (chartWidth - 2 * padding);
      const y = chartHeight - padding - ((item.valueNumeric1 - minVal) / range) * (chartHeight - 2 * padding);
      return { x, y, val: item.valueNumeric1, val2: item.valueNumeric2, date: new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }), status: item.status };
    });

    const pointsStr = nodes.map(n => `${n.x},${n.y}`).join(' ');
    return { pointsStr, nodes };
  };

  const { pointsStr, nodes } = getChartPoints();

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setActiveTab('home')} className="btn btn-home">
            <ArrowLeft size={22} />
            <span>HOME</span>
          </button>
          <h1 className="font-heading" style={{ fontSize: 'var(--title-font-size)', color: 'var(--accent-health)' }}>
            ❤️ Health Summary & Trend Charts
          </h1>
        </div>

        <button onClick={() => readAloud('Health Stats page. View overall health status summary, line graphs, and log daily readings.')} className="btn btn-secondary">
          <Volume2 size={20} />
          <span>Read Page</span>
        </button>
      </div>

      {/* NEW: Overall Health Status Summary Card */}
      <div className="card" style={{ backgroundColor: 'var(--bg-card)', border: '2px solid var(--border-color)', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: '16px', backgroundColor: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-health)' }}>
              {overallHealthStatus === 'Attention Needed' ? <ShieldAlert size={30} color="var(--accent-emergency)" /> : <CheckCircle size={30} color="var(--status-normal)" />}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Overall Health Status Summary
              </div>
              <h2 className="font-heading" style={{ fontSize: '1.5rem' }}>
                How is Your Health Doing: <span className={`status-badge ${overallHealthBadgeClass}`}>{overallHealthStatus.toUpperCase()}</span>
              </h2>
            </div>
          </div>
        </div>
        <p style={{ marginTop: 12, fontSize: '1.05rem', color: 'var(--text-main)' }}>
          {overallHealthMessage}
        </p>
      </div>

      {/* Stat Type Toggle Buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => { setActiveStatType('bp'); setVal1(125); setVal2(82); }}
          className={`btn ${activeStatType === 'bp' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backgroundColor: activeStatType === 'bp' ? 'var(--accent-health)' : undefined }}
        >
          <Heart size={20} />
          <span>Blood Pressure</span>
        </button>
        <button
          onClick={() => { setActiveStatType('glucose'); setVal1(95); }}
          className={`btn ${activeStatType === 'glucose' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backgroundColor: activeStatType === 'glucose' ? 'var(--accent-health)' : undefined }}
        >
          <Activity size={20} />
          <span>Blood Sugar</span>
        </button>
        <button
          onClick={() => { setActiveStatType('temperature'); setVal1(98.4); }}
          className={`btn ${activeStatType === 'temperature' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ backgroundColor: activeStatType === 'temperature' ? 'var(--accent-health)' : undefined }}
        >
          <Thermometer size={20} />
          <span>Temperature</span>
        </button>
      </div>

      {/* NEW: Interactive Line Graph Depicting Health Stats Over Time */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={24} color="var(--accent-health)" />
            <h3 className="font-heading">
              {activeStatType.toUpperCase()} Health Trend Line Graph
            </h3>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Last 7 Recorded Readings</span>
        </div>

        {filteredStats.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No entries to chart yet. Log a reading below.</p>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg width="100%" height="200" viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ backgroundColor: 'var(--bg-card-hover)', borderRadius: '16px', padding: '10px' }}>
              {/* Reference Grid lines */}
              <line x1="40" y1="40" x2={chartWidth - 40} y2="40" stroke="#cbd5e1" strokeDasharray="4" />
              <line x1="40" y1="90" x2={chartWidth - 40} y2="90" stroke="#cbd5e1" strokeDasharray="4" />
              <line x1="40" y1="140" x2={chartWidth - 40} y2="140" stroke="#cbd5e1" strokeDasharray="4" />

              {/* Connecting Trend Line */}
              {pointsStr && (
                <polyline
                  fill="none"
                  stroke="var(--accent-health)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsStr}
                />
              )}

              {/* Data Node Dots */}
              {nodes.map((node, idx) => (
                <g key={idx}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="7"
                    fill={node.status === 'Normal' ? 'var(--status-normal)' : node.status === 'Borderline' ? 'var(--status-borderline)' : 'var(--accent-emergency)'}
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                  {/* Value Label */}
                  <text x={node.x} y={node.y - 12} textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--text-main)">
                    {node.val}{node.val2 ? `/${node.val2}` : ''}
                  </text>
                  {/* Date Label */}
                  <text x={node.x} y={chartHeight - 8} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--text-muted)">
                    {node.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>

      {/* GenAI Plain-Language Insight Card */}
      {aiSummary && (
        <div className="card" style={{ borderColor: 'var(--accent-chores)', backgroundColor: '#fdf4ff', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={26} color="var(--accent-chores)" />
              <h3 className="font-heading" style={{ color: 'var(--accent-chores)' }}>
                GenAI Plain-Language Summary ({aiSummary.generatedAt})
              </h3>
            </div>
            <button onClick={refreshAiSummary} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.85rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>
            {aiSummary.overallTrend}
          </div>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: 8 }}>
            {aiSummary.plainLanguageSummary}
          </p>

          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>
            💡 Suggestion: {aiSummary.recommendation}
          </div>

          {/* Cross link to Doctor Appointment if suggested */}
          {aiSummary.suggestDoctorVisit && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emergency)' }}>
                ⚠️ Concerning trend detected in recent readings.
              </span>
              <button
                onClick={() => bookDoctorFromHealth('Dr. Robert Chen', 'Follow-up on recent health stat trend')}
                className="btn btn-primary"
                style={{ backgroundColor: 'var(--accent-health)', padding: '8px 16px', fontSize: '0.95rem' }}
              >
                <CalendarPlus size={18} />
                <span>BOOK DOCTOR APPOINTMENT</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Logging Form Card */}
      <div className="card">
        <h3 className="font-heading" style={{ marginBottom: 16 }}>
          Log New {activeStatType === 'bp' ? 'Blood Pressure' : activeStatType === 'glucose' ? 'Blood Sugar' : 'Body Temperature'} Reading
        </h3>

        <form onSubmit={handleSubmit}>
          {activeStatType === 'bp' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Systolic (Top number) mmHg</label>
                <input
                  type="number"
                  className="form-input"
                  value={val1}
                  onChange={e => setVal1(Number(e.target.value))}
                  min={60}
                  max={250}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Diastolic (Bottom number) mmHg</label>
                <input
                  type="number"
                  className="form-input"
                  value={val2}
                  onChange={e => setVal2(Number(e.target.value))}
                  min={40}
                  max={150}
                  required
                />
              </div>
            </div>
          ) : activeStatType === 'glucose' ? (
            <div className="form-group">
              <label className="form-label">Fasting Blood Sugar (mg/dL)</label>
              <input
                type="number"
                className="form-input"
                value={val1}
                onChange={e => setVal1(Number(e.target.value))}
                min={30}
                max={400}
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Body Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={val1}
                onChange={e => setVal1(Number(e.target.value))}
                min={90}
                max={108}
                required
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <button
              type="button"
              onClick={handleVoiceInput}
              className="btn btn-secondary"
              style={{ flex: 1, backgroundColor: isListening ? 'var(--accent-emergency)' : undefined, color: isListening ? '#fff' : undefined }}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} color="var(--primary)" />}
              <span>{isListening ? 'Listening...' : 'Voice Entry'}</span>
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Note (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Measured after morning walk"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ backgroundColor: 'var(--accent-health)', width: '100%' }}
            disabled={isSubmitting}
          >
            <Plus size={20} />
            <span>SAVE READING</span>
          </button>
        </form>
      </div>

      {/* History Log */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 className="font-heading">Reading History ({activeStatType.toUpperCase()})</h3>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Deterministic Rule Evaluation</span>
        </div>

        {filteredStats.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No readings recorded for this metric yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredStats.map(entry => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  border: '2px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                    {entry.valueNumeric1}
                    {entry.valueNumeric2 ? ` / ${entry.valueNumeric2}` : ''} {entry.unit}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Logged on {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.9rem', marginTop: 4 }}>
                    {entry.statusReason}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span
                    className={`status-badge ${
                      entry.status === 'Normal' ? 'badge-success' : entry.status === 'Borderline' ? 'badge-warning' : 'badge-alert'
                    }`}
                  >
                    {entry.status.toUpperCase()}
                  </span>

                  {entry.status === 'Abnormal' && (
                    <button
                      onClick={() => bookDoctorFromHealth('Dr. Robert Chen', `Abnormal ${entry.type} reading of ${entry.valueNumeric1}`)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.8rem', color: 'var(--accent-emergency)' }}
                    >
                      + Doctor Appt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
