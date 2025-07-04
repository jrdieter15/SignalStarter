# SignalCraft API Documentation

## Overview
The SignalCraft API provides RESTful endpoints for managing business intelligence data, KPIs, forecasting, and real-time analytics. All endpoints require authentication via JWT tokens.

**Base URL**: `https://api.signalcraft.com/v1`  
**Authentication**: Bearer JWT tokens  
**Content-Type**: `application/json`

---

## Authentication

### POST /auth/register
Register a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe",
  "business_name": "Acme Corp",
  "industry": "retail"
}
```

**Response** (201):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "business": {
    "id": "uuid",
    "name": "Acme Corp",
    "industry": "retail"
  },
  "tokens": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 900
  }
}
```

### POST /auth/login
Authenticate user and receive JWT tokens.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (200):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "subscription_tier": "pro"
  },
  "tokens": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 900
  }
}
```

### POST /auth/refresh
Refresh access token using refresh token.

**Request Body**:
```json
{
  "refresh_token": "refresh_token"
}
```

**Response** (200):
```json
{
  "access_token": "new_jwt_token",
  "expires_in": 900
}
```

---

## Dashboard Endpoints

### GET /dashboard/overview/{business_id}
Get dashboard overview with key metrics.

**Headers**: `Authorization: Bearer {jwt_token}`

**Response** (200):
```json
{
  "business": {
    "id": "uuid",
    "name": "Acme Corp",
    "industry": "retail"
  },
  "summary": {
    "total_kpi_sources": 5,
    "active_alerts": 2,
    "last_data_update": "2025-01-15T10:30:00Z"
  },
  "kpis": [
    {
      "id": "uuid",
      "name": "Daily Revenue",
      "current_value": 1250.00,
      "previous_value": 1100.00,
      "change_percent": 13.64,
      "trend": "up",
      "unit": "$"
    }
  ]
}
```

### GET /dashboard/metrics/{business_id}
Get detailed KPI metrics with time-series data.

**Query Parameters**:
- `timeframe`: `1d`, `7d`, `30d`, `90d` (default: `7d`)
- `sources`: Comma-separated KPI source IDs (optional)

**Response** (200):
```json
{
  "timeframe": "7d",
  "data": [
    {
      "source_id": "uuid",
      "source_name": "Daily Revenue",
      "unit": "$",
      "data_points": [
        {
          "timestamp": "2025-01-15T00:00:00Z",
          "value": 1250.00
        },
        {
          "timestamp": "2025-01-14T00:00:00Z",
          "value": 1100.00
        }
      ],
      "statistics": {
        "avg": 1175.00,
        "min": 950.00,
        "max": 1250.00,
        "total": 8225.00
      }
    }
  ]
}
```

### GET /dashboard/news/{business_id}
Get relevant news feed for business location and industry.

**Query Parameters**:
- `limit`: Number of articles (default: 20, max: 100)
- `sentiment`: `positive`, `negative`, `neutral` (optional)
- `keywords`: Comma-separated keywords (optional)

**Response** (200):
```json
{
  "articles": [
    {
      "id": "uuid",
      "title": "Local Business Growth Trends",
      "summary": "Recent analysis shows...",
      "url": "https://news.example.com/article",
      "source": "Business Journal",
      "published_at": "2025-01-15T08:00:00Z",
      "sentiment_score": 0.7,
      "sentiment_label": "positive",
      "relevance_score": 0.85,
      "keywords": ["business", "growth", "local"]
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "per_page": 20,
    "has_more": true
  }
}
```

---

## KPI Management

### GET /kpis/sources/{business_id}
Get all KPI sources for a business.

**Response** (200):
```json
{
  "sources": [
    {
      "id": "uuid",
      "name": "Daily Revenue",
      "type": "revenue",
      "unit": "$",
      "is_active": true,
      "config": {
        "aggregation": "sum",
        "calculation": "daily"
      },
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### POST /kpis/sources
Create a new KPI source.

**Request Body**:
```json
{
  "business_id": "uuid",
  "name": "Customer Satisfaction",
  "type": "custom",
  "unit": "score",
  "config": {
    "aggregation": "avg",
    "min_value": 1,
    "max_value": 10
  }
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "name": "Customer Satisfaction",
  "type": "custom",
  "unit": "score",
  "is_active": true,
  "created_at": "2025-01-15T10:30:00Z"
}
```

### POST /kpis/data
Add KPI data points.

**Request Body**:
```json
{
  "source_id": "uuid",
  "data_points": [
    {
      "timestamp": "2025-01-15T10:00:00Z",
      "value": 1250.00,
      "metadata": {
        "source": "pos_system",
        "location": "store_1"
      }
    }
  ]
}
```

**Response** (201):
```json
{
  "created": 1,
  "data_points": [
    {
      "id": "uuid",
      "timestamp": "2025-01-15T10:00:00Z",
      "value": 1250.00
    }
  ]
}
```

### POST /kpis/upload
Upload KPI data via CSV file.

**Request**: Multipart form data
- `file`: CSV file
- `source_id`: KPI source UUID
- `timestamp_column`: Column name for timestamps
- `value_column`: Column name for values

**Response** (202):
```json
{
  "job_id": "uuid",
  "status": "processing",
  "estimated_rows": 1000,
  "message": "File uploaded successfully, processing in background"
}
```

---

## Forecasting & Analytics

### GET /forecasts/{business_id}
Get forecasting data for business KPIs.

**Query Parameters**:
- `source_id`: Specific KPI source (optional)
- `days`: Forecast horizon in days (default: 30, max: 90)

**Response** (200):
```json
{
  "forecasts": [
    {
      "source_id": "uuid",
      "source_name": "Daily Revenue",
      "model_type": "prophet",
      "model_accuracy": 0.85,
      "predictions": [
        {
          "date": "2025-01-16",
          "predicted_value": 1300.00,
          "confidence_lower": 1150.00,
          "confidence_upper": 1450.00
        }
      ],
      "generated_at": "2025-01-15T02:00:00Z"
    }
  ]
}
```

### POST /forecasts/generate
Trigger forecast generation for specific KPIs.

**Request Body**:
```json
{
  "business_id": "uuid",
  "source_ids": ["uuid1", "uuid2"],
  "model_type": "prophet",
  "horizon_days": 30
}
```

**Response** (202):
```json
{
  "job_id": "uuid",
  "status": "queued",
  "estimated_completion": "2025-01-15T10:45:00Z"
}
```

### GET /anomalies/{business_id}
Get detected anomalies for business KPIs.

**Query Parameters**:
- `timeframe`: `1d`, `7d`, `30d` (default: `7d`)
- `severity`: `low`, `medium`, `high`, `critical` (optional)
- `acknowledged`: `true`, `false` (optional)

**Response** (200):
```json
{
  "anomalies": [
    {
      "id": "uuid",
      "source_id": "uuid",
      "source_name": "Daily Revenue",
      "timestamp": "2025-01-14T15:30:00Z",
      "actual_value": 500.00,
      "expected_value": 1200.00,
      "deviation_score": -2.5,
      "severity": "high",
      "acknowledged_at": null
    }
  ]
}
```

---

## Alerts Management

### GET /alerts/{business_id}
Get all alerts for a business.

**Response** (200):
```json
{
  "alerts": [
    {
      "id": "uuid",
      "name": "Revenue Drop Alert",
      "source_id": "uuid",
      "source_name": "Daily Revenue",
      "condition": "below",
      "threshold": 1000.00,
      "timeframe": "1h",
      "is_active": true,
      "last_triggered": "2025-01-14T16:00:00Z",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### POST /alerts
Create a new alert.

**Request Body**:
```json
{
  "business_id": "uuid",
  "source_id": "uuid",
  "name": "High Revenue Alert",
  "condition": "above",
  "threshold": 2000.00,
  "timeframe": "1h"
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "name": "High Revenue Alert",
  "condition": "above",
  "threshold": 2000.00,
  "is_active": true,
  "created_at": "2025-01-15T10:30:00Z"
}
```

### PUT /alerts/{alert_id}
Update an existing alert.

**Request Body**:
```json
{
  "name": "Updated Alert Name",
  "threshold": 1500.00,
  "is_active": false
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "name": "Updated Alert Name",
  "threshold": 1500.00,
  "is_active": false,
  "updated_at": "2025-01-15T10:35:00Z"
}
```

---

## User Management

### GET /users/profile
Get current user profile.

**Response** (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "timezone": "America/Los_Angeles",
  "subscription_tier": "pro",
  "trial_ends_at": "2025-01-22T00:00:00Z",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### PUT /users/profile
Update user profile.

**Request Body**:
```json
{
  "full_name": "John Smith",
  "timezone": "America/New_York"
}
```

**Response** (200):
```json
{
  "id": "uuid",
  "full_name": "John Smith",
  "timezone": "America/New_York",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

### GET /users/subscription
Get subscription details.

**Response** (200):
```json
{
  "tier": "pro",
  "status": "active",
  "current_period_start": "2025-01-01T00:00:00Z",
  "current_period_end": "2025-02-01T00:00:00Z",
  "trial_end": "2025-01-22T00:00:00Z",
  "usage": {
    "api_calls": 15000,
    "api_calls_limit": 30000,
    "data_sources": 3,
    "data_sources_limit": 10
  }
}
```

---

## External Data

### GET /external/weather
Get weather data for business location.

**Query Parameters**:
- `business_id`: Business UUID
- `days`: Number of days (default: 7, max: 30)

**Response** (200):
```json
{
  "location": {
    "city": "San Francisco",
    "country": "USA",
    "lat": 37.7749,
    "lng": -122.4194
  },
  "current": {
    "temperature": 18.5,
    "humidity": 65,
    "conditions": "partly_cloudy",
    "timestamp": "2025-01-15T10:30:00Z"
  },
  "forecast": [
    {
      "date": "2025-01-16",
      "temperature_high": 20.0,
      "temperature_low": 12.0,
      "conditions": "sunny",
      "humidity": 60
    }
  ]
}
```

### GET /external/market
Get market data (exchange rates, indices).

**Query Parameters**:
- `symbols`: Comma-separated symbols (e.g., "USD/EUR,BTC/USD")
- `timeframe`: `1d`, `7d`, `30d` (default: `1d`)

**Response** (200):
```json
{
  "data": [
    {
      "symbol": "USD/EUR",
      "current_price": 0.85,
      "change_24h": -0.5,
      "timestamp": "2025-01-15T10:30:00Z",
      "history": [
        {
          "timestamp": "2025-01-14T10:30:00Z",
          "price": 0.855
        }
      ]
    }
  ]
}
```

---

## Reports & Export

### POST /reports/generate
Generate custom report.

**Request Body**:
```json
{
  "business_id": "uuid",
  "type": "pdf",
  "template": "weekly_summary",
  "timeframe": "7d",
  "include_sections": ["kpis", "news", "forecasts"],
  "email_to": "user@example.com"
}
```

**Response** (202):
```json
{
  "job_id": "uuid",
  "status": "processing",
  "estimated_completion": "2025-01-15T10:45:00Z"
}
```

### GET /reports/{job_id}
Get report generation status.

**Response** (200):
```json
{
  "job_id": "uuid",
  "status": "completed",
  "download_url": "https://api.signalcraft.com/downloads/report_uuid.pdf",
  "expires_at": "2025-01-22T10:30:00Z"
}
```

### GET /export/data
Export business data.

**Query Parameters**:
- `business_id`: Business UUID
- `format`: `csv`, `json`, `excel`
- `tables`: Comma-separated table names
- `timeframe`: `30d`, `90d`, `1y`, `all`

**Response** (200):
```json
{
  "download_url": "https://api.signalcraft.com/downloads/export_uuid.zip",
  "file_size": 1024000,
  "expires_at": "2025-01-22T10:30:00Z"
}
```

---

## WebSocket Events

### Connection
```
wss://api.signalcraft.com/ws?token={jwt_token}&business_id={uuid}
```

### Events

#### Real-time KPI Updates
```json
{
  "type": "kpi_update",
  "data": {
    "source_id": "uuid",
    "timestamp": "2025-01-15T10:30:00Z",
    "value": 1250.00,
    "change_percent": 5.2
  }
}
```

#### Alert Notifications
```json
{
  "type": "alert_triggered",
  "data": {
    "alert_id": "uuid",
    "alert_name": "Revenue Drop Alert",
    "source_name": "Daily Revenue",
    "current_value": 800.00,
    "threshold": 1000.00,
    "severity": "high"
  }
}
```

#### System Notifications
```json
{
  "type": "notification",
  "data": {
    "id": "uuid",
    "title": "Forecast Ready",
    "message": "Your 30-day forecast has been generated",
    "type": "system"
  }
}
```

---

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "request_id": "uuid"
  }
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `202`: Accepted (async processing)
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `429`: Too Many Requests
- `500`: Internal Server Error

### Common Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_REQUIRED`: Missing or invalid JWT token
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded
- `SUBSCRIPTION_REQUIRED`: Feature requires paid subscription
- `EXTERNAL_API_ERROR`: External service unavailable

---

## Rate Limiting

### Limits by Subscription Tier

| Tier | Requests/Hour | Requests/Day | Burst Limit |
|------|---------------|--------------|-------------|
| Free | 100 | 1,000 | 10/minute |
| Pro | 1,000 | 10,000 | 50/minute |
| Enterprise | 10,000 | 100,000 | 200/minute |

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642262400
X-RateLimit-Retry-After: 3600
```

---

## SDK Examples

### JavaScript/TypeScript
```typescript
import { SignalCraftAPI } from '@signalcraft/sdk';

const api = new SignalCraftAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.signalcraft.com/v1'
});

// Get dashboard overview
const overview = await api.dashboard.getOverview(businessId);

// Add KPI data
await api.kpis.addData(sourceId, [
  { timestamp: new Date(), value: 1250.00 }
]);

// Subscribe to real-time updates
api.subscribe('kpi_updates', (data) => {
  console.log('KPI updated:', data);
});
```

### Python
```python
from signalcraft import SignalCraftAPI

api = SignalCraftAPI(api_key='your-api-key')

# Get dashboard overview
overview = api.dashboard.get_overview(business_id)

# Add KPI data
api.kpis.add_data(source_id, [
    {'timestamp': '2025-01-15T10:30:00Z', 'value': 1250.00}
])

# Generate forecast
job = api.forecasts.generate(business_id, source_ids=['uuid'])
```

---

## Changelog

### v1.0.0 (2025-01-15)
- Initial API release
- Authentication and user management
- KPI data management
- Dashboard endpoints
- Basic forecasting
- Alert system

### Upcoming Features
- Advanced analytics endpoints
- Custom report templates
- Webhook notifications
- GraphQL API
- Mobile SDK support