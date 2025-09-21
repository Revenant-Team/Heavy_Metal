import React from 'react';
import { Play, ArrowRight, CheckCircle, BarChart3, Map, Users, Database, Shield, Zap, TrendingUp, Globe, Award } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Automation',
      description: 'Automated HMPI calculations with machine learning for predictive risk assessment and trend forecasting.',
      highlights: ['Automated risk computation', 'Predictive analytics', 'Risk mapping']
    },
    {
      icon: BarChart3,
      title: 'Interactive Visualization',
      description: 'Geospatial heatmaps, choropleth maps, and customizable dashboards for comprehensive data analysis.',
      highlights: ['Advanced heatmaps', 'Interactive maps', 'Custom dashboards']
    },
    {
      icon: Users,
      title: 'Personalized Portal',
      description: 'Secure researcher portal with dataset management, historical analyses, and collaborative tools.',
      highlights: ['Dataset history', 'Role-based access', 'Data sharing']
    }
  ];

  const platformFeatures = [
    { icon: Database, title: 'Drag & Drop Upload', description: 'Easy dataset import with CSV and Excel support' },
    { icon: CheckCircle, title: 'Input Validation', description: 'Real-time data checking and error detection' },
    { icon: Shield, title: 'RESTful API', description: 'Scalable backend with modular microservices' },
    { icon: BarChart3, title: 'PostGIS Database', description: 'Geospatial data storage with advanced querying' },
    { icon: TrendingUp, title: 'AI Predictions', description: 'LSTM/Prophet models for trend forecasting' },
    { icon: Globe, title: 'Rapid Detection', description: 'X-Means clustering for contamination hotspots' },
    { icon: Award, title: 'Health Risk Models', description: 'HRA-standard carcinogenic risk calculations' },
    { icon: Users, title: 'Continued Learning', description: 'Model refinement with new datasets' }
  ];

  const challenges = [
    { icon: '⚠️', title: 'Manual Calculation Complexity', description: 'Time-consuming and error-prone HMPI calculations with multiple parameters and formulas.' },
    { icon: '📊', title: 'Limited Visualization', description: 'Difficulty in visualizing contamination trends and patterns across different regions.' },
    { icon: '💾', title: 'Fragmented Data Management', description: 'No centralized platform for storing, managing and retrieving datasets over time.' },
    { icon: '🔍', title: 'Lack of Predictive Analytics', description: 'Absence of AI-powered tools to predict future contamination risks using historical data.' }
  ];

  const impacts = [
    { icon: '🔬', title: 'Researchers', description: 'Advanced data analysis, leading research productivity and insights into contamination sources.' },
    { icon: '🏛️', title: 'Policymakers', description: 'Informed decision-making due to lack of fact-free contamination data for policy formulation.' },
    { icon: '🌍', title: 'Environmental Agencies', description: 'Real-time monitoring programs and public health protection through early contamination detection.' }
  ];

  const outcomes = [
    { icon: '❌', title: 'Reduce Human Error', description: 'Automated calculations eliminate manual computation and ensure accurate results.' },
    { icon: '📈', title: 'Enhanced Insights', description: 'Interactive visualizations and visualizations for better decision-making.' },
    { icon: '👥', title: 'Empower Researchers', description: 'Integrated research portal for personalized datasets and long-term environmental studies.' },
    { icon: '🛡️', title: 'Protect Public Health', description: 'Predictive analytics for contamination forecasting and environmental health assessments.' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Automated Heavy Metal <span className="text-blue-400">Pollution Analysis</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Transform groundwater monitoring with AI-powered HMPI calculations, predictive analytics, and interactive geospatial visualization for evidence-based environmental decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Start Analysis
                </button>
                <button className="border border-gray-400 hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  View Demo
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">99.8%</div>
                <div className="text-sm text-gray-300">Calculation Accuracy</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">13+</div>
                <div className="text-sm text-gray-300">Heavy Metals</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">5000+</div>
                <div className="text-sm text-gray-300">Datasets Analyzed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Challenge We Solve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Groundwater contamination by heavy metals poses critical environmental and public health risks
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div>
              {challenges.map((challenge, index) => (
                <div key={index} className="flex items-start space-x-4 mb-8">
                  <div className="text-2xl">{challenge.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{challenge.title}</h3>
                    <p className="text-gray-600">{challenge.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Impact on Stakeholders</h3>
              {impacts.map((impact, index) => (
                <div key={index} className="flex items-start space-x-4 mb-6">
                  <div className="text-2xl">{impact.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{impact.title}</h4>
                    <p className="text-gray-600 text-sm">{impact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Comprehensive Solution</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              An integrated web-based platform that automates HMPI computation, enables predictive analytics, and provides actionable environmental insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600">Comprehensive tools for environmental monitoring and analysis</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Transforming Environmental Monitoring</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our HMPI platform will revolutionize groundwater monitoring and contribute to sustainable environmental management
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {outcomes.map((outcome, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-3xl mb-4">{outcome.icon}</div>
                <h3 className="font-bold mb-3">{outcome.title}</h3>
                <p className="text-sm text-gray-300">{outcome.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Environmental Research?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join leading researchers and environmental scientists using our HMPI platform for accurate, efficient groundwater analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-blue-700 px-8 py-4 rounded-lg font-semibold transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;