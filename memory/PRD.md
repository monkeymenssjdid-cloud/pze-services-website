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
- **Backend**: FastAPI, Python (planned)
- **Database**: MongoDB (planned)
- **Email**: Nodemailer/SMTP integration (planned)

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

---

## Prioritized Backlog

### P0 Features (Next Phase - Backend Development)
1. **Quote Form Backend**
   - Save quote requests to MongoDB
   - Send email notifications to Ricardo and Edgar
   - Email integration (Nodemailer with SMTP)
   - File upload handling for optional photos

2. **Reviews Backend**
   - Save submitted reviews to database
   - Admin approval system for reviews
   - Display only approved reviews on frontend
   - Rating system (5-star display)

3. **Email Integration**
   - Configure SMTP credentials (Gmail, SendGrid, or similar)
   - Email templates for quote requests
   - Auto-reply confirmation emails to customers

### P1 Features (Enhancement Phase)
1. **Admin Dashboard**
   - View all quote requests
   - Approve/reject reviews
   - Manage gallery photos
   - View customer inquiries

2. **Real Photo Gallery**
   - Replace placeholder images with actual work photos
   - Upload functionality for new photos
   - Photo categories (moving, junk hauling, yard work)

3. **Analytics & Tracking**
   - Track quote request submissions
   - Monitor most requested services
   - Page view analytics

### P2 Features (Future Enhancements)
1. **Online Booking System**
   - Calendar availability
   - Service scheduling
   - Pricing calculator

2. **SMS Notifications**
   - Send SMS alerts for new quote requests
   - Customer confirmations via SMS

3. **Before/After Photo Comparisons**
   - Slider component for work showcase
   - Enhanced visual proof of service quality

---

## API Contracts (Planned)

### Quote Endpoints
```
POST /api/quotes
Body: { name, phone, service, customService?, address, description, photo? }
Response: { success, message, quoteId }

GET /api/quotes (admin only)
Response: { quotes: [...] }
```

### Review Endpoints
```
POST /api/reviews
Body: { name, location?, review }
Response: { success, message }

GET /api/reviews
Response: { reviews: [...approved reviews] }

PUT /api/reviews/:id/approve (admin only)
Response: { success, message }
```

### Email Integration
```
POST /api/send-quote-email
Body: { quoteData, recipientEmails }
Response: { success, message }
```

---

## Next Action Items
1. **Build Backend API**
   - Create MongoDB models for quotes and reviews
   - Implement CRUD endpoints
   - Set up email service integration

2. **Email Configuration**
   - Gather SMTP credentials from client
   - Configure email templates
   - Test email delivery

3. **Frontend-Backend Integration**
   - Replace mock data with API calls
   - Update forms to submit to backend
   - Add loading states and error handling

4. **Replace Placeholder Photos**
   - Collect actual work photos from PZE
   - Optimize images for web
   - Update gallery with real photos

5. **Testing**
   - End-to-end testing of quote form
   - Review submission and approval flow
   - Email delivery testing
   - Mobile responsiveness verification

---

## Notes
- Quote form is MOCKED (frontend only) - saves to browser localStorage
- Reviews are MOCKED (3 sample reviews displayed)
- Email integration NOT YET IMPLEMENTED
- Gallery uses stock placeholder images
- All interactive elements (buttons, forms, navigation) are fully functional on frontend
