import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Pill,
  CheckSquare,
  ShieldCheck,
  Activity,
  PhoneCall,
  Users,
  AlertTriangle,
  Clock,
  ChevronRight,
  Bell,
  CheckCircle2
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    currentUser,
    isCaregiverMode,
    setActiveTab,
    dueMedicinesCount,
    lowStockCount,
    dueChoresCount,
    upcomingRenewalsCount,
    abnormalHealthCount,
    notifications,
    readAloud
  } = useApp();

  const [notificationFilter, setNotificationFilter] = useState<'all' | 'today' | 'this_week'>('all');

  const filteredNotifs = notifications.filter(n => {
    if (notificationFilter === 'today') return n.timeframe === 'today';
    if (notificationFilter === 'this_week') return n.timeframe === 'this_week';
    return true;
  });

  const handleTileClick = (tab: any, label: string) => {
    setActiveTab(tab);
    readAloud(`Opening ${label}`);
  };

  return (
    <div>
      {/* Top Welcome / Caregiver Context Banner */}
      {isCaregiverMode ? (
        <div className="caregiver-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={24} />
            <span>
              Managing Account for: <strong>{currentUser.linkedFamilyName || 'Margaret Evans'}</strong>
            </span>
          </div>
          <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Full Access Enabled</span>
        </div>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <h1 className="font-heading" style={{ fontSize: 'var(--hero-font-size)', marginBottom: 4 }}>
            Good Day, {currentUser.name.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem' }}>
            Here is your daily companion overview & important agenda highlights.
          </p>
        </div>
      )}

      {/* NEW: Prominent Daily & Weekly Important Notifications Card */}
      <div className="card" style={{ borderColor: 'var(--primary)', backgroundColor: 'var(--bg-card)', marginBottom: 24, boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '16px', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Bell size={28} />
            </div>
            <div>
              <h2 className="font-heading" style={{ fontSize: '1.4rem' }}>
                🔔 Important Action Highlights
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                Things you need to complete today & this week
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setNotificationFilter('all')}
              className={`btn ${notificationFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.9rem' }}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setNotificationFilter('today')}
              className={`btn ${notificationFilter === 'today' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.9rem' }}
            >
              Today
            </button>
            <button
              onClick={() => setNotificationFilter('this_week')}
              className={`btn ${notificationFilter === 'this_week' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '0.9rem' }}
            >
              This Week
            </button>
          </div>
        </div>

        {filteredNotifs.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--status-normal)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <CheckCircle2 size={24} />
            <span>All scheduled items for this period are up to date!</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredNotifs.map(notif => (
              <div
                key={notif.id}
                onClick={() => notif.actionTab && setActiveTab(notif.actionTab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  borderRadius: '16px',
                  border: '2px solid var(--border-color)',
                  backgroundColor: notif.urgency === 'high' ? '#fff5f5' : 'var(--bg-card-hover)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {notif.urgency === 'high' ? (
                    <AlertTriangle size={22} color="var(--accent-emergency)" />
                  ) : (
                    <Clock size={22} color="var(--primary)" />
                  )}
                  <div>
                    <strong style={{ fontSize: '1.1rem', color: notif.urgency === 'high' ? 'var(--accent-emergency)' : 'var(--text-main)' }}>
                      {notif.title}
                    </strong>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {notif.description}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`status-badge ${notif.urgency === 'high' ? 'badge-alert' : 'badge-info'}`}>
                    {notif.timeframe === 'today' ? 'TODAY' : 'THIS WEEK'}
                  </span>
                  <ChevronRight size={20} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6 Large High-Contrast Tiles Grid */}
      <div className="tile-grid">
        {/* 1. Medicines Tile */}
        <div
          className="dash-tile"
          onClick={() => handleTileClick('medicines', 'Medicines')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleTileClick('medicines', 'Medicines')}
          aria-label="Medicines Tile"
        >
          <div>
            <div className="tile-icon-wrapper" style={{ backgroundColor: '#ccfbf1', color: 'var(--accent-medicine)' }}>
              <Pill size={36} />
            </div>
            <div className="tile-title">Medicines</div>
            <div className="tile-subtitle">Schedule, custom intervals & time reminders</div>
          </div>

          <div>
            {lowStockCount > 0 && (
              <div className="status-badge badge-alert" style={{ marginRight: 8 }}>
                <AlertTriangle size={16} />
                <span>{lowStockCount} Low Stock</span>
              </div>
            )}
            <div className="status-badge badge-info">
              <Clock size={16} />
              <span>{dueMedicinesCount} Active Meds</span>
            </div>
          </div>
        </div>

        {/* 2. Chores & Reminders Tile */}
        <div
          className="dash-tile"
          onClick={() => handleTileClick('chores', 'Chores and Reminders')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleTileClick('chores', 'Chores and Reminders')}
          aria-label="Chores and Reminders Tile"
        >
          <div>
            <div className="tile-icon-wrapper" style={{ backgroundColor: '#f3e8ff', color: 'var(--accent-chores)' }}>
              <CheckSquare size={36} />
            </div>
            <div className="tile-title">Chores & Reminders</div>
            <div className="tile-subtitle">Tasks, grocery list & doctor appointments</div>
          </div>

          <div>
            <div className={`status-badge ${dueChoresCount > 0 ? 'badge-warning' : 'badge-success'}`}>
              <CheckSquare size={16} />
              <span>{dueChoresCount > 0 ? `${dueChoresCount} Tasks Due` : 'All Done Today'}</span>
            </div>
          </div>
        </div>

        {/* 3. Insurance Vault Tile */}
        <div
          className="dash-tile"
          onClick={() => handleTileClick('insurance', 'Insurance Vault')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleTileClick('insurance', 'Insurance Vault')}
          aria-label="Insurance Vault Tile"
        >
          <div>
            <div className="tile-icon-wrapper" style={{ backgroundColor: '#dbeafe', color: 'var(--accent-insurance)' }}>
              <ShieldCheck size={36} />
            </div>
            <div className="tile-title">Insurance Vault</div>
            <div className="tile-subtitle">Segregated Health, Motor & Term policy vault</div>
          </div>

          <div>
            {upcomingRenewalsCount > 0 ? (
              <div className="status-badge badge-warning">
                <Clock size={16} />
                <span>{upcomingRenewalsCount} Renewal Due Soon</span>
              </div>
            ) : (
              <div className="status-badge badge-success">
                <span>Policies Active</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Health Stats Tile */}
        <div
          className="dash-tile"
          onClick={() => handleTileClick('health', 'Health Stats')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleTileClick('health', 'Health Stats')}
          aria-label="Health Stats Tile"
        >
          <div>
            <div className="tile-icon-wrapper" style={{ backgroundColor: '#ffe4e6', color: 'var(--accent-health)' }}>
              <Activity size={36} />
            </div>
            <div className="tile-title">Health Stats</div>
            <div className="tile-subtitle">Visual trend graph, health summary & logging</div>
          </div>

          <div>
            {abnormalHealthCount > 0 ? (
              <div className="status-badge badge-alert">
                <AlertTriangle size={16} />
                <span>{abnormalHealthCount} Reading Alert</span>
              </div>
            ) : (
              <div className="status-badge badge-info">
                <Activity size={16} />
                <span>Log Today's BP</span>
              </div>
            )}
          </div>
        </div>

        {/* 5. Emergency Info Tile */}
        <div
          className="dash-tile"
          onClick={() => handleTileClick('emergency', 'Emergency Info')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleTileClick('emergency', 'Emergency Info')}
          style={{ borderColor: 'var(--accent-emergency)' }}
          aria-label="Emergency Info Tile"
        >
          <div>
            <div className="tile-icon-wrapper" style={{ backgroundColor: '#fee2e2', color: 'var(--accent-emergency)' }}>
              <PhoneCall size={36} />
            </div>
            <div className="tile-title" style={{ color: 'var(--accent-emergency)' }}>
              Emergency Info
            </div>
            <div className="tile-subtitle">Instant speed dial & editable emergency contact info</div>
          </div>

          <div>
            <div className="status-badge badge-alert" style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none' }}>
              <span>Fast Emergency Access</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>

        {/* 6. Family Group Tile */}
        <div
          className="dash-tile"
          onClick={() => handleTileClick('family', 'Family Group')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleTileClick('family', 'Family Group')}
          aria-label="Family Group Tile"
        >
          <div>
            <div className="tile-icon-wrapper" style={{ backgroundColor: '#d1fae5', color: 'var(--accent-family)' }}>
              <Users size={36} />
            </div>
            <div className="tile-title">Family Care</div>
            <div className="tile-subtitle">Add relatives, managed caregiver access & settings</div>
          </div>

          <div>
            <div className="status-badge badge-success">
              <Users size={16} />
              <span>{currentUser.familyMembersList?.length || 2} Family Members</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
