from fastapi import APIRouter
from pydantic import BaseModel
router = APIRouter()

class MetricRequest(BaseModel):
    business_id: str

@router.post("/dashboard/metrics")
def get_metrics(payload: MetricRequest):
    return {"status": "ok", "data": {}}
