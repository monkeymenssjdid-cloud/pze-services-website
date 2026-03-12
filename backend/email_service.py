import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp-mail.outlook.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_username = os.getenv('SMTP_USERNAME', '')
        self.smtp_password = os.getenv('SMTP_PASSWORD', '')
        self.from_email = os.getenv('FROM_EMAIL', self.smtp_username)
        
    def send_email(self, to_email: str, subject: str, html_content: str, attachment_path: Optional[str] = None) -> bool:
        """Send an email using SMTP"""
        try:
            # Create message
            message = MIMEMultipart('alternative')
            message['From'] = self.from_email
            message['To'] = to_email
            message['Subject'] = subject
            
            # Add HTML content
            html_part = MIMEText(html_content, 'html')
            message.attach(html_part)
            
            # Add attachment if provided
            if attachment_path and os.path.exists(attachment_path):
                with open(attachment_path, 'rb') as attachment:
                    part = MIMEBase('application', 'octet-stream')
                    part.set_payload(attachment.read())
                    encoders.encode_base64(part)
                    part.add_header(
                        'Content-Disposition',
                        f'attachment; filename= {os.path.basename(attachment_path)}'
                    )
                    message.attach(part)
            
            # Connect to SMTP server and send
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                if self.smtp_username and self.smtp_password:
                    server.login(self.smtp_username, self.smtp_password)
                server.send_message(message)
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    def send_quote_notification(self, quote_data: dict, recipient_email: str) -> bool:
        """Send quote request notification email"""
        subject = f"New Quote Request from {quote_data['name']}"
        
        service_info = quote_data['service']
        if quote_data.get('custom_service'):
            service_info += f" - {quote_data['custom_service']}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
                    <div style="background-color: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                        <h2 style="margin: 0;">New Quote Request - PZE Services</h2>
                    </div>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
                        <h3 style="color: #059669; margin-top: 0;">Customer Information</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 150px;">Name:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">{quote_data['name']}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                                    <a href="tel:{quote_data['phone']}" style="color: #059669; text-decoration: none;">{quote_data['phone']}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Service Needed:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">{service_info}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Address:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">{quote_data['address']}</td>
                            </tr>
                        </table>
                        
                        <h3 style="color: #059669; margin-top: 30px;">Job Description</h3>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #059669;">
                            <p style="margin: 0;">{quote_data['description']}</p>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
                            <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                                This quote request was submitted through the PZE Services website
                            </p>
                            <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                                Submitted on: {quote_data.get('created_at', 'N/A')}
                            </p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
        """
        
        return self.send_email(recipient_email, subject, html_content)
    
    def send_review_notification(self, review_data: dict, recipient_email: str) -> bool:
        """Send new review notification to admin"""
        subject = f"New Review Submitted - {review_data['name']}"
        
        location_info = review_data.get('location', 'Not specified')
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
                    <div style="background-color: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                        <h2 style="margin: 0;">New Review Pending Approval</h2>
                    </div>
                    
                    <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
                        <h3 style="color: #3b82f6; margin-top: 0;">Review Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 150px;">Reviewer:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">{review_data['name']}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Location:</td>
                                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">{location_info}</td>
                            </tr>
                        </table>
                        
                        <h3 style="color: #3b82f6; margin-top: 30px;">Review Content</h3>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #3b82f6;">
                            <p style="margin: 0;">"{review_data['review']}"</p>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
                            <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                                This review is pending approval. Please review and approve/reject through the admin panel.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
        """
        
        return self.send_email(recipient_email, subject, html_content)

# Initialize email service
email_service = EmailService()
