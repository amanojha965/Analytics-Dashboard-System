from typing import Optional
from fastapi import APIRouter, Depends
from auth import get_current_user
from controllers.analytics_controller import generate_analytics_summary

router = APIRouter(tags=["Analytics"])

@router.get("/analytics/summary")
async def get_analytics_summary(
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    category: Optional[str] = None,
    deliveryStatus: Optional[str] = None,
    page: int = 1,
    limit: int = 50,
    current_user: str = Depends(get_current_user)
):
    return await generate_analytics_summary(
        startDate=startDate,
        endDate=endDate,
        category=category,
        deliveryStatus=deliveryStatus,
        page=page,
        limit=limit
    )
