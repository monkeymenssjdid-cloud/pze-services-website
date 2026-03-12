from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
import shutil

# Import models and services
from models import (
    Quote, QuoteCreate, Review, ReviewCreate,
    create_quote, get_all_quotes, get_quote_by_id, update_quote_status,
    create_review, get_approved_reviews, get_all_reviews, approve_review, delete_review,
    init_db
)
from email_service import email_service

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize database in models
init_db(db)

# Create upload directory
UPLOAD_DIR = Path("/app/backend/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Create the main app without a prefix
app = FastAPI(title="PZE Services API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ QUOTE ENDPOINTS ============

@api_router.post("/quotes", response_model=Quote)
async def submit_quote(
    background_tasks: BackgroundTasks,
    name: str = Form(...),
    phone: str = Form(...),
    service: str = Form(...),
    address: str = Form(...),
    description: str = Form(...),
    custom_service: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None)
):
    """Submit a new quote request"""
    try:
        # Prepare quote data
        quote_data = {
            "name": name,
            "phone": phone,
            "service": service,
            "custom_service": custom_service,
            "address": address,
            "description": description
        }
        
        # Handle photo upload if provided
        if photo and photo.filename:
            file_extension = Path(photo.filename).suffix
            unique_filename = f"{name.replace(' ', '_')}_{os.urandom(8).hex()}{file_extension}"
            file_path = UPLOAD_DIR / unique_filename
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(photo.file, buffer)
            
            quote_data["photo_filename"] = unique_filename
            logger.info(f"Photo uploaded: {unique_filename}")
        
        # Create quote in database
        quote = await create_quote(quote_data)
        
        # Send email notification in background
        recipient_email = os.getenv('NOTIFICATION_EMAIL', 'supercellnewacc1@outlook.com')
        email_data = quote.dict()
        email_data['created_at'] = email_data['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        
        background_tasks.add_task(
            email_service.send_quote_notification,
            email_data,
            recipient_email
        )
        
        logger.info(f"Quote created: {quote.id}")
        return quote
        
    except Exception as e:
        logger.error(f"Error creating quote: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to submit quote: {str(e)}")

@api_router.get("/quotes", response_model=List[Quote])
async def list_quotes():
    """Get all quote requests (admin endpoint)"""
    try:
        quotes = await get_all_quotes()
        return quotes
    except Exception as e:
        logger.error(f"Error fetching quotes: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch quotes")

@api_router.get("/quotes/{quote_id}", response_model=Quote)
async def get_quote(quote_id: str):
    """Get a specific quote by ID"""
    quote = await get_quote_by_id(quote_id)
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    return quote

@api_router.put("/quotes/{quote_id}/status")
async def update_quote(quote_id: str, status: str):
    """Update quote status (admin endpoint)"""
    valid_statuses = ["pending", "contacted", "completed"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    success = await update_quote_status(quote_id, status)
    if not success:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    return {"success": True, "message": "Quote status updated"}

# ============ REVIEW ENDPOINTS ============

@api_router.post("/reviews", response_model=Review)
async def submit_review(
    background_tasks: BackgroundTasks,
    review_data: ReviewCreate
):
    """Submit a new review (pending approval)"""
    try:
        review = await create_review(review_data.dict())
        
        # Send notification email in background
        recipient_email = os.getenv('NOTIFICATION_EMAIL', 'supercellnewacc1@outlook.com')
        email_data = review.dict()
        
        background_tasks.add_task(
            email_service.send_review_notification,
            email_data,
            recipient_email
        )
        
        logger.info(f"Review created: {review.id}")
        return review
        
    except Exception as e:
        logger.error(f"Error creating review: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit review")

@api_router.get("/reviews", response_model=List[Review])
async def list_reviews():
    """Get all approved reviews (public endpoint)"""
    try:
        reviews = await get_approved_reviews()
        return reviews
    except Exception as e:
        logger.error(f"Error fetching reviews: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch reviews")

@api_router.get("/reviews/all", response_model=List[Review])
async def list_all_reviews():
    """Get all reviews including pending (admin endpoint)"""
    try:
        reviews = await get_all_reviews()
        return reviews
    except Exception as e:
        logger.error(f"Error fetching all reviews: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch reviews")

@api_router.put("/reviews/{review_id}/approve")
async def approve_review_endpoint(review_id: str):
    """Approve a review (admin endpoint)"""
    success = await approve_review(review_id)
    if not success:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return {"success": True, "message": "Review approved"}

@api_router.delete("/reviews/{review_id}")
async def delete_review_endpoint(review_id: str):
    """Delete a review (admin endpoint)"""
    success = await delete_review(review_id)
    if not success:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return {"success": True, "message": "Review deleted"}

# ============ HEALTH CHECK ============

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "PZE Services API",
        "database": "connected"
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
