# PZE Services Website - Email Setup Guide

## Overview
Your PZE Services website is fully functional! To enable email notifications when customers submit quote requests or reviews, you need to configure SMTP credentials.

## Current Status
✅ Website is live and fully functional
✅ Quote form saves to database
✅ Reviews system with approval workflow
✅ Admin panel at /admin
✅ All backend APIs working
⚠️ Email notifications configured but need SMTP credentials

## Email Configuration Steps

### Option 1: Using Outlook Email (Recommended for you)
Since your notification email is **supercellnewacc1@outlook.com**, here's how to set it up:

1. **Get App Password from Microsoft:**
   - Go to https://account.microsoft.com/security
   - Sign in with supercellnewacc1@outlook.com
   - Click on "Advanced security options"
   - Scroll down to "App passwords"
   - Click "Create a new app password"
   - Copy the generated password (it will look like: xxxx-xxxx-xxxx-xxxx)

2. **Update Backend .env File:**
   ```bash
   # SSH into your server or use file editor
   nano /app/backend/.env
   ```

3. **Add Your Credentials:**
   ```env
   SMTP_SERVER="smtp-mail.outlook.com"
   SMTP_PORT="587"
   SMTP_USERNAME="supercellnewacc1@outlook.com"
   SMTP_PASSWORD="your-app-password-here"
   FROM_EMAIL="PZE Services <supercellnewacc1@outlook.com>"
   NOTIFICATION_EMAIL="supercellnewacc1@outlook.com"
   ```

4. **Restart Backend:**
   ```bash
   sudo supervisorctl restart backend
   ```

5. **Test Email Delivery:**
   - Submit a test quote on your website
   - Check supercellnewacc1@outlook.com inbox
   - You should receive a professional email notification

### Option 2: Using Gmail
If you prefer Gmail instead:

1. **Enable 2-Factor Authentication:**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Type "PZE Services Website"
   - Click Generate
   - Copy the 16-character password

3. **Update .env File:**
   ```env
   SMTP_SERVER="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USERNAME="your-gmail@gmail.com"
   SMTP_PASSWORD="your-16-char-app-password"
   FROM_EMAIL="PZE Services <your-gmail@gmail.com>"
   NOTIFICATION_EMAIL="supercellnewacc1@outlook.com"
   ```

4. **Restart Backend:**
   ```bash
   sudo supervisorctl restart backend
   ```

## What Happens After Email Setup

### When Customer Submits Quote Request:
1. Quote is saved to MongoDB database
2. Beautiful HTML email sent to supercellnewacc1@outlook.com with:
   - Customer name and phone number (click-to-call)
   - Service requested
   - Job address
   - Job description
   - Attached photo (if provided)

### When Customer Submits Review:
1. Review is saved to database as "pending"
2. Email notification sent to supercellnewacc1@outlook.com
3. You can approve/reject via admin panel at /admin
4. Only approved reviews appear on public website

## Admin Panel Access

**URL:** https://yard-cleanup-2.preview.emergentagent.com/admin

**Features:**
- **Reviews Management Tab:**
  - View all reviews (approved and pending)
  - Approve reviews with one click
  - Delete inappropriate reviews
  - See reviewer name and location

- **Quote Requests Tab:**
  - View all customer quote requests
  - See contact info, service type, job details
  - Update status: Pending → Contacted → Completed
  - Track your workflow

## Troubleshooting

### Emails Not Arriving?
1. Check spam/junk folder
2. Verify SMTP credentials in /app/backend/.env
3. Check backend logs: `tail -f /var/log/supervisor/backend.out.log`
4. Common errors:
   - "Authentication failed" → Wrong username/password
   - "Connection refused" → Wrong SMTP server or port
   - "TLS error" → Firewall blocking port 587

### Backend Not Restarting?
```bash
# Check status
sudo supervisorctl status

# View backend logs
tail -n 50 /var/log/supervisor/backend.err.log

# Restart all services
sudo supervisorctl restart all
```

### Test Email Without Website:
```bash
# SSH into server
cd /app/backend

# Run Python test
python3 -c "
from email_service import email_service
result = email_service.send_email(
    'supercellnewacc1@outlook.com',
    'Test Email',
    '<h1>Test Email</h1><p>If you receive this, email is working!</p>'
)
print('Email sent!' if result else 'Email failed!')
"
```

## Security Notes

- **Never share your app password publicly**
- **Never commit .env file to Git** (already in .gitignore)
- **Use app-specific passwords**, not your main account password
- **Rotate passwords periodically** for security

## Next Steps

1. ✅ Configure SMTP credentials (follow steps above)
2. ✅ Test email delivery
3. ✅ Replace placeholder photos with real work photos
4. ✅ Add authentication to admin panel (optional but recommended)
5. ✅ Update Facebook page link if needed
6. ✅ Share website with Ricardo and Edgar

## Need Help?

If emails still don't work after setup:
1. Check backend logs: `/var/log/supervisor/backend.err.log`
2. Verify .env file has correct credentials
3. Test with simple Python script above
4. Contact your hosting provider if port 587 is blocked

---

**Your website is ready to receive quote requests and reviews!**
Once you configure email, notifications will be sent automatically.
