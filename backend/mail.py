import yagmail
import os

def get_logo_path():
    # Pointing to client/src/assets/logo.jpg as requested
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) 
    return os.path.join(base_dir, 'client', 'src', 'assets', 'logo.jpg')

def send_email_yagmail(to_email, subject, html_content, logo_path=None):
    sender_email = '24mcajai005@ldce.ac.in'
    app_password = 'hewxzzsykgzcqbuj'
    
    try:
        yag = yagmail.SMTP(sender_email, app_password)
        
        # Prepare content list
        contents = [html_content]
        
        # Logo handling
        # yagmail handles inline images via direct path in html e.g. <img src="filename.jpg"> if valid path provided in contents?
        # Actually yagmail is smart. If we want inline, we can pass yagmail.inline(logo_path)
        
        # However, to keep existing logic of replacing placeholder or prepending:
        # The existing logic hardcoded logic for smtplib cid.
        # With yagmail, we can just attach the image or inline it.
        # Let's adjust the HTML content to be yagmail friendly if we want inline, 
        # or simplified.
        
        # Strategy:
        # 1. If logo_path exists, we want it inline.
        # 2. Update HTML to reference the logo filename if we use yagmail's smart inline.
        
        final_html = html_content
        attachments = []
        
        if logo_path and os.path.exists(logo_path):
            # yagmail.inline() wrapper helps reference it
            # But the HTML needs to point to it. 
            # If we simply pass logo_path in contents, yagmail attaches it.
            # If we use yagmail.inline(logo_path), it returns a magic string/object to use in body?
            # Actually yagmail.inline(path) returns: 'cid:filename' roughly.
            
            logo_inline = yagmail.inline(logo_path)
            logo_img_tag = f'<img src="{logo_inline}" alt="Ayurix Logo" style="max-width: 150px; margin-bottom: 20px;">'
            
            if "{logo}" in final_html:
                final_html = final_html.replace("{logo}", logo_img_tag)
            else:
                 # Prepend to body-ish area like before
                final_html = final_html.replace('<div style="text-align: center;">', f'<div style="text-align: center;">{logo_img_tag}')
        
        
        yag.send(
            to=to_email,
            subject=subject,
            contents=final_html
        )
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
    
    success, msg = send_email_yagmail(email, 'Your Ayurix Credentials', html_content, logo_path)
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
    
    success, msg = send_email_yagmail(email, "Query Received - Ayurix", html_content, logo_path)
    if not success:
        return msg 
    return None 

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
    
    success, msg = send_email_yagmail(email, 'Your One-Time Password (OTP)', html_content, logo_path)
    if success:
        return "OTP sent successfully."
    return msg