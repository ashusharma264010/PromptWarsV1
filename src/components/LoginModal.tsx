import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Shield, KeyRound, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithPin, switchProfile } = useApp();
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + num;
      setPinInput(nextPin);
      setErrorMessage('');
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMessage('');
  };

  const verifyPin = (pin: string) => {
    const success = loginWithPin(pin);
    if (success) {
      setPinInput('');
      onClose();
    } else {
      setErrorMessage('Incorrect PIN. Try PIN 1234 (Senior) or 5678 (Caregiver).');
      setPinInput('');
    }
  };

  const handleQuickLogin = (role: 'senior' | 'family') => {
    switchProfile(role);
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-labelledby="login-title" aria-modal="true">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <div style={{ margin: '0 auto 16px auto', width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <KeyRound size={36} color="var(--primary)" />
        </div>

        <h2 id="login-title" className="font-heading" style={{ fontSize: '1.8rem', marginBottom: 8 }}>
          Enter Security PIN
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          Please enter your 4-digit numeric passcode to access your account.
        </p>

        {/* PIN Dots Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '3px solid var(--primary)',
                backgroundColor: pinInput.length > idx ? 'var(--primary)' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            />
          ))}
        </div>

        {errorMessage && (
          <div className="badge-alert" style={{ margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}>
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Numeric Keypad Grid */}
        <div className="pin-grid">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map(item => {
            if (item === 'C') {
              return (
                <button key={item} onClick={() => setPinInput('')} className="pin-key" style={{ color: 'var(--accent-emergency)' }}>
                  C
                </button>
              );
            }
            if (item === '⌫') {
              return (
                <button key={item} onClick={handleBackspace} className="pin-key">
                  ⌫
                </button>
              );
            }
            return (
              <button key={item} onClick={() => handleKeyPress(item)} className="pin-key">
                {item}
              </button>
            );
          })}
        </div>

        {/* Quick Demo Access Buttons */}
        <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: 20, marginTop: 20 }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 12, fontWeight: 700 }}>
            Quick Demo Login Options:
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleQuickLogin('senior')}
              className="btn btn-secondary"
              style={{ padding: '10px 16px', fontSize: '0.95rem', border: '2px solid var(--accent-medicine)' }}
            >
              <UserCheck size={18} color="var(--accent-medicine)" />
              <span>Login as Senior (Margaret - PIN 1234)</span>
            </button>
            <button
              onClick={() => handleQuickLogin('family')}
              className="btn btn-secondary"
              style={{ padding: '10px 16px', fontSize: '0.95rem', border: '2px solid var(--accent-family)' }}
            >
              <Shield size={18} color="var(--accent-family)" />
              <span>Login as Caregiver (David - PIN 5678)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
