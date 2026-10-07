from fastapi import APIRouter, Request, UploadFile, File, Depends
from models import JSONIngestRequest
from auth import get_current_user
from controllers.ingest_controller import process_json_ingest, process_xml_ingest, process_csv_ingest

router = APIRouter(tags=["Ingestion"])

@router.post("/ingest/json")
async def ingest_json(request: JSONIngestRequest, current_user: str = Depends(get_current_user)):
    return process_json_ingest(request)

@router.post("/ingest/xml")
async def ingest_xml(request: Request):
    body = await request.body()
    return await process_xml_ingest(body)

@router.post("/ingest/csv")
async def ingest_csv(file: UploadFile = File(...)):
    content = await file.read()
    return await process_csv_ingest(content)
