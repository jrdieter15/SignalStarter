# SignalCraft Backend Operations Documentation

## Overview
The SignalCraft backend is built with FastAPI and provides RESTful APIs for data processing, user management, and real-time analytics. The backend handles external data ingestion, ML processing, and serves the React frontend.

---

## Architecture

### Core Components
```
FastAPI Application
├── Authentication & Authorization (JWT)
├── Data Ingestion Services
├── ML Processing Pipeline
├── Real-time Updates (WebSocket/SSE)
├── Background Jobs (Redis Queue)
└── Database Operations (Supabase)
```

### Current Structure
```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── api/
│   └── v1/
│       └── dashboard.py    # Dashboard endpoints (basic)
├── core/
│   ├── config.py          # Configuration management
│   └── security.py        # Security utilities
├── services/
│   └── sentiment.py       # spaCy sentiment analysis
└── jobs/
    └── scrape_news.py     # Background news scraping
```

---

## Services & Operations

### 1. Authentication Service
**File**: `backend/core/security.py`
**Status**: 🚧 Needs Implementation

```python
# Required Implementation
- JWT token generation and validation
- Password hashing and verification
- User session management
- Role-based access control (RBAC)
- API key management for external services
```

**Operations**:
- User registration and login
- Token refresh mechanisms
- Password reset flows
- Multi-factor authentication (Enterprise)

### 2. Data Ingestion Service
**File**: `backend/jobs/scrape_news.py`
**Status**: 🚧 Needs Implementation

```python
# Required Implementation
- GDELT 2.0 API integration
- Open-Meteo weather data
- GeoNames geocoding service
- Exchange rate data (exchangerate.host)
- Data validation and cleaning
```

**Operations**:
- Scheduled data fetching (hourly/daily)
- Data transformation and normalization
- Error handling and retry logic
- Rate limiting and API quota management

### 3. ML Processing Pipeline
**File**: `backend/services/sentiment.py`
**Status**: 🚧 Needs Implementation

```python
# Required Implementation
- spaCy NLP pipeline for sentiment analysis
- Prophet forecasting models
- Anomaly detection algorithms
- Trend analysis and pattern recognition
- Data aggregation and statistical processing
```

**Operations**:
- Real-time sentiment scoring
- 30-day forecasting generation
- Anomaly threshold detection
- KPI trend analysis

### 4. Dashboard API Service
**File**: `backend/api/v1/dashboard.py`
**Status**: 🚧 Basic Structure Exists

**Current Implementation**:
```python
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class MetricRequest(BaseModel):
    business_id: str

@router.post("/dashboard/metrics")
def get_metrics(payload: MetricRequest):
    return {"status": "ok", "data": {}}
```

**Required Enhancements**:
- Real KPI data fetching
- Chart data aggregation
- News feed compilation
- Alert management
- User preference handling

---

## Database Operations

### Supabase Integration
**Status**: 🚫 Not Implemented - Requires Setup

**Required Tables**:
```sql
-- Users and Authentication
users (id, email, created_at, subscription_tier)
businesses (id, user_id, name, industry, location)
user_sessions (id, user_id, token, expires_at)

-- KPI and Metrics
kpi_sources (id, business_id, name, type, config)
kpi_data (id, source_id, timestamp, value, metadata)
forecasts (id, business_id, metric, prediction, confidence)

-- News and External Data
news_articles (id, title, content, sentiment, source, published_at)
weather_data (id, location, timestamp, temperature, conditions)
market_data (id, symbol, timestamp, price, volume)

-- Alerts and Notifications
alerts (id, business_id, metric, threshold, condition)
notifications (id, user_id, type, message, read_at)
```

**Operations**:
- Row-level security (RLS) implementation
- Real-time subscriptions for live updates
- Data archiving and cleanup jobs
- Backup and disaster recovery

---

## Background Jobs

### Job Queue System
**Technology**: Redis + Python (Dramatiq/Celery)
**Status**: 🚧 Needs Implementation

**Job Types**:

1. **News Scraping** (`scrape_news`)
   - Schedule: Every hour
   - Duration: ~5-10 minutes
   - Operations: Fetch GDELT data, process sentiment

2. **Weather Updates** (`fetch_weather`)
   - Schedule: Every 6 hours
   - Duration: ~2-3 minutes
   - Operations: Update weather data for all business locations

3. **Forecast Generation** (`run_forecasts`)
   - Schedule: Daily at 2 AM
   - Duration: ~15-30 minutes
   - Operations: Generate Prophet forecasts for all KPIs

4. **Data Cleanup** (`cleanup_old_data`)
   - Schedule: Weekly
   - Duration: ~10-15 minutes
   - Operations: Archive old data, anonymize PII

5. **Alert Processing** (`process_alerts`)
   - Schedule: Every 15 minutes
   - Duration: ~2-5 minutes
   - Operations: Check thresholds, send notifications

