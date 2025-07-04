# SignalCraft Database Schemas

## Overview
This document defines the complete database schema for SignalCraft, including tables, relationships, indexes, and Row Level Security (RLS) policies for Supabase PostgreSQL.

---

## Schema Design Principles

### Multi-Tenancy
- All business data isolated by `business_id`
- Row Level Security (RLS) enforced on all tables
- Users can belong to multiple businesses (Enterprise)

### Data Retention
- Soft deletes for user data (GDPR compliance)
- Automatic archiving of old metrics (>1 year)
- Anonymization of PII after account deletion

### Performance
- Optimized indexes for time-series queries
- Partitioning for large tables (metrics, news)
- Materialized views for dashboard aggregations

---

## Core Tables

### 1. Authentication & Users

#### `auth.users` (Supabase Built-in)
```sql
-- Managed by Supabase Auth
id                uuid PRIMARY KEY
email             text UNIQUE NOT NULL
encrypted_password text
email_confirmed_at timestamptz
created_at        timestamptz DEFAULT now()
updated_at        timestamptz DEFAULT now()
```

#### `public.user_profiles`
```sql
CREATE TABLE user_profiles (
  id               uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name        text,
  avatar_url       text,
  timezone         text DEFAULT 'UTC',
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  trial_ends_at    timestamptz,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

#### `public.businesses`
```sql
CREATE TABLE businesses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  industry    text,
  description text,
  location    jsonb, -- {city, country, lat, lng, timezone}
  settings    jsonb DEFAULT '{}', -- Dashboard preferences, etc.
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX idx_businesses_industry ON businesses(industry);

-- RLS Policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own businesses"
  ON businesses FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can manage own businesses"
  ON businesses FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());
```

#### `public.business_members` (Enterprise)
```sql
CREATE TABLE business_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  invited_by  uuid REFERENCES auth.users(id),
  invited_at  timestamptz DEFAULT now(),
  joined_at   timestamptz,
  
  UNIQUE(business_id, user_id)
);

-- RLS Policies
ALTER TABLE business_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view business membership"
  ON business_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR business_id IN (
    SELECT business_id FROM business_members WHERE user_id = auth.uid()
  ));
```

---

## KPI & Metrics Tables

#### `public.kpi_sources`
```sql
CREATE TABLE kpi_sources (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name        text NOT NULL,
  type        text NOT NULL CHECK (type IN ('revenue', 'customers', 'orders', 'traffic', 'custom')),
  unit        text, -- '$', 'count', '%', etc.
  config      jsonb DEFAULT '{}', -- API endpoints, calculation rules, etc.
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_kpi_sources_business_id ON kpi_sources(business_id);
CREATE INDEX idx_kpi_sources_type ON kpi_sources(type);

-- RLS Policies
ALTER TABLE kpi_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business members can view KPI sources"
  ON kpi_sources FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
    UNION
    SELECT business_id FROM business_members WHERE user_id = auth.uid()
  ));
```

#### `public.kpi_data`
```sql
CREATE TABLE kpi_data (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id   uuid NOT NULL REFERENCES kpi_sources(id) ON DELETE CASCADE,
  timestamp   timestamptz NOT NULL,
  value       decimal NOT NULL,
  metadata    jsonb DEFAULT '{}', -- Additional context, tags, etc.
  created_at  timestamptz DEFAULT now()
);

-- Indexes for time-series queries
CREATE INDEX idx_kpi_data_source_timestamp ON kpi_data(source_id, timestamp DESC);
CREATE INDEX idx_kpi_data_timestamp ON kpi_data(timestamp DESC);

-- Partitioning by month (for large datasets)
-- CREATE TABLE kpi_data_y2025m01 PARTITION OF kpi_data
-- FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- RLS Policies
ALTER TABLE kpi_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business members can view KPI data"
  ON kpi_data FOR SELECT
  TO authenticated
  USING (source_id IN (
    SELECT ks.id FROM kpi_sources ks
    JOIN businesses b ON ks.business_id = b.id
    WHERE b.owner_id = auth.uid()
    OR ks.business_id IN (
      SELECT business_id FROM business_members WHERE user_id = auth.uid()
    )
  ));
```

---

## Forecasting & Analytics

#### `public.forecasts`
```sql
CREATE TABLE forecasts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  source_id   uuid NOT NULL REFERENCES kpi_sources(id) ON DELETE CASCADE,
  model_type  text DEFAULT 'prophet' CHECK (model_type IN ('prophet', 'linear', 'arima')),
  forecast_date timestamptz NOT NULL,
  predicted_value decimal NOT NULL,
  confidence_lower decimal,
  confidence_upper decimal,
  model_accuracy decimal, -- R² or similar metric
  generated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_forecasts_business_source ON forecasts(business_id, source_id);
CREATE INDEX idx_forecasts_date ON forecasts(forecast_date DESC);

-- RLS Policies
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business members can view forecasts"
  ON forecasts FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
    UNION
    SELECT business_id FROM business_members WHERE user_id = auth.uid()
  ));
```

#### `public.anomalies`
```sql
CREATE TABLE anomalies (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  source_id   uuid NOT NULL REFERENCES kpi_sources(id) ON DELETE CASCADE,
  timestamp   timestamptz NOT NULL,
  actual_value decimal NOT NULL,
  expected_value decimal NOT NULL,
  deviation_score decimal NOT NULL, -- How many standard deviations
  severity    text CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  acknowledged_at timestamptz,
  acknowledged_by uuid REFERENCES auth.users(id),
  created_at  timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_anomalies_business_timestamp ON anomalies(business_id, timestamp DESC);
CREATE INDEX idx_anomalies_severity ON anomalies(severity);

-- RLS Policies
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business members can view anomalies"
  ON anomalies FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
    UNION
    SELECT business_id FROM business_members WHERE user_id = auth.uid()
  ));
```

---

## External Data Tables

#### `public.news_articles`
```sql
CREATE TABLE news_articles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  content     text,
  summary     text,
  url         text UNIQUE,
  source      text NOT NULL,
  author      text,
  published_at timestamptz NOT NULL,
  location    jsonb, -- {country, region, city}
  keywords    text[], -- Array of relevant keywords
  sentiment_score decimal, -- -1 to 1 (negative to positive)
  sentiment_label text CHECK (sentiment_label IN ('negative', 'neutral', 'positive')),
  relevance_score decimal, -- 0 to 1 (how relevant to business)
  language    text DEFAULT 'en',
  created_at  timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_news_published_at ON news_articles(published_at DESC);
CREATE INDEX idx_news_location ON news_articles USING GIN(location);
CREATE INDEX idx_news_keywords ON news_articles USING GIN(keywords);
CREATE INDEX idx_news_sentiment ON news_articles(sentiment_score);

-- Full-text search
CREATE INDEX idx_news_search ON news_articles USING GIN(to_tsvector('english', title || ' ' || COALESCE(content, '')));

-- RLS Policies (News is generally public, but filtered by relevance)
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view news"
  ON news_articles FOR SELECT
  TO authenticated
  USING (true);
```

#### `public.weather_data`
```sql
CREATE TABLE weather_data (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location    jsonb NOT NULL, -- {city, country, lat, lng}
  timestamp   timestamptz NOT NULL,
  temperature decimal, -- Celsius
  humidity    decimal, -- Percentage
  pressure    decimal, -- hPa
  wind_speed  decimal, -- km/h
  conditions  text, -- 'sunny', 'rainy', 'cloudy', etc.
  visibility  decimal, -- km
  uv_index    decimal,
  created_at  timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_weather_location_timestamp ON weather_data USING GIN(location), timestamp DESC;
CREATE INDEX idx_weather_timestamp ON weather_data(timestamp DESC);

-- RLS Policies
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view weather"
  ON weather_data FOR SELECT
  TO authenticated
  USING (true);
```

#### `public.market_data`
```sql
CREATE TABLE market_data (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol      text NOT NULL, -- 'USD/EUR', 'BTC/USD', etc.
  timestamp   timestamptz NOT NULL,
  price       decimal NOT NULL,
  volume      decimal,
  change_24h  decimal, -- Percentage change
  market_cap  decimal,
  source      text DEFAULT 'exchangerate-api',
  created_at  timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_market_symbol_timestamp ON market_data(symbol, timestamp DESC);

-- RLS Policies
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view market data"
  ON market_data FOR SELECT
  TO authenticated
  USING (true);
```

---

## Alerts & Notifications

#### `public.alerts`
```sql
CREATE TABLE alerts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  source_id   uuid NOT NULL REFERENCES kpi_sources(id) ON DELETE CASCADE,
  name        text NOT NULL,
  condition   text NOT NULL CHECK (condition IN ('above', 'below', 'change_percent', 'anomaly')),
  threshold   decimal,
  timeframe   text DEFAULT '1h' CHECK (timeframe IN ('5m', '15m', '1h', '6h', '24h')),
  is_active   boolean DEFAULT true,
  last_triggered timestamptz,
  created_by  uuid NOT NULL REFERENCES auth.users(id),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_alerts_business_id ON alerts(business_id);
CREATE INDEX idx_alerts_source_id ON alerts(source_id);
CREATE INDEX idx_alerts_active ON alerts(is_active) WHERE is_active = true;

-- RLS Policies
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business members can manage alerts"
  ON alerts FOR ALL
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
    UNION
    SELECT business_id FROM business_members WHERE user_id = auth.uid()
  ));
```

#### `public.notifications`
```sql
CREATE TABLE notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  alert_id    uuid REFERENCES alerts(id) ON DELETE SET NULL,
  type        text NOT NULL CHECK (type IN ('alert', 'system', 'billing', 'feature')),
  title       text NOT NULL,
  message     text NOT NULL,
  data        jsonb DEFAULT '{}', -- Additional context
  read_at     timestamptz,
  created_at  timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());
```

---

## Subscription & Billing

#### `public.subscriptions`
```sql
CREATE TABLE subscriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  tier            text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_start     timestamptz,
  trial_end       timestamptz,
  canceled_at     timestamptz,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
```

#### `public.usage_tracking`
```sql
CREATE TABLE usage_tracking (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  metric      text NOT NULL, -- 'api_calls', 'data_sources', 'forecasts', etc.
  value       integer NOT NULL DEFAULT 1,
  period      text NOT NULL, -- '2025-01' for monthly tracking
  created_at  timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_usage_user_period ON usage_tracking(user_id, period, metric);

-- RLS Policies
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
```

---

## System Tables

#### `public.api_keys`
```sql
CREATE TABLE api_keys (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name        text NOT NULL,
  key_hash    text NOT NULL UNIQUE, -- Hashed API key
  permissions text[] DEFAULT '{"read"}', -- Array of permissions
  last_used_at timestamptz,
  expires_at  timestamptz,
  created_by  uuid NOT NULL REFERENCES auth.users(id),
  created_at  timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business members can manage API keys"
  ON api_keys FOR ALL
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
    UNION
    SELECT business_id FROM business_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));
```

#### `public.audit_logs`
```sql
CREATE TABLE audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id),
  business_id uuid REFERENCES businesses(id),
  action      text NOT NULL, -- 'create', 'update', 'delete', 'view'
  resource    text NOT NULL, -- 'kpi_source', 'alert', 'user', etc.
  resource_id uuid,
  details     jsonb DEFAULT '{}',
  ip_address  inet,
  user_agent  text,
  created_at  timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_business_id ON audit_logs(business_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- RLS Policies
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE owner_id = auth.uid()
    UNION
    SELECT business_id FROM business_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));
```

---

## Views & Functions

#### Materialized View: Dashboard Summary
```sql
CREATE MATERIALIZED VIEW dashboard_summary AS
SELECT 
  b.id as business_id,
  b.name as business_name,
  COUNT(DISTINCT ks.id) as total_kpi_sources,
  COUNT(DISTINCT CASE WHEN kd.timestamp >= NOW() - INTERVAL '24 hours' THEN kd.id END) as recent_data_points,
  COUNT(DISTINCT CASE WHEN a.is_active = true THEN a.id END) as active_alerts,
  MAX(kd.timestamp) as last_data_update
FROM businesses b
LEFT JOIN kpi_sources ks ON b.id = ks.business_id
LEFT JOIN kpi_data kd ON ks.id = kd.source_id
LEFT JOIN alerts a ON b.id = a.business_id
GROUP BY b.id, b.name;

-- Refresh schedule (run daily)
CREATE INDEX idx_dashboard_summary_business_id ON dashboard_summary(business_id);
```

#### Function: Get Business KPI Summary
```sql
CREATE OR REPLACE FUNCTION get_business_kpi_summary(
  p_business_id uuid,
  p_timeframe text DEFAULT '7d'
)
RETURNS TABLE (
  source_id uuid,
  source_name text,
  current_value decimal,
  previous_value decimal,
  change_percent decimal,
  trend text
) AS $$
BEGIN
  RETURN QUERY
  WITH current_data AS (
    SELECT DISTINCT ON (kd.source_id)
      kd.source_id,
      kd.value as current_value,
      kd.timestamp
    FROM kpi_data kd
    JOIN kpi_sources ks ON kd.source_id = ks.id
    WHERE ks.business_id = p_business_id
    ORDER BY kd.source_id, kd.timestamp DESC
  ),
  previous_data AS (
    SELECT DISTINCT ON (kd.source_id)
      kd.source_id,
      kd.value as previous_value
    FROM kpi_data kd
    JOIN kpi_sources ks ON kd.source_id = ks.id
    WHERE ks.business_id = p_business_id
      AND kd.timestamp <= NOW() - CASE 
        WHEN p_timeframe = '1d' THEN INTERVAL '1 day'
        WHEN p_timeframe = '7d' THEN INTERVAL '7 days'
        WHEN p_timeframe = '30d' THEN INTERVAL '30 days'
        ELSE INTERVAL '7 days'
      END
    ORDER BY kd.source_id, kd.timestamp DESC
  )
  SELECT 
    ks.id,
    ks.name,
    cd.current_value,
    pd.previous_value,
    CASE 
      WHEN pd.previous_value > 0 THEN 
        ((cd.current_value - pd.previous_value) / pd.previous_value * 100)
      ELSE NULL
    END as change_percent,
    CASE 
      WHEN cd.current_value > pd.previous_value THEN 'up'
      WHEN cd.current_value < pd.previous_value THEN 'down'
      ELSE 'stable'
    END as trend
  FROM kpi_sources ks
  LEFT JOIN current_data cd ON ks.id = cd.source_id
  LEFT JOIN previous_data pd ON ks.id = pd.source_id
  WHERE ks.business_id = p_business_id
    AND ks.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Data Migration Scripts

