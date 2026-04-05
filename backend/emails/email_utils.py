import resend
import os
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")
def send_otp_email(to_email , otp):

    r = resend.Emails.send({
        "from" : "onboarding@resend.dev",
        "to" : to_email,
        "subject" : "Your OTP - Kailash Gym",
        "html" : f"<p> Your OTP is <strong>{otp}</strong>. Valid for 10 mins"
    })