// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const userJson = localStorage.getItem('signalcraft_user');
  if (!userJson) {
    // Redirect to login if not logged in
    window.location.href = '/login';
    return;
  }
  
  // Parse user data
  const user = JSON.parse(userJson);
  
  // Update user info in header
  document.getElementById('user-name').textContent = user.full_name || user.email;
  document.getElementById('user-plan').textContent = `${user.subscription_tier.charAt(0).toUpperCase() + user.subscription_tier.slice(1)} Plan`;
  
  // Handle logout
  document.getElementById('logout-button').addEventListener('click', function() {
    localStorage.removeItem('signalcraft_user');
    window.location.href = '/';
  });
  
  // Load dashboard data
  loadKPIData();
  loadChartData();
  loadAlerts();
  loadNews();
});

// Load KPI data
function loadKPIData() {
  fetch('/api/kpi-data')
    .then(response => response.json())
    .then(data => {
      const kpiContainer = document.getElementById('kpi-cards');
      
      // Clear loading skeletons
      kpiContainer.innerHTML = '';
      
      // Render KPI cards
      data.kpis.forEach(kpi => {
        const card = createKPICard(kpi);
        kpiContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error loading KPI data:', error);
    });
}

// Create KPI card element
function createKPICard(kpi) {
  const card = document.createElement('div');
  card.className = 'kpi-card';
  
  const trendIcon = kpi.trend === 'up' 
    ? '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>'
    : kpi.trend === 'down'
      ? '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>'
      : '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
  
  const changeClass = kpi.trend === 'up' ? 'positive' : kpi.trend === 'down' ? 'negative' : 'neutral';
  const changePrefix = kpi.change > 0 ? '+' : '';
  
  card.innerHTML = `
    <div class="space-y-2">
      <p class="kpi-label">${kpi.title}</p>
      <div class="flex items-baseline gap-2">
        <span class="kpi-value">${typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}</span>
        ${kpi.unit ? `<span class="text-sm text-muted-foreground">${kpi.unit}</span>` : ''}
      </div>
      ${kpi.change !== undefined ? `
        <div class="kpi-change ${changeClass} flex items-center gap-1">
          ${trendIcon}
          <span>${changePrefix}${kpi.change.toFixed(1)}%</span>
          <span class="text-xs text-muted-foreground">vs last period</span>
        </div>
      ` : ''}
    </div>
  `;
  
  return card;
}

// Load chart data
function loadChartData() {
  fetch('/api/chart-data')
    .then(response => response.json())
    .then(data => {
      // Initialize revenue chart
      initRevenueChart(data.revenue);
      
      // Initialize orders chart
      initOrdersChart(data.orders);
    })
    .catch(error => {
      console.error('Error loading chart data:', error);
    });
}

// Initialize revenue chart
function initRevenueChart(data) {
  const ctx = document.getElementById('revenue-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: data.datasets.map(dataset => ({
        ...dataset,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          }
        },
        y: {
          display: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  });
}

// Initialize orders chart
function initOrdersChart(data) {
  const ctx = document.getElementById('orders-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: data.datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          }
        },
        y: {
          display: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          beginAtZero: true
        }
      }
    }
  });
}

// Load alerts
function loadAlerts() {
  fetch('/api/alerts')
    .then(response => response.json())
    .then(data => {
      const alertsContainer = document.getElementById('alerts-container');
      
      // Clear loading skeletons
      alertsContainer.innerHTML = '';
      
      // Render alerts
      data.alerts.forEach(alert => {
        const alertElement = createAlertElement(alert);
        alertsContainer.appendChild(alertElement);
      });
    })
    .catch(error => {
      console.error('Error loading alerts:', error);
    });
}

// Create alert element
function createAlertElement(alert) {
  const alertElement = document.createElement('div');
  alertElement.className = 'flex items-start gap-3 p-3 rounded-lg border';
  
  const alertColor = alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
  
  alertElement.innerHTML = `
    <div class="w-2 h-2 rounded-full mt-2 ${alertColor}"></div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium">${alert.title}</p>
      <p class="text-sm text-muted-foreground">${alert.message}</p>
      <p class="text-xs text-muted-foreground mt-1">${alert.time}</p>
    </div>
  `;
  
  return alertElement;
}

// Load news
function loadNews() {
  fetch('/api/news')
    .then(response => response.json())
    .then(data => {
      const newsContainer = document.getElementById('news-container');
      
      // Clear loading skeletons
      newsContainer.innerHTML = '';
      
      // Render news items
      data.news.forEach(item => {
        const newsElement = createNewsElement(item);
        newsContainer.appendChild(newsElement);
      });
    })
    .catch(error => {
      console.error('Error loading news:', error);
    });
}

// Create news element
function createNewsElement(item) {
  const newsElement = document.createElement('div');
  newsElement.className = 'p-3 rounded-lg border';
  
  const sentimentColor = item.sentiment === 'positive' ? 'bg-green-500' : 'bg-red-500';
  
  newsElement.innerHTML = `
    <div class="flex items-start justify-between gap-2 mb-2">
      <h4 class="text-sm font-medium line-clamp-2">${item.title}</h4>
      <div class="flex items-center gap-1">
        <span class="w-2 h-2 rounded-full ${sentimentColor}"></span>
        <span class="text-xs text-muted-foreground">${item.relevance}%</span>
      </div>
    </div>
    <p class="text-sm text-muted-foreground line-clamp-2">${item.summary}</p>
    <p class="text-xs text-muted-foreground mt-2">${item.time}</p>
  `;
  
  return newsElement;
}