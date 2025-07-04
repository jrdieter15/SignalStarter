import React from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Clock } from 'lucide-react';

interface Anomaly {
  id: string;
  sourceName: string;
  timestamp: string;
  actualValue: number;
  expectedValue: number;
  deviationScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
}

interface AnomalyAlertProps {
  anomaly: Anomaly;
  onAcknowledge: (id: string) => void;
  unit?: string;
}

export const AnomalyAlert: React.FC<AnomalyAlertProps> = ({ 
  anomaly, 
  onAcknowledge, 
  unit = '' 
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50 text-red-900';
      case 'high': return 'border-orange-500 bg-orange-50 text-orange-900';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-900';
      case 'low': return 'border-blue-500 bg-blue-50 text-blue-900';
      default: return 'border-gray-500 bg-gray-50 text-gray-900';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <TrendingDown className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const changePercent = ((anomaly.actualValue - anomaly.expectedValue) / anomaly.expectedValue * 100);
  const isPositive = changePercent > 0;

  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(anomaly.severity)} ${
      anomaly.acknowledged ? 'opacity-60' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {getSeverityIcon(anomaly.severity)}
          <div className="flex-1">
            <h4 className="font-semibold text-sm">
              {anomaly.sourceName} Anomaly Detected
            </h4>
            <p className="text-xs mt-1 opacity-75">
              {new Date(anomaly.timestamp).toLocaleString()}
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Actual:</span>
                <span className="font-mono">{unit}{anomaly.actualValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Expected:</span>
                <span className="font-mono">{unit}{anomaly.expectedValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Change:</span>
                <span className={`font-mono ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Severity:</span>
                <span className="font-semibold capitalize">{anomaly.severity}</span>
              </div>
            </div>
          </div>
        </div>
        
        {!anomaly.acknowledged && (
          <button
            onClick={() => onAcknowledge(anomaly.id)}
            className="px-3 py-1 text-xs bg-white border border-current rounded hover:bg-gray-50 transition-colors"
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
};