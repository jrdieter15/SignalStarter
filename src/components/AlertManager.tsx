import React, { useState } from 'react';
import { Plus, Bell, BellOff, Edit2, Trash2, Save, X } from 'lucide-react';

interface Alert {
  id: string;
  name: string;
  sourceId: string;
  sourceName: string;
  condition: 'above' | 'below' | 'change_percent' | 'anomaly';
  threshold: number;
  timeframe: '5m' | '15m' | '1h' | '6h' | '24h';
  isActive: boolean;
  lastTriggered?: string;
}

interface AlertManagerProps {
  alerts: Alert[];
  kpiSources: Array<{ id: string; name: string; unit: string }>;
  onCreateAlert: (alert: Omit<Alert, 'id' | 'lastTriggered'>) => void;
  onUpdateAlert: (id: string, alert: Partial<Alert>) => void;
  onDeleteAlert: (id: string) => void;
}

export const AlertManager: React.FC<AlertManagerProps> = ({
  alerts,
  kpiSources,
  onCreateAlert,
  onUpdateAlert,
  onDeleteAlert,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sourceId: '',
    condition: 'above' as const,
    threshold: 0,
    timeframe: '1h' as const,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      sourceId: '',
      condition: 'above',
      threshold: 0,
      timeframe: '1h',
      isActive: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceName = kpiSources.find(s => s.id === formData.sourceId)?.name || '';
    
    if (editingId) {
      onUpdateAlert(editingId, formData);
      setEditingId(null);
    } else {
      onCreateAlert({ ...formData, sourceName });
      setIsCreating(false);
    }
    resetForm();
  };

  const handleEdit = (alert: Alert) => {
    setFormData({
      name: alert.name,
      sourceId: alert.sourceId,
      condition: alert.condition,
      threshold: alert.threshold,
      timeframe: alert.timeframe,
      isActive: alert.isActive,
    });
    setEditingId(alert.id);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    resetForm();
  };

  const getConditionText = (condition: string, threshold: number) => {
    switch (condition) {
      case 'above': return `> ${threshold}`;
      case 'below': return `< ${threshold}`;
      case 'change_percent': return `±${threshold}%`;
      case 'anomaly': return 'Anomaly detected';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Alert Management</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Alert</span>
        </button>
      </div>

      {(isCreating || editingId) && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alert Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="High Revenue Alert"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                KPI Source
              </label>
              <select
                value={formData.sourceId}
                onChange={(e) => setFormData({ ...formData, sourceId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select KPI</option>
                {kpiSources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="above">Above threshold</option>
                <option value="below">Below threshold</option>
                <option value="change_percent">Change percentage</option>
                <option value="anomaly">Anomaly detection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Threshold
              </label>
              <input
                type="number"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1000"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timeframe
              </label>
              <select
                value={formData.timeframe}
                onChange={(e) => setFormData({ ...formData, timeframe: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5m">5 minutes</option>
                <option value="15m">15 minutes</option>
                <option value="1h">1 hour</option>
                <option value="6h">6 hours</option>
                <option value="24h">24 hours</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? 'Update' : 'Create'} Alert</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No alerts configured yet</p>
            <p className="text-sm">Create your first alert to get notified about important changes</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border rounded-lg ${
                alert.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {alert.isActive ? (
                    <Bell className="w-5 h-5 text-blue-500" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <h4 className={`font-medium ${alert.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                      {alert.name}
                    </h4>
                    <p className={`text-sm ${alert.isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                      {alert.sourceName} {getConditionText(alert.condition, alert.threshold)} 
                      <span className="mx-2">•</span>
                      Check every {alert.timeframe}
                    </p>
                    {alert.lastTriggered && (
                      <p className="text-xs text-gray-500 mt-1">
                        Last triggered: {new Date(alert.lastTriggered).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateAlert(alert.id, { isActive: !alert.isActive })}
                    className={`p-2 rounded-lg transition-colors ${
                      alert.isActive 
                        ? 'text-gray-600 hover:bg-gray-100' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={alert.isActive ? 'Disable alert' : 'Enable alert'}
                  >
                    {alert.isActive ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(alert)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit alert"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteAlert(alert.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};