import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ChevronDown, Filter, Share, Download, BarChart3 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RegionData } from '../types';

// Custom marker icons (so markers display correctly with React-Leaflet + Webpack/Vite)
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapPortal: React.FC = () => {
  const [selectedState, setSelectedState] = useState('All States');
  const [riskLevel, setRiskLevel] = useState('All Levels');
  const [metalType, setMetalType] = useState('All Metals');

  // Mock Indian states data with HMPI values
  const regionData: RegionData[] = [
    { name: 'Punjab', hmpiScore: 387.2, riskLevel: 'Critical', coordinates: [30.9010, 75.8573] },
    { name: 'Haryana', hmpiScore: 245.6, riskLevel: 'High', coordinates: [29.0588, 76.0856] },
    { name: 'Rajasthan', hmpiScore: 189.3, riskLevel: 'Moderate', coordinates: [27.0238, 74.2179] },
    { name: 'Gujarat', hmpiScore: 156.7, riskLevel: 'Moderate', coordinates: [22.2587, 71.1924] },
    { name: 'Maharashtra', hmpiScore: 134.2, riskLevel: 'Moderate', coordinates: [19.7515, 75.7139] },
    { name: 'Uttar Pradesh', hmpiScore: 198.4, riskLevel: 'Moderate', coordinates: [26.8467, 80.9462] },
    { name: 'West Bengal', hmpiScore: 223.1, riskLevel: 'High', coordinates: [22.9868, 87.8550] },
    { name: 'Bihar', hmpiScore: 167.8, riskLevel: 'Moderate', coordinates: [25.0961, 85.3131] },
    { name: 'Odisha', hmpiScore: 145.6, riskLevel: 'Moderate', coordinates: [20.9517, 85.0985] },
    { name: 'Jharkhand', hmpiScore: 267.4, riskLevel: 'High', coordinates: [23.6102, 85.2799] },
    { name: 'Chhattisgarh', hmpiScore: 198.9, riskLevel: 'Moderate', coordinates: [21.2787, 81.8661] },
    { name: 'Madhya Pradesh', hmpiScore: 176.3, riskLevel: 'Moderate', coordinates: [22.9734, 78.6569] },
    { name: 'Andhra Pradesh', hmpiScore: 154.7, riskLevel: 'Moderate', coordinates: [15.9129, 79.7400] },
    { name: 'Telangana', hmpiScore: 143.2, riskLevel: 'Moderate', coordinates: [18.1124, 79.0193] },
    { name: 'Karnataka', hmpiScore: 128.9, riskLevel: 'Moderate', coordinates: [15.3173, 75.7139] },
    { name: 'Tamil Nadu', hmpiScore: 167.5, riskLevel: 'Moderate', coordinates: [11.1271, 78.6569] },
    { name: 'Kerala', hmpiScore: 89.4, riskLevel: 'Low', coordinates: [10.8505, 76.2711] },
    { name: 'Assam', hmpiScore: 145.8, riskLevel: 'Moderate', coordinates: [26.2006, 92.9376] },
    { name: 'Himachal Pradesh', hmpiScore: 76.3, riskLevel: 'Low', coordinates: [31.1048, 77.1734] },
    { name: 'Uttarakhand', hmpiScore: 98.7, riskLevel: 'Low', coordinates: [30.0668, 79.0193] }
  ];

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return '#22c55e';
      case 'Moderate': return '#f59e0b';
      case 'High': return '#ef4444';
      case 'Critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const totalRegions = regionData.length;
  const avgHMPI = (regionData.reduce((sum, region) => sum + region.hmpiScore, 0) / totalRegions).toFixed(1);
  const highestRiskRegion = regionData.reduce((max, region) => region.hmpiScore > max.hmpiScore ? region : max);

  const riskCounts = regionData.reduce((acc, region) => {
    acc[region.riskLevel] = (acc[region.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sidebarItems = [
    { id: 'current', label: 'Current Portal', sublabel: 'Public Map Portal', icon: '🗺️', active: true },
    { id: 'interactive', label: 'Interactive Map', icon: '🌐' },
    { id: 'filters', label: 'Map Filters', icon: '🔍' },
    { id: 'analytics', label: 'Region Analytics', icon: '📊' },
    { id: 'export', label: 'Export Reports', icon: '📄' },
    { id: 'guide', label: 'HMPI Guide', icon: '❓' }
  ];

  const quickAccessItems = [
    { label: 'Saved Regions', icon: '⭐' },
    { label: 'Recent Searches', icon: '🕒' },
    { label: 'Shared Reports', icon: '🔗' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="mb-8">
            {sidebarItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center space-x-3 p-3 rounded-lg mb-2 cursor-pointer ${
                  item.active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <div>
                  <div className="font-medium">{item.label}</div>
                  {item.sublabel && <div className="text-xs text-gray-500">{item.sublabel}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Access</h3>
            {quickAccessItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer mb-1">
                <span>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Controls Header */}
        <div className="bg-white p-4 shadow-sm border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <span>📍</span>
                  <span className="font-medium">{selectedState}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <span>🔴</span>
                  <span className="font-medium">{riskLevel}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <span>🧪</span>
                  <span className="font-medium">{metalType}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                <span>Advanced</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900">
                <Share className="w-4 h-4" />
                <span>Share Map</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Map Container */}
          <div className="flex-1 relative">
            {/* Risk Level Legend */}
            <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold mb-3">HMPI Risk Levels</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
                  <span className="text-sm">Low (&lt; 100)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
                  <span className="text-sm">Moderate (100-200)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                  <span className="text-sm">High (200-300)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
                  <span className="text-sm">Critical (&gt; 300)</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              className="h-full w-full"
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Region Markers */}
              {regionData.map((region) => (
                <Marker
                  key={region.name}
                  position={region.coordinates}
                  icon={defaultIcon}
                >
                  <Popup>
                    <div>
                      <strong>{region.name}</strong> <br />
                      HMPI: {region.hmpiScore} <br />
                      Risk: <span style={{ color: getRiskColor(region.riskLevel) }}>
                        {region.riskLevel}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Right Panel */}
          <div className="w-80 bg-white border-l">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Region Summary</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalRegions.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Regions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{avgHMPI}</div>
                  <div className="text-sm text-gray-600">Avg HMPI</div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <div className="text-sm font-semibold text-red-800">Highest Risk Region</div>
                <div className="text-lg font-bold text-red-600">{highestRiskRegion.name}</div>
                <div className="text-sm text-red-600">HMPI: {highestRiskRegion.hmpiScore}</div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold mb-4">HMPI Trends</h3>
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center h-32">
                  <BarChart3 className="w-12 h-12 text-gray-400" />
                  <span className="ml-2 text-gray-500">Trend chart visualization</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold mb-4">Active Filters</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" checked className="mr-2" readOnly />
                    <span className="text-sm">Show all regions</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Risk Levels</h3>
                <div className="space-y-3">
                  {Object.entries(riskCounts).map(([level, count]) => (
                    <div key={level} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked className="rounded" readOnly />
                        <span className="text-sm">{level} Risk</span>
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPortal;
