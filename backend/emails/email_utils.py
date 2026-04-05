import smtplib
import os
from dotenv import load_dotenv

load_dotenv()

def send_otp_email(to_email , otp):
    sender = os.getenv("EMAIL")
    password = os.getenv("EMAIL_PASSWORD")


    subject = "Your OTP - Kailash Gym"

    body = f"Your otp is {otp} . Valid for 10 minutes"

    message = f"{subject} \n\n {body}"

    with smtplib.SMTP_SSL("smtp.gmail.com" , 465) as server:
        server.login(sender , password)
        server.sendmail(sender , to_email , message)
        