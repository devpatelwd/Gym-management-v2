from fastapi import APIRouter
from fastapi import HTTPException , Depends
from models import Member , Users , Coupen , EnrollmentRequest , Plans
from dependencies import get_db
from schema import UserData , OtpVerify , SetPassword , UserLogin , EnrollRequest , ApplyCoupen
from datetime import datetime , timedelta
import random
from auth import hashed_password , verify_password , create_token , get_current_user
from emails.email_utils import send_otp_email

router = APIRouter()

@router.get("/")

def index():
    return {"message" : "Hello World"}

@router.get("/plans/" )

def get_plans(db = Depends(get_db)):
    all_plans = db.query(Plans).all()
    
    return all_plans

@router.post("/user/register/")

def register(new_user : UserData , db = Depends(get_db)):
    user_exist = db.query(Users).filter(Users.email == new_user.email).first()

    if user_exist:
        if user_exist.verified:
            raise HTTPException(status_code=409 , detail="User already exists")
    
    else:
        table = Users(name = new_user.name , email = new_user.email , phone_no = new_user.phone)
        db.add(table)
        db.commit()
        db.refresh(table)

        table.otp = random.randint(100000 , 999999)
        table.otp_expiry = datetime.now() + timedelta(minutes=10)
        db.commit()
        

        print("About to send email")
        send_otp_email(table.email , table.otp)

        return {"message" : "Success"}
    

@router.post("/user/verify-otp/")

def verify_otp(verify : OtpVerify , db = Depends(get_db)):
        
        curr_time = datetime.now()

        email = db.query(Users).filter(Users.email == verify.email).first()

        if not email:
            raise HTTPException(status_code=404 , detail="Email not found") 
        
        if verify.otp != email.otp:
            raise HTTPException(status_code= 400, detail= "Invalid OTP")
        
        if email.otp_expiry < curr_time:
            raise HTTPException(status_code=400 , detail = "OTP Expired")
        
        email.verified = True

        email.otp = None
        email.otp_expiry = None
        db.commit()

        return {"message" : "Success"}

@router.post("/user/set-password/")

def set_password(password : SetPassword , db = Depends(get_db)):
    
    email = db.query(Users).filter(password.email == Users.email).first()

    if not email :
        raise HTTPException(status_code=404 , detail="Email not found")

    if not email.verified:
        raise HTTPException(status_code=403 , detail="Detail not verified")
    
    hashed_pass = hashed_password(password.password)
    email.password = hashed_pass

    db.commit()

    return {"message" : "Success"}

@router.post("/user/login/")

def login(login_details : UserLogin , db = Depends(get_db)):
     
     email = db.query(Users).filter(login_details.email == Users.email).first()

     if not email:
        raise HTTPException(status_code=404 , detail="email not found")
     
     if not verify_password(login_details.password , email.password):
        raise HTTPException(status_code=403 , detail="Invalid pasword")

     return {"token" : create_token({"name" : email.name , "email" : email.email , "role" : "user"})}

@router.post("/user/enroll-plan/")

def enroll_plan(user_plan : EnrollRequest , current_user = Depends(get_current_user) , db = Depends(get_db)) :

    table = EnrollmentRequest(email = current_user["email"] , plan_id = user_plan.plan_id , coupen_code = user_plan.coupen_code)


    db.add(table)
    db.commit()

    return {"message" : "Success"}

@router.post("/user/apply-coupen")

def apply_coupen(data : ApplyCoupen , user = Depends(get_current_user) , db = Depends(get_db)):

    coupen = db.query(Coupen).filter(Coupen.coupen_code == data.coupen_code).first()

    if not coupen:
        raise HTTPException(status_code = 404 , detail= "Coupen not found")
    
    if coupen.plan_id != data.plan_id:
        raise HTTPException(status_code = 400 , detail="Coupen not valid for this plan")
    
    if coupen.used_count >= coupen.total_uses:
        raise HTTPException(status_code=400 , detail= "Coupen expired")
    
    plan = db.query(Plans).filter(Plans.id == data.plan_id).first()
    original_price = plan.price
    
    if coupen.discount_amount:
        discount = coupen.discount_amount
        discounted_price = original_price - discount
    elif coupen.discount_percentage:
        discount = coupen.discount_percentage
        discounted_price = (original_price * discount) / 100

    return {"original_price" : original_price , "discounted_price" : discounted_price}     


@router.get("/user/enrollment-status/")

def get_enrollment_status(user = Depends(get_current_user) , db = Depends(get_db)):

    email = db.query(EnrollmentRequest).filter(EnrollmentRequest.email == user["email"]).first()

    if not email:
        raise HTTPException(status_code=404 , detail="No Enrollment Request Found")
    
    request_status = email.request_status

    return {"request_status" : request_status}

