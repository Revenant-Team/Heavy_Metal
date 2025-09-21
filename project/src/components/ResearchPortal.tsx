import React, { useState } from 'react';
import { Upload, Download, Plus, Settings, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { HMPIData, ContaminationSource, TrendData } from '../types';

const ResearchPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [formData, setFormData] = useState<Partial<HMPIData>>({
    sampleId: '',
    location: '',
    latitude: 0,
    longitude: 0,
    lead: 0,
    chromium: 0,
    arsenic: 0
  });

  const [hmpiResult, setHmpiResult] = useState<number | null>(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'datasets', label: 'Datasets' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'reports', label: 'Reports' }
  ];

  const trendData: TrendData[] = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 48 },
    { month: 'Apr', value: 58 },
    { month: 'May', value: 55 },
    { month: 'Jun', value: 68 }
  ];

  const contaminationSources: ContaminationSource[] = [
    {
      type: 'Industrial Effluent',
      confidence: 87,
      description: 'High chromium and lead levels detected near industrial zones. Immediate intervention recommended.',
      icon: '🏭'
    },
    {
      type: 'Agricultural Runoff',
      confidence: 72,
      description: 'Elevated nitrate and phosphate levels suggest fertilizer contamination patterns.',
      icon: '🚜'
    },
    {
      type: 'Mining Activity',
      confidence: 65,
      description: 'Copper and arsenic concentrations align with mining operation proximity.',
      icon: '⛏️'
    }
  ];

  const recentAnalyses = [
    { id: 1, title: 'Industrial Site Analysis', location: 'Chennai Region', samples: 45, status: 'High Risk', time: '2 hours ago', type: 'industrial' },
    { id: 2, title: 'Agricultural Area Study', location: 'Punjab Region', samples: 28, status: 'Safe', time: '1 day ago', type: 'agricultural' },
    { id: 3, title: 'Mining District Survey', location: 'Jharkhand Region', samples: 62, status: 'Moderate', time: '3 days ago', type: 'mining' }
  ];

  const calculateHMPI = () => {
    if (!formData.lead || !formData.chromium || !formData.arsenic) return;
    
    // Simplified HMPI calculation (actual formula would be more complex)
    const leadWeight = 0.3;
    const chromiumWeight = 0.4;
    const arsenicWeight = 0.3;
    
    const result = (formData.lead * leadWeight + formData.chromium * chromiumWeight + formData.arsenic * arsenicWeight) * 100;
    setHmpiResult(Number(result.toFixed(1)));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'High Risk': return 'text-red-600 bg-red-100';
      case 'Safe': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'industrial': return '🏭';
      case 'agricultural': return '🌾';
      case 'mining': return '⛏️';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Research Dashboard</h1>
              <p className="text-gray-600">Analyze groundwater contamination patterns and calculate HMPI indices</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                <span>New Analysis</span>
              </button>
            </div>
          </div>
          
          <div className="border-t">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Data Entry */}
          <div className="lg:col-span-1">
            {/* Data Upload */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Data Upload</h2>
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drop your CSV or Excel files here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Choose Files
                </button>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Supports CSV, XLSX formats
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Auto-validation & error checking
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Batch processing available
                </div>
              </div>
            </div>

            {/* Manual Data Entry */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Manual Data Entry</h2>
                <Settings className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sample ID</label>
                    <input
                      type="text"
                      placeholder="e.g. GW-001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.sampleId}
                      onChange={(e) => setFormData({...formData, sampleId: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="13.0827"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="80.2707"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead (mg/L)</label>
                    <input
                      type="number"
                      step="0.001"
                      placeholder="0.05"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.lead}
                      onChange={(e) => setFormData({...formData, lead: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chromium (mg/L)</label>
                    <input
                      type="number"
                      step="0.001"
                      placeholder="0.02"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.chromium}
                      onChange={(e) => setFormData({...formData, chromium: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Arsenic (mg/L)</label>
                    <input
                      type="number"
                      step="0.001"
                      placeholder="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.arsenic}
                      onChange={(e) => setFormData({...formData, arsenic: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <button
                  onClick={calculateHMPI}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  🧮 Calculate HMPI
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Analysis Results */}
          <div className="lg:col-span-2">
            {/* HMPI Trend Analysis */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">HMPI Trend Analysis</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">6M</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">1Y</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">All</button>
                </div>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-12 h-12 text-gray-400" />
                <span className="ml-2 text-gray-500">Trend visualization would appear here</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* AI Contamination Sources */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">AI Contamination Sources</h2>
                  <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                    <span className="text-purple-600 text-sm">🤖</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {contaminationSources.map((source, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{source.icon}</span>
                          <span className="font-medium text-gray-900">{source.type}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">{source.confidence}% confidence</span>
                      </div>
                      <p className="text-sm text-gray-600">{source.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* HMPI Calculation Results */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">HMPI Calculation Results</h2>
                  <Settings className="w-5 h-5 text-gray-400" />
                </div>
                
                {hmpiResult && (
                  <>
                    <div className="mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600 mb-2">{hmpiResult}</div>
                        <div className="text-sm text-red-600 font-medium mb-4">Heavy Metal Pollution Index</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(hmpiResult / 100 * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-red-600">High Risk - Immediate attention required</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-blue-600">65.2</div>
                        <div className="text-sm text-blue-600">HPI Score</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-green-600">42.8</div>
                        <div className="text-sm text-green-600">HEI Score</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-purple-600">3.4</div>
                        <div className="text-sm text-purple-600">Nemerow Index</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-orange-600">2.1</div>
                        <div className="text-sm text-orange-600">PLI Score</div>
                      </div>
                    </div>

                    <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium">
                      💾 Save Analysis
                    </button>
                  </>
                )}
                
                {!hmpiResult && (
                  <div className="text-center text-gray-500 py-8">
                    Enter sample data above to calculate HMPI
                  </div>
                )}
              </div>
            </div>

            {/* Recent Analyses */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Analyses</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View all</button>
              </div>
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="text-2xl">{getTypeIcon(analysis.type)}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{analysis.title}</div>
                      <div className="text-sm text-gray-600">{analysis.location} • {analysis.samples} samples</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                      {analysis.status}
                    </div>
                    <div className="text-sm text-gray-500">{analysis.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchPortal;