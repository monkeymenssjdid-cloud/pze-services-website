# PZE Services Website - Product Requirements Document

## Original Problem Statement
Build a professional website for PZE, a multi-service company in Taft, CA offering moving, junk hauling, yard cleanup, lawn maintenance, and general labor services. The website should showcase services, enable customers to request quotes, display reviews, and provide contact information.

## User Personas
1. **Homeowners in Taft, CA** - Need moving, junk hauling, or yard work services
2. **Property Managers** - Require cleanup and maintenance services for rental properties
3. **Business Owners** - Need commercial moving or junk removal services

## Core Requirements
- Professional blue-gray color scheme with emerald green accents
- Responsive design for mobile, tablet, and desktop
- Service showcase with detailed descriptions
- Photo gallery of completed work
- Quote request form with email integration
- Customer reviews system with approval workflow
- Contact information with click-to-call functionality
- Social media integration (Facebook)
- Smooth scrolling navigation

## Tech Stack
- **Frontend**: React 19, Tailwind CSS, Shadcn UI
- **Backend**: FastAPI, Python
- **Database**: MongoDB
- **Email**: Python SMTP (Outlook)

---

## Implementation History

### Phase 1: Frontend with Mock Data ✅ (December 2024)
**Completed Features:**
- ✅ Header with sticky navigation and mobile menu
- ✅ Hero section with call-to-action buttons and pricing note
- ✅ About & Services section with 7 service offerings
- ✅ Photo gallery (6 placeholder images) with lightbox
- ✅ Quote request form (frontend with form validation)
- ✅ Reviews section displaying 3 mock reviews
- ✅ Review submission form (frontend only)
- ✅ Contact section with phone numbers and service area
- ✅ Footer with quick links and social media
- ✅ Professional color scheme: slate-gray with emerald accents
- ✅ Smooth scroll navigation
- ✅ Toast notifications using Sonner
- ✅ Responsive design (mobile, tablet, desktop)

**Files Created:**
- `/app/frontend/src/mockData.js` - All mock data
- `/app/frontend/src/components/Header.jsx`
- `/app/frontend/src/components/Hero.jsx`
- `/app/frontend/src/components/About.jsx`
- `/app/frontend/src/components/Gallery.jsx`
- `/app/frontend/src/components/QuoteForm.jsx`
- `/app/frontend/src/components/Reviews.jsx`
- `/app/frontend/src/components/Contact.jsx`
- `/app/frontend/src/components/Footer.jsx`
- Updated `/app/frontend/src/App.js`
- Updated `/app/frontend/src/App.css`
- Updated `/app/frontend/src/index.css`

### Phase 2: Backend Development ✅ (December 2024)
**Completed Features:**
- ✅ MongoDB models for quotes and reviews
- ✅ Quote submission API with file upload support
- ✅ Review submission API with approval system
- ✅ Email notification service (SMTP)
- ✅ Admin endpoints for managing reviews and quotes
- ✅ Quote status management (pending, contacted, completed)
- ✅ Review approval/rejection workflow
- ✅ Email notifications sent to supercellnewacc1@outlook.com
- ✅ Frontend-backend integration complete
- ✅ Admin panel for managing quotes and reviews

**Files Created:**
- `/app/backend/models.py` - Database models and operations
- `/app/backend/email_service.py` - Email notification service
- `/app/frontend/src/components/AdminPanel.jsx` - Admin management interface
- Updated `/app/backend/server.py` - API endpoints
- Updated `/app/backend/.env` - Email configuration

**API Endpoints Implemented:**
```
POST /api/quotes - Submit quote request
GET /api/quotes - Get all quotes (admin)
GET /api/quotes/{id} - Get specific quote
PUT /api/quotes/{id}/status - Update quote status (admin)

POST /api/reviews - Submit review
GET /api/reviews - Get approved reviews (public)
GET /api/reviews/all - Get all reviews (admin)
PUT /api/reviews/{id}/approve - Approve review (admin)
DELETE /api/reviews/{id} - Delete review (admin)

GET /api/health - Health check
```

---

## Prioritized Backlog

### P0 Features (Complete Email Setup)
1. **SMTP Credentials Configuration**
   - User needs to provide SMTP credentials for sending emails
   - Update .env with actual email credentials:
     ```
     SMTP_USERNAME=your_email@outlook.com
     SMTP_PASSWORD=your_app_password
     ```
   - Test email delivery

### P1 Features (Enhancement Phase)
1. **Real Photo Gallery**
   - Replace placeholder images with actual work photos
   - Upload functionality for new photos
   - Photo categories (moving, junk hauling, yard work)

2. **Admin Authentication**
   - Add login system for admin panel
   - Secure admin endpoints with authentication

3. **Enhanced Email Templates**
   - Add company logo to emails
   - Richer HTML templates
   - Customer confirmation emails

### P2 Features (Future Enhancements)
1. **Analytics & Tracking**
   - Track quote request submissions
   - Monitor most requested services
   - Page view analytics

2. **SMS Notifications**
   - Send SMS alerts for new quote requests
   - Customer confirmations via SMS

3. **Before/After Photo Comparisons**
   - Slider component for work showcase
   - Enhanced visual proof of service quality

---

## Email Configuration Setup

To enable email notifications, you need to configure SMTP credentials in `/app/backend/.env`:

### For Outlook/Hotmail:
1. Go to https://account.microsoft.com/security
2. Enable "App passwords"
3. Generate a new app password
4. Update .env file:
```
SMTP_USERNAME=your_email@outlook.com
SMTP_PASSWORD=generated_app_password
```

### For Gmail:
1. Enable 2-factor authentication
2. Generate app password at https://myaccount.google.com/apppasswords
3. Update .env file:
```
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=generated_app_password
```

---

## Admin Panel Access

- **URL**: https://your-app-url.com/admin
- **Features**:
  - View and manage all quote requests
  - Approve or reject customer reviews
  - Update quote status (pending → contacted → completed)
  - Delete inappropriate reviews

---

## Next Action Items
1. **Configure SMTP Credentials**
   - Get app password from email provider
   - Update .env file
   - Test email delivery

2. **Replace Placeholder Photos**
   - Collect actual work photos from PZE
   - Optimize images for web
   - Update gallery with real photos

3. **Add Admin Authentication**
   - Implement login system
   - Secure admin panel
   - Add password protection

4. **Testing & Deployment**
   - Test quote form end-to-end
   - Test review submission and approval
   - Verify email delivery
   - Mobile responsiveness testing

---

## Notes
- Email notifications configured but need SMTP credentials
- Admin panel accessible at /admin (currently no authentication)
- Quote requests are saved to database and trigger email notifications
- Reviews require approval before appearing on website
- All interactive elements fully functional
