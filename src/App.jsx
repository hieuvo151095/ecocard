import React, { useState } from 'react';
import { PortalProvider } from './context/PortalContext.jsx';
import Header from './components/layout/Header.jsx';
import SubNav from './components/layout/SubNav.jsx';
import SM1ConfigList from './pages/SM1ConfigList.jsx';
import SM2SessionList from './pages/SM2SessionList.jsx';
import SM2SessionDetail from './pages/SM2SessionDetail.jsx';

export function AppContent() {
  const [activeSubModule, setActiveSubModule] = useState('CONFIG'); // 'CONFIG' | 'SESSIONS'
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const handleSelectSubModule = (subModule) => {
    setActiveSubModule(subModule);
    setSelectedSessionId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F6]">
      {/* 1. Global Navigation Header */}
      <Header
        activeSubModule={activeSubModule}
        onSelectSubModule={handleSelectSubModule}
      />

      {/* 2. Secondary Navigation SubNav & Breadcrumbs */}
      <SubNav
        activeSubModule={activeSubModule}
        onSelectSubModule={handleSelectSubModule}
      />

      {/* 3. Main Workspace Surface */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-6">
        {activeSubModule === 'CONFIG' && <SM1ConfigList />}

        {activeSubModule === 'SESSIONS' && (
          selectedSessionId ? (
            <SM2SessionDetail
              sessionId={selectedSessionId}
              onBack={() => setSelectedSessionId(null)}
            />
          ) : (
            <SM2SessionList
              onSelectSession={(sessionId) => setSelectedSessionId(sessionId)}
            />
          )
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <PortalProvider>
      <AppContent />
    </PortalProvider>
  );
}
