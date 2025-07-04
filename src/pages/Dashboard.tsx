import React from 'react';
import { KPICard } from '../components/KPICard';
import { Chart } from '../components/Chart';
import { Bell, TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';

export function Dashboard() {
  // Mock data for demonstration
  const kpiData = [
    {
      title: 'Total Revenue',
      value: 24750,
      unit: '$',
      change: 12.5,
      trend: 'up' as const
    },
    {
      title: 'New Customers',
      value: 156,
      change: -3.2,
      trend: 'down' as const
    },
    {
      title: 'Orders',
      value: 89,
      change: 8.1,
      trend: 'up' as const
    },
    {
      title: 'Avg Order Value',
      value: 278,
      unit: '$',
      change: 5.4,
      trend: 'up' as const
    }
  ];

  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 24750],
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsla(var(--primary), 0.1)',
        fill: true,
      },
    ],
  };

  const ordersChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: 'hsl(var(--secondary))',
        backgroundColor: 'hsla(var(--secondary), 0.1)',
      },
    ],
  };

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Revenue below target',
      message: 'Daily revenue is 15% below your target of $1,000',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'info',
      title: 'New forecast available',
      message: 'Your 30-day revenue forecast has been updated',
      time: '4 hours ago'
    }
  ];

  const newsItems = [
    {
      id: 1,
      title: 'Local Business Growth Trends Show Positive Outlook',
      summary: 'Recent analysis indicates strong growth potential for small businesses in the retail sector...',
      sentiment: 'positive',
      relevance: 85,
      time: '1 hour ago'
    },
    {
      id: 2,
      title: 'Supply Chain Disruptions May Impact Q2 Performance',
      summary: 'Industry experts warn of potential delays that could affect inventory levels...',
      sentiment: 'negative',
      relevance: 72,
      time: '3 hours ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Generate Forecast
          </button>
          <button className="btn-primary">
            <Bell className="h-4 w-4 mr-2" />
            Create Alert
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Revenue Trend</h3>
            <p className="card-description">
              Monthly revenue over the last 7 months
            </p>
          </div>
          <div className="card-content">
            <Chart type="line" data={revenueChartData} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Weekly Orders</h3>
            <p className="card-description">
              Order volume by day of the week
            </p>
          </div>
          <div className="card-content">
            <Chart type="bar" data={ordersChartData} />
          </div>
        </div>
      </div>

      {/* Alerts and News */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Alerts */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Alerts</h3>
            <p className="card-description">
              Important notifications about your business
            </p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* News Feed */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Relevant News</h3>
            <p className="card-description">
              Industry news that might impact your business
            </p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {newsItems.map((item) => (
                <div key={item.id} className="p-3 rounded-lg border">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-medium line-clamp-2">{item.title}</h4>
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${
                        item.sentiment === 'positive' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-xs text-muted-foreground">{item.relevance}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
                  <p className="text-xs text-muted-foreground mt-2">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
          <p className="card-description">
            Common tasks to help you manage your business
          </p>
        </div>
        <div className="card-content">
          <div className="grid gap-4 md:grid-cols-3">
            <button className="btn-outline justify-start h-auto p-4">
              <DollarSign className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Add Revenue Data</div>
                <div className="text-sm text-muted-foreground">Upload sales data</div>
              </div>
            </button>
            
            <button className="btn-outline justify-start h-auto p-4">
              <Users className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Customer Analysis</div>
                <div className="text-sm text-muted-foreground">View customer insights</div>
              </div>
            </button>
            
            <button className="btn-outline justify-start h-auto p-4">
              <ShoppingCart className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Inventory Check</div>
                <div className="text-sm text-muted-foreground">Monitor stock levels</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}