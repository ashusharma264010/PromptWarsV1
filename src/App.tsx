import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { SettingsModal } from './components/Settings/SettingsModal';
import { Dashboard } from './components/Dashboard';
import { MedicineSection } from './components/Medicines/MedicineSection';
import { ChoresSection } from './components/Chores/ChoresSection';
import { InsuranceSection } from './components/Insurance/InsuranceSection';
import { HealthStatsSection } from './components/HealthStats/HealthStatsSection';
import { EmergencySection } from './components/Emergency/EmergencySection';
import { FamilySection } from './components/Family/FamilySection';

const MainContent: React.FC = () => {
  const { activeTab, accessibility, isLoggedIn } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Apply Font Scaling & High Contrast classes to document body
  useEffect(() => {
    document.body.classList.remove('font-large', 'font-extra-large', 'high-contrast');
    if (accessibility.fontScale === 'large') document.body.classList.add('font-large');
    if (accessibility.fontScale === 'extra-large') document.body.classList.add('font-extra-large');
    if (accessibility.highContrast) document.body.classList.add('high-contrast');
  }, [accessibility]);

  return (
    <div>
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLoginModal={() => setIsLoginOpen(true)}
      />

      <main className="app-container">
        {!isLoggedIn ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <h2 className="font-heading" style={{ fontSize: '2rem', marginBottom: 12 }}>
              Welcome to Senior Companion
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '1.2rem' }}>
              Your secure GenAI daily life assistant for medicines, chores, insurance, and health stats.
            </p>
            <button onClick={() => setIsLoginOpen(true)} className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.2rem' }}>
              LOGIN WITH PIN
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'home' && <Dashboard />}
            {activeTab === 'medicines' && <MedicineSection />}
            {activeTab === 'chores' && <ChoresSection />}
            {activeTab === 'insurance' && <InsuranceSection />}
            {activeTab === 'health' && <HealthStatsSection />}
            {activeTab === 'emergency' && <EmergencySection />}
            {activeTab === 'family' && <FamilySection />}
          </>
        )}
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
