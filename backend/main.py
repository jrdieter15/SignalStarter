from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import json

app = FastAPI(title="SignalCraft API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data for the dashboard
@app.get("/api/kpi-data")
async def get_kpi_data():
    return {
        "kpis": [
            {
                "title": "Total Revenue",
                "value": 24750,
                "unit": "$",
                "change": 12.5,
                "trend": "up"
            },
            {
                "title": "New Customers",
                "value": 156,
                "change": -3.2,
                "trend": "down"
            },
            {
                "title": "Orders",
                "value": 89,
                "change": 8.1,
                "trend": "up"
            },
            {
                "title": "Avg Order Value",
                "value": 278,
                "unit": "$",
                "change": 5.4,
                "trend": "up"
            }
        ]
    }

@app.get("/api/chart-data")
async def get_chart_data():
    return {
        "revenue": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            "datasets": [
                {
                    "label": "Revenue",
                    "data": [12000, 19000, 15000, 25000, 22000, 30000, 24750],
                    "borderColor": "#4f46e5",
                    "backgroundColor": "rgba(79, 70, 229, 0.1)",
                    "fill": True
                }
            ]
        },
        "orders": {
            "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "datasets": [
                {
                    "label": "Orders",
                    "data": [12, 19, 15, 25, 22, 30, 28],
                    "borderColor": "#f59e0b",
                    "backgroundColor": "rgba(245, 158, 11, 0.1)"
                }
            ]
        }
    }

@app.get("/api/alerts")
async def get_alerts():
    return {
        "alerts": [
            {
                "id": 1,
                "type": "warning",
                "title": "Revenue below target",
                "message": "Daily revenue is 15% below your target of $1,000",
                "time": "2 hours ago"
            },
            {
                "id": 2,
                "type": "info",
                "title": "New forecast available",
                "message": "Your 30-day revenue forecast has been updated",
                "time": "4 hours ago"
            }
        ]
    }

@app.get("/api/news")
async def get_news():
    return {
        "news": [
            {
                "id": 1,
                "title": "Local Business Growth Trends Show Positive Outlook",
                "summary": "Recent analysis indicates strong growth potential for small businesses in the retail sector...",
                "sentiment": "positive",
                "relevance": 85,
                "time": "1 hour ago"
            },
            {
                "id": 2,
                "title": "Supply Chain Disruptions May Impact Q2 Performance",
                "summary": "Industry experts warn of potential delays that could affect inventory levels...",
                "sentiment": "negative",
                "relevance": 72,
                "time": "3 hours ago"
            }
        ]
    }

# Serve static files
static_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/static", StaticFiles(directory=os.path.join(static_dir, "static")), name="static")

@app.get("/", response_class=FileResponse)
async def read_index():
    return FileResponse(os.path.join(static_dir, "index.html"))

@app.get("/dashboard", response_class=FileResponse)
async def read_dashboard():
    return FileResponse(os.path.join(static_dir, "dashboard.html"))

@app.get("/login", response_class=FileResponse)
async def read_login():
    return FileResponse(os.path.join(static_dir, "login.html"))

@app.get("/")
async def root():
    return {"message": "SignalCraft API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)