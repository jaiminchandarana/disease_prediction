import yagmail
import os

def get_logo_path():
    # Pointing to client/src/assets/logo.jpg as requested
    # Assuming backend is at .../backend, so we go up one level then client/src/assets
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # Go to project root (parent of backend)
    return os.path.join(base_dir, 'client', 'src', 'assets', 'logo.jpg')

def send_credential(email, password):
    sender_email = '24mcajai005@ldce.ac.in'
    app_password = 'hewxzzsykgzcqbuj'
    yag = yagmail.SMTP(user=sender_email, password=app_password)
    logo_path = get_logo_path()

    try:
        if os.path.exists(logo_path):
            img_content = yagmail.inline(logo_path)
        else:
            img_content = "" # Fallback if logo missing

        contents = [
            img_content,
            f"""
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
            """
        ]

        yag.send(
            to=email,
            subject='Your Ayurix Credentials',
            contents=contents
        )

        return "Credentials sent successfully."
    except Exception as e:
        return f"Error sending credentials: {str(e)}"


def send_query(email, subject, query_id):
    sender_email = '24mcajai005@ldce.ac.in'
    app_password = 'hewxzzsykgzcqbuj'
    yag = yagmail.SMTP(user=sender_email, password=app_password)
    logo_path = get_logo_path()

    try:
        if os.path.exists(logo_path):
            img_content = yagmail.inline(logo_path)
        else:
            img_content = ""
            
        contents = [
            img_content,
            f"""
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
            """
        ]
        yag.send(
            to=email,
            subject="Query Received - Ayurix",
            contents=contents
        )
    except Exception as e:
        return f"Error sending query: {str(e)}"

def send_otp(email, code):
    sender_email = '24mcajai005@ldce.ac.in'
    app_password = 'hewxzzsykgzcqbuj'
    yag = yagmail.SMTP(user=sender_email, password=app_password)
    logo_path = get_logo_path()

    try:
        contents = []
        if os.path.exists(logo_path):
            contents.append(yagmail.inline(logo_path))
        
        contents.append(f"""
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
            """)


        yag.send(
            to=email,
            subject='Your One-Time Password (OTP)',
            contents=contents
        )
        return "OTP sent successfully."
    except Exception as e:
        return f"Error sending OTP: {str(e)}"