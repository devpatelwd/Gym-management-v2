from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import os
from dotenv import load_dotenv

load_dotenv()

def send_otp_email(to_email, otp):
    sender = os.getenv("EMAIL")
    login = os.getenv("BREVO_LOGIN")
    password = os.getenv("BREVO_PASSWORD")
    
    subject = "Your OTP - Kailash Gym"
    body = f"Your OTP is {otp}. Valid for 10 minutes."
  
    msj = MIMEMultipart()
    msj["From"] = sender
    msj["To"] = to_email
    msj["Subject"] = subject

    msj.attach(MIMEText(body , "plain"))
    
    try:
        with smtplib.SMTP("smtp-relay.brevo.com", 587) as server:
            server.starttls()
            server.login(login, password)
            server.sendmail(sender, [to_email], msj.as_string())
            print("Email sent successfully!")
    except Exception as e:
        print(f"Email error: {e}")