#### Initial Data Setup
```sql
-- Insert default KPI source types
INSERT INTO kpi_sources (business_id, name, type, unit, config) VALUES
-- These will be created per business during onboarding
-- Example for a retail business:
-- (business_uuid, 'Daily Revenue', 'revenue', '$', '{"aggregation": "sum"}'),
-- (business_uuid, 'Customer Count', 'customers', 'count', '{"aggregation": "count"}'),
-- (business_uuid, 'Average Order Value', 'revenue', '$', '{"aggregation": "avg"}');
```

#### Sample Data for Development
```sql
-- Create sample business for testing
INSERT INTO businesses (id, owner_id, name, industry, location) VALUES
('550e8400-e29b-41d4-a716-446655440000', auth.uid(), 'Sample Coffee Shop', 'food_beverage', 
 '{"city": "San Francisco", "country": "USA", "lat": 37.7749, "lng": -122.4194, "timezone": "America/Los_Angeles"}');

-- Create sample KPI sources
INSERT INTO kpi_sources (business_id, name, type, unit) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Daily Revenue', 'revenue', '$'),
('550e8400-e29b-41d4-a716-446655440000', 'Customer Count', 'customers', 'count'),
('550e8400-e29b-41d4-a716-446655440000', 'Average Order Value', 'revenue', '$');
```

---

## Performance Optimization

### Indexes Strategy
```sql
-- Time-series optimized indexes
CREATE INDEX CONCURRENTLY idx_kpi_data_time_series 
ON kpi_data (source_id, timestamp DESC) 
INCLUDE (value);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_news_location_time 
ON news_articles (location, published_at DESC) 
WHERE sentiment_score IS NOT NULL;

-- Partial indexes for active records
CREATE INDEX CONCURRENTLY idx_alerts_active_business 
ON alerts (business_id, source_id) 
WHERE is_active = true;
```

### Table Partitioning (for large datasets)
```sql
-- Partition kpi_data by month
CREATE TABLE kpi_data_y2025m01 PARTITION OF kpi_data
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE kpi_data_y2025m02 PARTITION OF kpi_data
FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Auto-create partitions with pg_partman extension
```

---

## Backup & Recovery

### Backup Strategy
```sql
-- Daily full backup
pg_dump signalcraft_db > backup_$(date +%Y%m%d).sql

-- Continuous WAL archiving for point-in-time recovery
-- Configured in postgresql.conf:
-- wal_level = replica
-- archive_mode = on
-- archive_command = 'cp %p /backup/wal/%f'
```

### Data Retention Policies
```sql
-- Archive old KPI data (keep 2 years)
CREATE OR REPLACE FUNCTION archive_old_kpi_data()
RETURNS void AS $$
BEGIN
  DELETE FROM kpi_data 
  WHERE timestamp < NOW() - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql;

-- Schedule with pg_cron
SELECT cron.schedule('archive-kpi-data', '0 2 1 * *', 'SELECT archive_old_kpi_data();');
```

---

## Security Considerations

### Row Level Security (RLS)
- All tables have RLS enabled
- Policies ensure users only access their business data
- Service role bypasses RLS for system operations

### Data Encryption
- All sensitive data encrypted at rest (Supabase default)
- API keys stored as hashed values
- PII anonymization for analytics

### Audit Trail
- All data modifications logged in audit_logs
- IP address and user agent tracking
- Retention policy for compliance

---

## TODO: Implementation Checklist

### Phase 1: Core Tables
- [ ] Create user_profiles table with RLS
- [ ] Create businesses table with RLS
- [ ] Create kpi_sources and kpi_data tables
- [ ] Set up basic indexes and constraints

### Phase 2: External Data
- [ ] Create news_articles table with full-text search
- [ ] Create weather_data and market_data tables
- [ ] Set up partitioning for large tables

### Phase 3: Advanced Features
- [ ] Create forecasts and anomalies tables
- [ ] Create alerts and notifications system
- [ ] Implement audit logging

### Phase 4: Enterprise Features
- [ ] Create business_members for multi-user access
- [ ] Create api_keys for external integrations
- [ ] Set up usage tracking and billing tables

### Phase 5: Optimization
- [ ] Create materialized views for dashboards
- [ ] Implement stored procedures for complex queries
- [ ] Set up automated backup and archiving