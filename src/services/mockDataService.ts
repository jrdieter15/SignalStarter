// Enhanced mock data service with advanced features
export interface ForecastData {
  date: string;
  actual?: number;
  predicted: number;
  confidenceLower: number;
  confidenceUpper: number;
}

export interface Anomaly {
  id: string;
  sourceName: string;
  timestamp: string;
  actualValue: number;
  expectedValue: number;
  deviationScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  acknowledged: boolean;
}

export interface Alert {
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

export interface UsageData {
  apiCalls: { current: number; limit: number };
  dataSources: { current: number; limit: number };
  forecasts: { current: number; limit: number };
  users: { current: number; limit: number };
}

class MockDataService {
  private generateForecastData(days: number = 30): ForecastData[] {
    const data: ForecastData[] = [];
    const baseValue = 1200;
    const today = new Date();
    
    // Generate historical data (last 30 days)
    for (let i = -30; i < 0; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const trend = Math.sin(i * 0.1) * 100;
      const noise = (Math.random() - 0.5) * 200;
      const actual = Math.max(0, baseValue + trend + noise);
      
      data.push({
        date: date.toISOString().split('T')[0],
        actual,
        predicted: actual + (Math.random() - 0.5) * 50,
        confidenceLower: actual * 0.85,
        confidenceUpper: actual * 1.15,
      });
    }
    
    // Generate future predictions
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const trend = Math.sin(i * 0.1) * 100;
      const seasonality = Math.sin(i * 0.2) * 50;
      const predicted = Math.max(0, baseValue + trend + seasonality);
      
      data.push({
        date: date.toISOString().split('T')[0],
        predicted,
        confidenceLower: predicted * 0.8,
        confidenceUpper: predicted * 1.2,
      });
    }
    
    return data;
  }

  private generateAnomalies(): Anomaly[] {
    const sources = ['Daily Revenue', 'Customer Count', 'Average Order Value'];
    const anomalies: Anomaly[] = [];
    
    for (let i = 0; i < 5; i++) {
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - Math.random() * 72);
      
      const expectedValue = 1000 + Math.random() * 500;
      const deviationScore = (Math.random() - 0.5) * 4;
      const actualValue = expectedValue + (deviationScore * expectedValue * 0.2);
      
      let severity: 'low' | 'medium' | 'high' | 'critical';
      if (Math.abs(deviationScore) > 3) severity = 'critical';
      else if (Math.abs(deviationScore) > 2) severity = 'high';
      else if (Math.abs(deviationScore) > 1) severity = 'medium';
      else severity = 'low';
      
      anomalies.push({
        id: `anomaly-${i}`,
        sourceName: sources[Math.floor(Math.random() * sources.length)],
        timestamp: timestamp.toISOString(),
        actualValue,
        expectedValue,
        deviationScore,
        severity,
        acknowledged: Math.random() > 0.6,
      });
    }
    
    return anomalies.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private generateAlerts(): Alert[] {
    return [
      {
        id: 'alert-1',
        name: 'High Revenue Alert',
        sourceId: 'revenue-daily',
        sourceName: 'Daily Revenue',
        condition: 'above',
        threshold: 2000,
        timeframe: '1h',
        isActive: true,
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'alert-2',
        name: 'Low Customer Count',
        sourceId: 'customers-daily',
        sourceName: 'Customer Count',
        condition: 'below',
        threshold: 50,
        timeframe: '6h',
        isActive: true,
      },
      {
        id: 'alert-3',
        name: 'Revenue Drop Alert',
        sourceId: 'revenue-daily',
        sourceName: 'Daily Revenue',
        condition: 'change_percent',
        threshold: 20,
        timeframe: '24h',
        isActive: false,
        lastTriggered: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }

  private generateUsageData(tier: 'free' | 'pro' | 'enterprise'): UsageData {
    const limits = {
      free: { apiCalls: 5000, dataSources: 3, forecasts: 1, users: 1 },
      pro: { apiCalls: 30000, dataSources: 10, forecasts: 5, users: 5 },
      enterprise: { apiCalls: 100000, dataSources: 50, forecasts: 20, users: 50 },
    };
    
    const tierLimits = limits[tier];
    
    return {
      apiCalls: {
        current: Math.floor(tierLimits.apiCalls * (0.3 + Math.random() * 0.6)),
        limit: tierLimits.apiCalls,
      },
      dataSources: {
        current: Math.floor(tierLimits.dataSources * (0.4 + Math.random() * 0.4)),
        limit: tierLimits.dataSources,
      },
      forecasts: {
        current: Math.floor(tierLimits.forecasts * (0.2 + Math.random() * 0.6)),
        limit: tierLimits.forecasts,
      },
      users: {
        current: Math.floor(tierLimits.users * (0.3 + Math.random() * 0.5)),
        limit: tierLimits.users,
      },
    };
  }

  // Public API methods
  async getForecastData(sourceId: string, days: number = 30): Promise<ForecastData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.generateForecastData(days);
  }

  async getAnomalies(businessId: string): Promise<Anomaly[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.generateAnomalies();
  }

  async getAlerts(businessId: string): Promise<Alert[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.generateAlerts();
  }

  async getUsageData(tier: 'free' | 'pro' | 'enterprise'): Promise<UsageData> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.generateUsageData(tier);
  }

  async acknowledgeAnomaly(anomalyId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Acknowledged anomaly: ${anomalyId}`);
  }

  async createAlert(alert: Omit<Alert, 'id' | 'lastTriggered'>): Promise<Alert> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      ...alert,
      id: `alert-${Date.now()}`,
    };
  }

  async updateAlert(alertId: string, updates: Partial<Alert>): Promise<Alert> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const alerts = this.generateAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) throw new Error('Alert not found');
    
    return { ...alert, ...updates };
  }

  async deleteAlert(alertId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Deleted alert: ${alertId}`);
  }

  async exportReport(options: any): Promise<{ downloadUrl: string; fileName: string }> {
    // Simulate export processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `signalcraft-report-${timestamp}.${options.format}`;
    
    return {
      downloadUrl: `#download-${Date.now()}`,
      fileName,
    };
  }

  async generateForecast(sourceId: string, modelType: string = 'prophet'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(`Generated ${modelType} forecast for source: ${sourceId}`);
  }
}

export const mockDataService = new MockDataService();