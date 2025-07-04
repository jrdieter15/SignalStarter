import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Download, Settings, BarChart3 } from 'lucide-react';
import { ForecastChart } from '../components/ForecastChart';
import { AnomalyAlert } from '../components/AnomalyAlert';
import { AlertManager } from '../components/AlertManager';
import { ExportManager } from '../components/ExportManager';
import { FeatureGate } from '../components/FeatureGate';
import { UsageTracker } from '../components/UsageTracker';
import { mockDataService, ForecastData, Anomaly, Alert, UsageData } from '../services/mockDataService';

export const Analytics: React.FC = () => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'forecasts' | 'anomalies' | 'alerts' | 'usage'>('forecasts');
  
  // Mock user tier - in real app this would come from auth context
  const userTier: 'free' | 'pro' | 'enterprise' = 'pro';
  
  const kpiSources = [
    { id: 'revenue-daily', name: 'Daily Revenue', unit: '$' },
    { id: 'customers-daily', name: 'Customer Count', unit: '' },
    { id: 'orders-daily', name: 'Daily Orders', unit: '' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [forecastResult, anomaliesResult, alertsResult, usageResult] = await Promise.all([
        mockDataService.getForecastData('revenue-daily'),
        mockDataService.getAnomalies('business-1'),
        mockDataService.getAlerts('business-1'),
        mockDataService.getUsageData(userTier),
      ]);
      
      setForecastData(forecastResult);
      setAnomalies(anomaliesResult);
      setAlerts(alertsResult);
      setUsage(usageResult);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledgeAnomaly = async (anomalyId: string) => {
    try {
      await mockDataService.acknowledgeAnomaly(anomalyId);
      setAnomalies(prev => 
        prev.map(anomaly => 
          anomaly.id === anomalyId ? { ...anomaly, acknowledged: true } : anomaly
        )
      );
    } catch (error) {
      console.error('Failed to acknowledge anomaly:', error);
    }
  };

  const handleCreateAlert = async (alertData: Omit<Alert, 'id' | 'lastTriggered'>) => {
    try {
      const newAlert = await mockDataService.createAlert(alertData);
      setAlerts(prev => [...prev, newAlert]);
    } catch (error) {
      console.error('Failed to create alert:', error);
    }
  };

  const handleUpdateAlert = async (alertId: string, updates: Partial<Alert>) => {
    try {
      const updatedAlert = await mockDataService.updateAlert(alertId, updates);
      setAlerts(prev => 
        prev.map(alert => alert.id === alertId ? updatedAlert : alert)
      );
    } catch (error) {
      console.error('Failed to update alert:', error);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await mockDataService.deleteAlert(alertId);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Failed to delete alert:', error);
    }
  };

  const handleExport = async (options: any) => {
    setIsExporting(true);
    try {
      const result = await mockDataService.exportReport(options);
      // In a real app, this would trigger a download
      console.log('Export completed:', result);
      alert(`Report exported: ${result.fileName}`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleUpgrade = () => {
    alert('Upgrade functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
            <p className="text-gray-600 mt-2">
              Forecasting, anomaly detection, and intelligent alerts
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <ExportManager
              onExport={handleExport}
              isExporting={isExporting}
              tier={userTier}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'forecasts', label: 'Forecasts', icon: TrendingUp },
              { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
              { id: 'alerts', label: 'Alerts', icon: Settings },
              { id: 'usage', label: 'Usage', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'forecasts' && (
          <FeatureGate
            feature="Advanced Forecasting"
            requiredTier="pro"
            currentTier={userTier}
            onUpgrade={handleUpgrade}
          >
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Revenue Forecast</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Model: Prophet</span>
                  <span>•</span>
                  <span>Accuracy: 85%</span>
                </div>
              </div>
              
              <ForecastChart
                data={forecastData}
                title="30-Day Revenue Forecast"
                unit="$"
              />
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">Next 7 Days</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    ${forecastData.slice(-7).reduce((sum, d) => sum + d.predicted, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">Predicted revenue</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Growth Trend</h3>
                  <p className="text-2xl font-bold text-green-600 mt-1">+12.5%</p>
                  <p className="text-sm text-green-700 mt-1">vs last month</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900">Confidence</h3>
                  <p className="text-2xl font-bold text-purple-600 mt-1">85%</p>
                  <p className="text-sm text-purple-700 mt-1">Model accuracy</p>
                </div>
              </div>
            </div>
          </FeatureGate>
        )}

        {activeTab === 'anomalies' && (
          <FeatureGate
            feature="Anomaly Detection"
            requiredTier="pro"
            currentTier={userTier}
            onUpgrade={handleUpgrade}
          >
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Anomalies</h2>
                <p className="text-gray-600 mb-6">
                  Automatically detected unusual patterns in your business metrics
                </p>
                
                {anomalies.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No anomalies detected</p>
                    <p className="text-sm">Your metrics are performing within expected ranges</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {anomalies.map((anomaly) => (
                      <AnomalyAlert
                        key={anomaly.id}
                        anomaly={anomaly}
                        onAcknowledge={handleAcknowledgeAnomaly}
                        unit="$"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FeatureGate>
        )}

        {activeTab === 'alerts' && (
          <FeatureGate
            feature="Smart Alerts"
            requiredTier="pro"
            currentTier={userTier}
            onUpgrade={handleUpgrade}
          >
            <AlertManager
              alerts={alerts}
              kpiSources={kpiSources}
              onCreateAlert={handleCreateAlert}
              onUpdateAlert={handleUpdateAlert}
              onDeleteAlert={handleDeleteAlert}
            />
          </FeatureGate>
        )}

        {activeTab === 'usage' && usage && (
          <div className="space-y-6">
            <UsageTracker usage={usage} tier={userTier} />
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Current Plan</h4>
                  <p className="text-2xl font-bold text-blue-600 capitalize">{userTier}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {userTier === 'free' ? 'Free forever' : 
                     userTier === 'pro' ? '$29/month' : 
                     'Custom pricing'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Next Billing Date</h4>
                  <p className="text-lg font-semibold text-gray-900">
                    {userTier === 'free' ? 'N/A' : 'February 15, 2025'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {userTier === 'free' ? 'No billing required' : 'Auto-renewal enabled'}
                  </p>
                </div>
              </div>
              
              {userTier !== 'enterprise' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleUpgrade}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {userTier === 'free' ? 'Upgrade to Pro' : 'Upgrade to Enterprise'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};