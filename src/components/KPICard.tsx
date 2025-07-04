import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeType?: 'percentage' | 'absolute';
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

export function KPICard({ 
  title, 
  value, 
  unit = '', 
  change, 
  changeType = 'percentage',
  trend,
  loading = false 
}: KPICardProps) {
  if (loading) {
    return (
      <div className="kpi-card">
        <div className="space-y-2">
          <div className="skeleton h-4 w-24"></div>
          <div className="skeleton h-8 w-32"></div>
          <div className="skeleton h-4 w-16"></div>
        </div>
      </div>
    );
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const formatChange = () => {
    if (change === undefined) return null;
    
    const prefix = change > 0 ? '+' : '';
    const suffix = changeType === 'percentage' ? '%' : unit;
    return `${prefix}${change.toFixed(1)}${suffix}`;
  };

  return (
    <div className="kpi-card">
      <div className="space-y-2">
        <p className="kpi-label">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="kpi-value">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {change !== undefined && (
          <div className={clsx(
            'kpi-change flex items-center gap-1',
            trend === 'up' && 'positive',
            trend === 'down' && 'negative',
            trend === 'neutral' && 'neutral'
          )}>
            {getTrendIcon()}
            <span>{formatChange()}</span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
}