import os
import requests
from dotenv import load_dotenv

load_dotenv()

def send_otp_email(to_email, otp):

    sender = os.getenv("EMAIL")

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": os.getenv("BREVO_API_KEY"),
        "content-type": "application/json"
}

    payload = {
        "sender": {
            "name": "Kailash Gym",
            "email": sender
        },
        "to": [
            {"email": to_email}
        ],
        "subject": "Your OTP - Kailash Gym",
        "htmlContent": f"<p>Your OTP is <b>{otp}</b>. Valid for 10 minutes.</p>"
    }

    try:
        r = requests.post(url, json=payload, headers=headers)
        print("Brevo:", r.status_code, r.text)
    except Exception as e:
        print("Email error:", e)



def expiry_email(to_email , name , plan):
    sender = os.getenv("EMAIL")

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": os.getenv("BREVO_API_KEY"),
        "content-type": "application/json"
}

    payload = {
        "sender": {
            "name": "Kailash Gym",
            "email": sender
        },
        "to": [
            {"email": to_email}
        ],
        "subject": "Plan Expiry Email - Kailash Gym",
        "htmlContent": f"<p>Dear {name} , Your {plan} Expires in 9 Days</p>"
    }

    try:
        r = requests.post(url, json=payload, headers=headers)
        print("Brevo:", r.status_code, r.text)
    except Exception as e:
        print("Email error:", e)



def send_otp_forgot_password(to_email , otp):
    sender = os.getenv("EMAIL")

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": os.getenv("BREVO_API_KEY"),
        "content-type": "application/json"
}

    payload = {
        "sender": {
            "name": "Kailash Gym",
            "email": sender
        },
        "to": [
            {"email": to_email}
        ],
        "subject": "Plan Expiry Email - Kailash Gym",
        "htmlContent": f"<p>Use this OTP to Reset Password : {otp} valid for 10 mins</p>"
    }

    try:
        r = requests.post(url, json=payload, headers=headers)
        print("Brevo:", r.status_code, r.text)
    except Exception as e:
        print("Email error:", e)