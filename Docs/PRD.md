# SignalCraft PRD v2.1 — Comprehensive Product Requirements Document
*Last updated: January 2025*

## 1️⃣ Vision & Mission

**Mission**: Give every small-to-mid-sized business the power of a data-science team—without sacrificing privacy or adding DevOps overhead.

**Product One-liner**: *SignalCraft turns global signals and private KPIs into actionable, privacy-first insights.*

**Brand Positioning**: Trustworthy, data-driven, empowering, globally ready SaaS platform for SMBs seeking competitive intelligence.

## 2️⃣ Success Metrics (6-Month OKRs)

| Metric | Target |
|--------|--------|
| Weekly Active Businesses | **1,000** |
| Free → Pro Conversion | **≥ 5%** |
| Dashboard p95 Latency (global) | **≤ 300ms** |
| NPS ("Insight usefulness") | **≥ 45** |

## 3️⃣ Architecture Overview

```
React SPA → Vite Dev Server ────► FastAPI Backend
                                 │
         Redis (cache/jobs) ◄────┤
       PostgreSQL ◄── Supabase ──┘
```

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | **React 18 + Vite + Tailwind** | SPA with modern tooling |
| API | **FastAPI + Python** | Async, JWT authentication |
| Database | **Supabase (PostgreSQL)** | RLS, real-time subscriptions |
| Background Jobs | **Redis + Python** | Queue management, caching |
| Hosting | **Netlify (Frontend) + Backend hosting** | Edge CDN, autoscale |

## 4️⃣ Feature Matrix

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Real-time KPI cards | ✓ | ✓ | ✓ |
| Local news & trends | ✓ | ✓ | ✓ |
| Forecast (30-day) | — | ✓ | ✓ |
| Anomaly alerts | — | ✓ | ✓ |
| Custom PDF export | — | ✓ | ✓ |
| Excel builder | — | — | ✓ |
| Multi-user RBAC | — | — | ✓ |
| Private cloud | — | — | ✓ |

**Free Limits**: 3 data sources, 5k API calls/mo, 5 chat queries/day, 1 news refresh/day.

## 5️⃣ Monetization Model

| Tier | Price | Limits | Trial |
|------|-------|--------|-------|
| **Freemium** | $0 | 5k API · 3 sources | 7-day Pro trial |
| **Pro** | $29/mo · $290/yr | 30k API · 5 seats | Auto-upgrade prompts |
| **Enterprise** | $299-$799/mo | Unlimited + SLA | Sales-led |

## 6️⃣ Core Data Sources (Commercial-Free)

| API | Purpose | License |
|-----|---------|---------|
| **GDELT 2.0** | Global news | Public Domain |
| **Open-Meteo** | Weather signals | Free OSS |
| **GeoNames** | Geocoding | CC-BY |
| **exchangerate.host** | FX rates | Apache 2.0 |

## 7️⃣ User Journey

### Onboarding (Freemium)
1. **Sign up / SSO**
2. **Industry & Region** (pre-filled via geo-IP)
3. **Connect data source** or **Skip & Use Defaults**
4. **Dashboard Ready** (template loaded)
5. Tool-tips highlight Privacy Toggle & Upgrade prompts

### Upgrade to Pro
- Trigger: Exceeds limits or clicks locked features
- Stripe checkout → instant Pro features

## 8️⃣ Technical Requirements

### Frontend
- React 18 with TypeScript
- Tailwind CSS with Destilj design system
- Chart.js for data visualization
- Real-time updates via WebSocket/SSE
- Mobile-responsive design

### Backend
- FastAPI with async/await
- JWT authentication
- Row-level security
- Background job processing
- API rate limiting

### Security
- TLS everywhere
- Row-level isolation (business_id)
- JWT validation middleware
- Data anonymization jobs

## 9️⃣ Compliance & Privacy

- GDPR compliance with data anonymization
- Privacy-first architecture
- User data ownership
- Transparent data usage
- Attribution page for open data sources

## 🔟 Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| API outage | Medium | Medium | Fallback APIs, 24h cache |
| Cost spike | Medium | High | Token budgets, rate limiting |
| GDPR complaint | Low | High | RLS, anonymization, DPA |
| Development velocity | Medium | Medium | Component library, documentation |