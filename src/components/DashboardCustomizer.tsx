import React, { useState } from 'react';
import { Settings, Eye, EyeOff, GripVertical, Plus, X } from 'lucide-react';

interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'news' | 'forecast' | 'alerts';
  title: string;
  visible: boolean;
  order: number;
  size: 'small' | 'medium' | 'large';
}

interface DashboardCustomizerProps {
  widgets: DashboardWidget[];
  onUpdateWidgets: (widgets: DashboardWidget[]) => void;
  tier: 'free' | 'pro' | 'enterprise';
}

export const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({
  widgets,
  onUpdateWidgets,
  tier,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const availableWidgets = [
    { type: 'kpi', title: 'KPI Cards', available: true },
    { type: 'chart', title: 'Performance Charts', available: true },
    { type: 'news', title: 'News Feed', available: true },
    { type: 'forecast', title: 'Forecasting', available: tier !== 'free' },
    { type: 'alerts', title: 'Alert Center', available: tier !== 'free' },
  ];

  const toggleWidgetVisibility = (widgetId: string) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    );
    onUpdateWidgets(updatedWidgets);
  };

  const updateWidgetSize = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId ? { ...widget, size } : widget
    );
    onUpdateWidgets(updatedWidgets);
  };

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedItem(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = widgets.findIndex(w => w.id === draggedItem);
    const targetIndex = widgets.findIndex(w => w.id === targetId);

    const newWidgets = [...widgets];
    const [draggedWidget] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, draggedWidget);

    // Update order values
    const updatedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      order: index,
    }));

    onUpdateWidgets(updatedWidgets);
    setDraggedItem(null);
  };

  const addWidget = (type: string) => {
    const newWidget: DashboardWidget = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      title: availableWidgets.find(w => w.type === type)?.title || type,
      visible: true,
      order: widgets.length,
      size: 'medium',
    };
    onUpdateWidgets([...widgets, newWidget]);
  };

  const removeWidget = (widgetId: string) => {
    const updatedWidgets = widgets.filter(w => w.id !== widgetId);
    onUpdateWidgets(updatedWidgets);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span>Customize</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Dashboard Layout</h3>
            <p className="text-sm text-gray-600 mt-1">
              Customize your dashboard widgets and layout
            </p>
          </div>

          <div className="p-4 space-y-4">
            {/* Current Widgets */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Current Widgets</h4>
              <div className="space-y-2">
                {widgets.map((widget) => (
                  <div
                    key={widget.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, widget.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, widget.id)}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-move ${
                      widget.visible ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${
                        widget.visible ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {widget.title}
                      </span>
                    </div>

                    <select
                      value={widget.size}
                      onChange={(e) => updateWidgetSize(widget.id, e.target.value as any)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>

                    <button
                      onClick={() => toggleWidgetVisibility(widget.id)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      {widget.visible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => removeWidget(widget.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Widgets */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Add Widgets</h4>
              <div className="space-y-2">
                {availableWidgets.map((widget) => {
                  const isAlreadyAdded = widgets.some(w => w.type === widget.type);
                  
                  return (
                    <button
                      key={widget.type}
                      onClick={() => widget.available && !isAlreadyAdded && addWidget(widget.type)}
                      disabled={!widget.available || isAlreadyAdded}
                      className={`w-full flex items-center justify-between p-3 border rounded-lg text-left transition-colors ${
                        widget.available && !isAlreadyAdded
                          ? 'border-gray-200 hover:bg-gray-50 cursor-pointer'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {widget.title}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        {!widget.available && (
                          <span className="text-xs text-gray-500">
                            {tier === 'free' ? 'Pro+' : 'Enterprise'}
                          </span>
                        )}
                        {isAlreadyAdded ? (
                          <span className="text-xs text-green-600">Added</span>
                        ) : (
                          <Plus className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};