from fastapi import  APIRouter
from fastapi import HTTPException , Depends
from pydantic import BaseModel
from auth import get_admin
from dependencies import get_db
from reportlab.pdfgen import canvas
from dotenv import load_dotenv
import os
from supabase import create_client
import requests
from datetime import datetime
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase_client = create_client(supabase_url=SUPABASE_URL , supabase_key=SUPABASE_KEY)

class BillPdfGeneration(BaseModel):
    name : str
    phone : str
    plan : str
    joining_date : str
    subs_end_date : str
    plan_amount : int
    amount_paid : int


router = APIRouter()



def send_bill(data):
    time = datetime.today().time().strftime("%H-%M-%S")
    pdf = canvas.Canvas(f"{data.name}_{time}_bill.pdf")

    amount_due = data.plan_amount - data.amount_paid

    pdf.drawString(x=250 , y=750 , text="Kailash Gym")
    pdf.drawString(x=100 , y=720 , text=f"Member Name :- {data.name}")
    pdf.drawString(x=100 , y=690 , text=f"Member Number :- {data.phone}")
    pdf.drawString(x=100 , y=660 , text=f"Member Plan :- {data.plan}")
    pdf.drawString(x=100 , y=630 , text=f"Joining Date :- {data.joining_date}")
    pdf.drawString(x=100 , y=600 , text=f"Ending_Date :- {data.subs_end_date}")
    pdf.drawString(x=100 , y=570 , text=f"Plan Amount :- {str(data.plan_amount)}")
    pdf.drawString(x=100 , y=540 , text=f"Amount Paid :- {str(data.amount_paid)}")
    pdf.drawString(x=100 , y=510 , text=f"Amount Due :- {str(amount_due)}")

    pdf.save()

    with open(file=f"{data.name}_{time}_bill.pdf" , mode="rb") as file:
        pdf_bytes = file.read()
        supabase_client.storage.from_("bills").upload(f"{data.name}_{time}_bill.pdf" , pdf_bytes , {"content-type" : "application/pdf" , "upsert" : "true"}) 

    
    pdf_url = supabase_client.storage.from_("bills").get_public_url(f"{data.name}_{time}_bill.pdf")


    headers = {
        "Authorization" : f"Bearer {os.getenv('WHATSAPP_ACCESS_TOKEN')}",
        "Content-Type" : "application/json"
    }

    payload = {
        "messaging_product" : "whatsapp",
        "to" : f"91{data.phone}",
        "type" : "document",
        "document" : {
            "link" : pdf_url,
            "filename" : f"{data.name}_{time}_bill.pdf"
        }
    }

    url = f"https://graph.facebook.com/v25.0/{os.getenv('WHATSAPP_PHONE_NUMBER_ID')}/messages"
    response = requests.post(url=url , headers=headers , json=payload)
    os.remove(f"{data.name}_{time}_bill.pdf")

    print(response.json())
    return response.json()

    
@router.post("/send-bill")

def bill_send(data : BillPdfGeneration , user = Depends(get_admin) , db = Depends(get_db)):

    send_bill(data)

    