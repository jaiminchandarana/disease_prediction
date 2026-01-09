import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage

def get_logo_path():
    # Pointing to client/src/assets/logo.jpg as requested
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) 
    return os.path.join(base_dir, 'client', 'src', 'assets', 'logo.jpg')

def send_email_smtplib(to_email, subject, html_content, logo_path=None):
    sender_email = '24mcajai005@ldce.ac.in'
    app_password = 'hewxzzsykgzcqbuj'
    
    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = to_email

    # Logo handling common logic
    logo_html = ""
    if logo_path and os.path.exists(logo_path):
         logo_cid = 'logo_img'
         with open(logo_path, 'rb') as f:
             logo_data = f.read()
         image = MIMEImage(logo_data)
         image.add_header('Content-ID', f'<{logo_cid}>')
         msg.attach(image)
         logo_html = f'<img src="cid:{logo_cid}" alt="Ayurix Logo" style="max-width: 150px; margin-bottom: 20px;">'
    elif logo_path: # Path given but not found
         logo_html = ""

    # Inject logo into content if placeholder exists, else prepend
    if "{logo}" in html_content:
        final_html = html_content.replace("{logo}", logo_html)
    else:
        # Prepend to body-ish area
        final_html = html_content.replace('<div style="text-align: center;">', f'<div style="text-align: center;">{logo_html}')

    msg.attach(MIMEText(final_html, 'html'))

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(sender_email, app_password)
            server.send_message(msg)
        return True, "Email sent successfully."
    except Exception as e:
        return False, f"Error sending email: {str(e)}"

def send_credential(email, password):
    logo_path = get_logo_path()
    
    html_content = f"""
    <html>
    <body>
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f9; border-radius: 8px; color: #333;">
        <div style="text-align: center;">
            <h2 style="color: #0077b6;">Your Ayurix Credentials</h2>
            <p style="font-size: 16px;">Please find your login credentials below:</p>

            <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 10px auto; background: #0077b6; border-radius: 6px;">
                <tr>
                    <td style="font-size: 14px; font-weight: bold; color: white; padding: 6px 16px; line-height: 0.9; text-align: left;">
                        <strong>Username</strong> : <span style="color: white; white-space: nowrap;">{email.replace('@', '&#8203;@').replace('.', '&#8203;.')}<br>
                        <strong>Password</strong> : {password}
                    </td>
                </tr>
            </table>

            <p style="margin-top: 16px; font-size: 14px; color: #666;">
                Please do not share these credentials with anyone. For security, change your password after first login.
            </p>
            <p style="margin-top: 20px; font-size: 14px;">
                Regards,<br>
                <strong>Ayurix Support Team</strong>
            </p>
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #aaa;">© 2025 Ayurix. Empowering Prevention Through Prediction.</p>
        </div>
    </div>
    </body>
    </html>
    """
    
    success, msg = send_email_smtplib(email, 'Your Ayurix Credentials', html_content, logo_path)
    if success:
        return "Credentials sent successfully."
    return msg

def send_query(email, subject, query_id):
    logo_path = get_logo_path()
    
    html_content = f"""
    <html>
    <body>
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f9; border-radius: 8px; color: #333;">
        <div style="text-align: center;">
            <h2 style="color: #0077b6;">Query Received</h2>
            <p style="font-size: 16px;">We have received your query regarding:</p>
            <p style="font-size: 18px; font-weight: bold; color: #0077b6;">{subject}</p>

            <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 8px auto; background: #0077b6; border-radius: 6px;">
                <tr>
                    <td style="font-size: 18px; font-weight: bold; color: white; padding: 4px 12px; line-height: 0.2; text-align: center; vertical-align: middle;">
                        Query ID: {query_id}
                    </td>
                </tr>
            </table>
            <p style="margin-top: 16px; font-size: 14px; color: #666;">
                Our team is working on it and will get back to you as soon as possible.
            </p>
            <p style="margin-top: 20px; font-size: 14px;">
                Regards,<br>
                <strong>Ayurix Support Team</strong>
            </p>
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #aaa;">© 2025 Ayurix. Empowering Prevention Through Prediction.</p>
        </div>
    </div>
    </body>
    </html>
    """
    
    # Passing empty string for logo_path here as logic handled inside to prepend, 
    # but let's just use the helper correctly.
    # The helper prepends logo if not found in string. Here we don't have {logo} placeholder so it prepends.
    success, msg = send_email_smtplib(email, "Query Received - Ayurix", html_content, logo_path)
    if not success:
        return msg # Return error message
    return None # Void return as original function didn't return string on success usually? Original caught exception. 
    # Original send_query returned string on error, nothing on success.


def send_otp(email, code):
    logo_path = get_logo_path()

    html_content = f"""
        <html>
        <body>
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f9; border-radius: 8px; color: #333;">
            <div style="text-align: center;">
                <h2 style="color: #0077b6;">Your One-Time Password (OTP)</h2>
                <p style="font-size: 16px;">Thank you for using Ayurix. Please use the OTP below to proceed:</p>
                <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 8px auto; background: #0077b6; border-radius: 6px;">
                <tr>
                    <td style="font-size: 24px; font-weight: bold; color: white; padding: 4px 12px; line-height: 0.2; text-align: center; vertical-align: middle;">
                    {code}
                    </td>
                </tr>
                </table>
                <p style="margin-top: 16px; font-size: 14px; color: #666;">
                    This OTP is useful for a limited time. Please do not share it with anyone.
                </p>
                <hr style="margin: 12px 0;">
                <p style="font-size: 12px; color: #aaa;">© 2025 Ayurix. Empowering Prevention Through Prediction.</p>
            </div>
        </div>
        </body>
        </html>
        """
    
    success, msg = send_email_smtplib(email, 'Your One-Time Password (OTP)', html_content, logo_path)
    if success:
        return "OTP sent successfully."
    return msg