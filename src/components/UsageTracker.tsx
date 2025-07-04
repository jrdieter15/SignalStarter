import React from 'react';
import { BarChart3, Database, Zap, Users } from 'lucide-react';

interface UsageData {
  apiCalls: { current: number; limit: number };
  dataSources: { current: number; limit: number };
  forecasts: { current: number; limit: number };
  users: { current: number; limit: number };
}

interface UsageTrackerProps {
  usage: UsageData;
  tier: 'free' | 'pro' | 'enterprise';
}

export const UsageTracker: React.FC<UsageTrackerProps> = ({ usage, tier }) => {
  const getUsageColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const usageItems = [
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'API Calls',
      current: usage.apiCalls.current,
      limit: usage.apiCalls.limit,
      unit: '',
    },
    {
      icon: <Database className="w-5 h-5" />,
      label: 'Data Sources',
      current: usage.dataSources.current,
      limit: usage.dataSources.limit,
      unit: '',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Forecasts',
      current: usage.forecasts.current,
      limit: usage.forecasts.limit,
      unit: '',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Team Members',
      current: usage.users.current,
      limit: usage.users.limit,
      unit: '',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Usage Overview</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          tier === 'enterprise' ? 'bg-purple-100 text-purple-800' :
          tier === 'pro' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </span>
      </div>

      <div className="space-y-4">
        {usageItems.map((item, index) => {
          const percentage = getUsagePercentage(item.current, item.limit);
          const colorClass = getUsageColor(item.current, item.limit);
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">{item.icon}</span>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <span className="text-gray-600">
                  {item.current.toLocaleString()}{item.unit} / {item.limit.toLocaleString()}{item.unit}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${colorClass}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              {percentage >= 90 && (
                <p className="text-xs text-red-600">
                  ⚠️ Approaching limit - consider upgrading your plan
                </p>
              )}
            </div>
          );
        })}
      </div>

      {tier === 'free' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Need more?</strong> Upgrade to Pro for higher limits and advanced features.
          </p>
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
};