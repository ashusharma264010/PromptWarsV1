import React from 'react';
import { useApp } from '../context/AppContext';
import FamCareLogo from './FamCareLogo';
import {
  Home,
  Volume2,
  VolumeX,
  Eye,
  Type,
  User,
  Settings,
  Users
} from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenLoginModal: () => void;
}

/**
 * App-wide sticky header.
 *
 * Design principles applied:
 *  • Logo top-left, always visible (brand anchor)
 *  • Accessibility controls always reachable (right-side bar)
 *  • All interactive elements ≥ 48px touch-target (WCAG 2.5.5)
 *  • Semantic <header> + role="banner" for assistive tech
 *  • Skip-to-content support via first-child focus order
 */
export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenLoginModal }) => {
  const {
    currentUser,
    isLoggedIn,
    isCaregiverMode,
    activeTab,
    setActiveTab,
    accessibility,
    updateAccessibility,
    readAloud,
    switchProfile,
  } = useApp();

  /* ── Handlers ──────────────────────────────────────────────────── */
  const handleFontToggle = () => {
    if (accessibility.fontScale === 'standard') updateAccessibility({ fontScale: 'large' });
    else if (accessibility.fontScale === 'large') updateAccessibility({ fontScale: 'extra-large' });
    else updateAccessibility({ fontScale: 'standard' });
  };

  const handleContrastToggle = () => {
    updateAccessibility({ highContrast: !accessibility.highContrast });
  };

  const handleSpeakToggle = () => {
    const next = !accessibility.speakEnabled;
    updateAccessibility({ speakEnabled: next });
    if (next) {
      // Provide immediate confirmation only when turning ON
      readAloud('Voice narration is now on.');
    } else {
      // Cancel any in-flight speech
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  const handleReadScreen = () => {
    if (!accessibility.speakEnabled) return;
    let text = `You are on the ${activeTab} page of FamCare. `;
    if (activeTab === 'home') {
      text += 'Your dashboard has 6 tiles: Medicines, Chores, Insurance, Health Stats, Emergency Info, and Family.';
    }
    readAloud(text);
  };

  const speakOn = accessibility.speakEnabled ?? true;

  /* ── Render ────────────────────────────────────────────────────── */
  return (
    <header className="app-header" role="banner">
      {/* ── Brand / Logo area (top-left) ──────────────────────────── */}
      <div className="header-brand">
        {/* Clicking the logo always returns user to the home dashboard */}
        <button
          onClick={() => setActiveTab('home')}
          className="header-logo-btn"
          aria-label="FamCare – Go to home dashboard"
          title="Home Dashboard"
        >
          <FamCareLogo
            size={52}
            showWordmark={true}
            ariaLabel="FamCare logo"
          />
        </button>

        <button
          onClick={() => setActiveTab('home')}
          className="btn btn-home"
          style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
          aria-label="Go to Home Dashboard"
        >
          <Home size={24} />
          <span>HOME</span>
        </button>
      </div>

      {/* ── Accessibility &amp; User controls (top-right) ─────────── */}
      <div className="header-controls" role="toolbar" aria-label="Accessibility and user controls">

        {/* Speak Toggle */}
        <button
          id="btn-speak-toggle"
          onClick={handleSpeakToggle}
          className="btn btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.95rem' }}
          title={speakOn ? 'Turn off voice narration' : 'Turn on voice narration'}
          aria-label={speakOn ? 'Voice narration ON – click to turn off' : 'Voice narration OFF – click to turn on'}
          aria-pressed={speakOn}
        >
          {speakOn ? <Volume2 size={20} color="var(--primary)" /> : <VolumeX size={20} />}
          <span className="hide-mobile">{speakOn ? 'Voice: ON' : 'Voice: OFF'}</span>
        </button>

        {/* Read current screen aloud */}
        <button
          id="btn-read-aloud"
          onClick={handleReadScreen}
          className="btn btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.95rem', opacity: speakOn ? 1 : 0.45 }}
          title="Read this screen out loud"
          aria-label="Read this screen out loud"
          disabled={!speakOn}
        >
          <Volume2 size={20} />
          <span className="hide-mobile">Read Aloud</span>
        </button>

        {/* Font Scale Cycle */}
        <button
          id="btn-font-size"
          onClick={handleFontToggle}
          className="btn btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.95rem' }}
          title="Cycle text size: Standard → Large → Extra-Large"
          aria-label={`Text size: ${accessibility.fontScale}. Click to change.`}
        >
          <Type size={20} />
          <span className="hide-mobile">Size: {accessibility.fontScale.toUpperCase().replace('-', '‑')}</span>
        </button>

        {/* High Contrast Toggle */}
        <button
          id="btn-contrast"
          onClick={handleContrastToggle}
          className="btn btn-secondary"
          style={{
            padding: '8px 14px',
            fontSize: '0.95rem',
            backgroundColor: accessibility.highContrast ? '#facc15' : undefined,
            color: accessibility.highContrast ? '#000' : undefined,
          }}
          title="Toggle High Contrast Mode"
          aria-label={accessibility.highContrast ? 'High contrast ON – click to turn off' : 'High contrast OFF – click to turn on'}
          aria-pressed={accessibility.highContrast}
        >
          <Eye size={20} />
          <span className="hide-mobile">{accessibility.highContrast ? 'Contrast ON' : 'Contrast'}</span>
        </button>

        {/* User / Caregiver Actions */}
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              id="btn-switch-profile"
              onClick={() => switchProfile(currentUser.role === 'senior' ? 'family' : 'senior')}
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.9rem', border: '2px solid var(--primary)' }}
              title="Switch between Senior and Caregiver view"
              aria-label={`Currently in ${isCaregiverMode ? 'Caregiver' : 'Senior'} view. Click to switch.`}
            >
              <Users size={18} />
              <span>{isCaregiverMode ? 'Caregiver View' : 'Senior View'}</span>
            </button>

            <button
              id="btn-settings"
              onClick={onOpenSettings}
              className="btn btn-secondary btn-icon"
              title="Account & Settings"
              aria-label="Open account settings"
            >
              <Settings size={22} />
            </button>
          </div>
        ) : (
          <button
            id="btn-login"
            onClick={onOpenLoginModal}
            className="btn btn-primary"
            style={{ padding: '8px 16px' }}
            aria-label="Login with PIN"
          >
            <User size={20} />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
};
