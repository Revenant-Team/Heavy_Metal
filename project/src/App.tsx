import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import MapPortal from './components/MapPortal';
import ResearchPortal from './components/ResearchPortal';

function App() {
  const [currentSection, setCurrentSection] = useState('home');

  const renderContent = () => {
    switch (currentSection) {
      case 'home':
        return <HomePage />;
      case 'map':
        return <MapPortal />;
      case 'research':
        return <ResearchPortal />;
      case 'analytics':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
              <p className="text-gray-600">Advanced analytics features coming soon...</p>
            </div>
          </div>
        );
      case 'documentation':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Documentation</h2>
              <p className="text-gray-600">Comprehensive guides and API documentation coming soon...</p>
            </div>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentSection={currentSection} onSectionChange={setCurrentSection} />
      {renderContent()}
    </div>
  );
}

export default App;