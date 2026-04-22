from pydantic import BaseModel
from typing import Optional

class UserData(BaseModel):
    name : str
    phone : str
    email : str

class OtpVerify(BaseModel):
    email : str
    otp : int

class SetPassword(BaseModel):
    email : str
    password : str

class UserLogin(BaseModel):
    email : str
    password : str

class EnrollRequest(BaseModel):
    plan_id : int
    coupen_code : str = None

class AdminLogin(BaseModel):
    email : str
    password : str

class AddMembers(BaseModel):
    name : str
    phone : str
    gender : str
    joining_date : str
    subs_end_date : str
    plan : str
    status : str
    plan_amount : int
    amount_paid : int
    email : Optional[str] = None

class UpdateRequestStatus(BaseModel):
    status : str 
    gender : Optional[str] = None
    plan_amount : Optional[int] = None
    amount_paid : Optional[int] = None
    joining_date : Optional[str] = None
    subs_end_date : Optional[str] = None
    status_member : Optional[str] = None
    email : Optional[str] = None

class UpdatePlanPrice(BaseModel):
    plan_price : int

class CreateCoupen(BaseModel):
    coupen_code : str
    discount_amount : int
    discount_percentage : int
    total_uses : int

class ApplyCoupen(BaseModel):
    coupen_code : str
    plan_id : int

class ForgotPasswordRequest(BaseModel):
    email : str
