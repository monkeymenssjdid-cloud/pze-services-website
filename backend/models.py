from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import uuid
import os

# MongoDB client will be initialized in server.py
db = None

def init_db(database):
    global db
    db = database

# Models
class Quote(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    service: str
    custom_service: Optional[str] = None
    address: str
    description: str
    photo_filename: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "pending"  # pending, contacted, completed

class QuoteCreate(BaseModel):
    name: str
    phone: str
    service: str
    custom_service: Optional[str] = None
    address: str
    description: str

class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: Optional[str] = None
    review: str
    rating: int = 5
    created_at: datetime = Field(default_factory=datetime.utcnow)
    approved: bool = False

class ReviewCreate(BaseModel):
    name: str
    location: Optional[str] = None
    review: str

# Database Operations
async def create_quote(quote_data: dict) -> Quote:
    """Create a new quote request"""
    quote = Quote(**quote_data)
    await db.quotes.insert_one(quote.dict())
    return quote

async def get_all_quotes() -> List[Quote]:
    """Get all quote requests"""
    quotes = await db.quotes.find().sort("created_at", -1).to_list(1000)
    return [Quote(**quote) for quote in quotes]

async def get_quote_by_id(quote_id: str) -> Optional[Quote]:
    """Get a specific quote by ID"""
    quote = await db.quotes.find_one({"id": quote_id})
    return Quote(**quote) if quote else None

async def update_quote_status(quote_id: str, status: str) -> bool:
    """Update quote status"""
    result = await db.quotes.update_one(
        {"id": quote_id},
        {"$set": {"status": status}}
    )
    return result.modified_count > 0

async def create_review(review_data: dict) -> Review:
    """Create a new review (pending approval)"""
    review = Review(**review_data)
    await db.reviews.insert_one(review.dict())
    return review

async def get_approved_reviews() -> List[Review]:
    """Get all approved reviews"""
    reviews = await db.reviews.find({"approved": True}).sort("created_at", -1).to_list(1000)
    return [Review(**review) for review in reviews]

async def get_all_reviews() -> List[Review]:
    """Get all reviews (including pending)"""
    reviews = await db.reviews.find().sort("created_at", -1).to_list(1000)
    return [Review(**review) for review in reviews]

async def approve_review(review_id: str) -> bool:
    """Approve a review"""
    result = await db.reviews.update_one(
        {"id": review_id},
        {"$set": {"approved": True}}
    )
    return result.modified_count > 0

async def delete_review(review_id: str) -> bool:
    """Delete a review"""
    result = await db.reviews.delete_one({"id": review_id})
    return result.deleted_count > 0