---

## API Endpoints

### Authentication Endpoints
```
POST /auth/register          # User registration
POST /auth/login            # User login
POST /auth/refresh          # Token refresh
POST /auth/logout           # User logout
POST /auth/reset-password   # Password reset
```

### Dashboard Endpoints
```
GET  /dashboard/metrics/{business_id}     # KPI data
GET  /dashboard/news/{business_id}        # News feed
GET  /dashboard/forecasts/{business_id}   # Forecast data
GET  /dashboard/alerts/{business_id}      # Alert configuration
POST /dashboard/alerts                    # Create alert
PUT  /dashboard/alerts/{alert_id}         # Update alert
```

### Data Management Endpoints
```
GET  /data/sources/{business_id}          # Data source list
POST /data/sources                        # Add data source
PUT  /data/sources/{source_id}            # Update data source
DELETE /data/sources/{source_id}          # Remove data source
POST /data/upload                         # CSV data upload
```

### User Management Endpoints
```
GET  /users/profile                       # User profile
PUT  /users/profile                       # Update profile
GET  /users/subscription                  # Subscription status
POST /users/upgrade                       # Upgrade subscription
```

---

## External API Integrations

### 1. GDELT 2.0 (News Data)
**Endpoint**: `https://api.gdeltproject.org/api/v2/doc/doc`
**Rate Limit**: No official limit (be respectful)
**Authentication**: None required

**Implementation Notes**:
- Use query parameters for location-based filtering
- Process sentiment using spaCy
- Cache results for 1-4 hours to reduce API calls

### 2. Open-Meteo (Weather Data)
**Endpoint**: `https://api.open-meteo.com/v1/forecast`
**Rate Limit**: 10,000 requests/day (free tier)
**Authentication**: None required

**Implementation Notes**:
- Batch requests for multiple locations
- Cache weather data for 6 hours
- Use historical data for trend analysis

### 3. GeoNames (Geocoding)
**Endpoint**: `http://api.geonames.org/`
**Rate Limit**: 1,000 requests/hour (free tier)
**Authentication**: Username required

**Implementation Notes**:
- Cache geocoding results permanently
- Use for business location validation
- Fallback to browser geolocation API

### 4. ExchangeRate-API (Currency Data)
**Endpoint**: `https://api.exchangerate-api.com/v4/latest/`
**Rate Limit**: 1,500 requests/month (free tier)
**Authentication**: None required

**Implementation Notes**:
- Update rates daily
- Cache for 24 hours
- Support major business currencies

---

## Security & Compliance

### Data Protection
- JWT tokens with short expiration (15 minutes)
- Refresh token rotation
- API rate limiting per user/IP
- Input validation and sanitization
- SQL injection prevention (parameterized queries)

### Privacy Compliance
- Row-level security (RLS) in database
- Data anonymization for analytics
- User data export functionality
- Right to deletion implementation
- Audit logging for data access

### Monitoring & Logging
- Request/response logging
- Error tracking and alerting
- Performance monitoring
- Security event logging
- Health check endpoints

---

## Development Setup

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://..."
export REDIS_URL="redis://localhost:6379"
export JWT_SECRET="your-secret-key"

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Testing
```bash
# Run tests
pytest tests/ -v

# Run with coverage
pytest --cov=backend tests/

# Run specific test file
pytest tests/test_dashboard.py -v
```

### Deployment
```bash
# Build Docker image
docker build -t signalcraft-backend .

# Run container
docker run -p 8000:8000 signalcraft-backend
```

---

## Performance Considerations

### Optimization Strategies
- Database query optimization with indexes
- Redis caching for frequently accessed data
- Async/await for I/O operations
- Connection pooling for database
- Background job processing for heavy operations

### Scaling Considerations
- Horizontal scaling with load balancers
- Database read replicas for analytics
- CDN for static assets
- Microservice architecture for large scale
- Auto-scaling based on CPU/memory usage

---

## Error Handling

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

---

## TODO: Critical Implementation Items

### High Priority
1. **Supabase Integration**: Database connection and schema setup
2. **JWT Authentication**: Complete security implementation
3. **External API Services**: GDELT, weather, geocoding integration
4. **Background Jobs**: Redis queue and job processing
5. **Real-time Updates**: WebSocket/SSE implementation

### Medium Priority
1. **ML Pipeline**: Prophet forecasting and sentiment analysis
2. **Alert System**: Threshold monitoring and notifications
3. **Data Export**: PDF and Excel generation
4. **API Documentation**: OpenAPI/Swagger setup
5. **Testing Suite**: Unit and integration tests

### Low Priority
1. **Performance Optimization**: Caching and query optimization
2. **Monitoring**: Logging and metrics collection
3. **Documentation**: API documentation and guides
4. **Security Audit**: Penetration testing and vulnerability assessment
5. **Deployment**: Production deployment and CI/CD pipeline