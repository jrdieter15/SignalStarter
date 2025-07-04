import React, { useState } from 'react';
import { Download, FileText, Table, Calendar, Settings } from 'lucide-react';

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  timeframe: '7d' | '30d' | '90d' | 'custom';
  sections: string[];
  customStartDate?: string;
  customEndDate?: string;
}

interface ExportManagerProps {
  onExport: (options: ExportOptions) => Promise<void>;
  isExporting: boolean;
  tier: 'free' | 'pro' | 'enterprise';
}

export const ExportManager: React.FC<ExportManagerProps> = ({
  onExport,
  isExporting,
  tier,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    timeframe: '30d',
    sections: ['kpis', 'news', 'forecasts'],
    customStartDate: '',
    customEndDate: '',
  });

  const availableSections = [
    { id: 'kpis', label: 'KPI Dashboard', available: true },
    { id: 'news', label: 'News & Trends', available: true },
    { id: 'forecasts', label: 'Forecasts', available: tier !== 'free' },
    { id: 'anomalies', label: 'Anomaly Reports', available: tier !== 'free' },
    { id: 'alerts', label: 'Alert History', available: tier !== 'free' },
    { id: 'analytics', label: 'Advanced Analytics', available: tier === 'enterprise' },
  ];

  const handleExport = async () => {
    await onExport(options);
    setIsOpen(false);
  };

  const toggleSection = (sectionId: string) => {
    setOptions(prev => ({
      ...prev,
      sections: prev.sections.includes(sectionId)
        ? prev.sections.filter(s => s !== sectionId)
        : [...prev.sections, sectionId]
    }));
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'excel': return <Table className="w-4 h-4" />;
      case 'csv': return <Table className="w-4 h-4" />;
      default: return <Download className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        <span>{isExporting ? 'Exporting...' : 'Export Report'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Export Options</h3>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['pdf', 'excel', 'csv'].map((format) => (
                  <button
                    key={format}
                    onClick={() => setOptions(prev => ({ ...prev, format: format as any }))}
                    disabled={format === 'excel' && tier === 'free'}
                    className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors ${
                      options.format === format
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${format === 'excel' && tier === 'free' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {getFormatIcon(format)}
                    <span className="text-sm font-medium capitalize">{format}</span>
                  </button>
                ))}
              </div>
              {tier === 'free' && (
                <p className="text-xs text-gray-500 mt-1">
                  Excel export available in Pro plan
                </p>
              )}
            </div>

            {/* Timeframe Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period
              </label>
              <select
                value={options.timeframe}
                onChange={(e) => setOptions(prev => ({ ...prev, timeframe: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="custom">Custom range</option>
              </select>
            </div>

            {/* Custom Date Range */}
            {options.timeframe === 'custom' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={options.customStartDate}
                    onChange={(e) => setOptions(prev => ({ ...prev, customStartDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={options.customEndDate}
                    onChange={(e) => setOptions(prev => ({ ...prev, customEndDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Section Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include Sections
              </label>
              <div className="space-y-2">
                {availableSections.map((section) => (
                  <label
                    key={section.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg border ${
                      section.available 
                        ? 'border-gray-200 hover:bg-gray-50 cursor-pointer' 
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={options.sections.includes(section.id)}
                      onChange={() => section.available && toggleSection(section.id)}
                      disabled={!section.available}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {section.label}
                    </span>
                    {!section.available && (
                      <span className="text-xs text-gray-500 ml-auto">
                        {tier === 'free' ? 'Pro+' : 'Enterprise'}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || options.sections.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? 'Exporting...' : 'Export Report'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};