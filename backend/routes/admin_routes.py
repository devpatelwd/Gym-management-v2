from fastapi import APIRouter , HTTPException , Depends
from schema import AdminLogin , AddMembers ,  UpdateRequestStatus , UpdatePlanPrice , CreateCoupen
from auth import create_token , get_admin
from dotenv import load_dotenv
from models import Member , Plans , EnrollmentRequest , Users , Coupen
import os
from sqlalchemy import func
from dependencies import get_db
from emails.email_utils import expiry_email
from datetime import date , timedelta
load_dotenv()

router = APIRouter()

@router.post("/admin/login/")

def admin_login(admin_login : AdminLogin , ):
    if admin_login.email != os.getenv("ADMIN_EMAIL"):
        raise HTTPException(status_code=401 , detail="Invalid Email")
    
    if admin_login.password != os.getenv("ADMIN_PASSWORD"):
        raise HTTPException(status_code=401 , detail="Invalid Password")
    
    return {"token" : create_token({"email" : admin_login.email , "role" : "admin"})}

@router.get("/admin/members")

def get_members(admin = Depends(get_admin) , db = Depends(get_db)):
    
    data = db.query(Member).all()

    return data

@router.post("/admin/add-member/")

def add_member(data : AddMembers ,  admin = Depends(get_admin) , db = Depends(get_db)):

    table = Member(name = data.name , phone = data.phone , gender = data.gender , joining_date = data.joining_date ,
                    subs_end_date = data.subs_end_date , plan = data.plan , status = data.status , plan_amount = data.plan_amount , 
                    amount_paid = data.amount_paid , email = data.email)
    
    db.add(table)
    db.commit()
    db.refresh(table)

    return {"message" : "Success"}

@router.delete("/admin/delete-member/{id}")

def delete_member(id : int , admin = Depends(get_admin) , db = Depends(get_db)):

    member = db.query(Member).filter(Member.id == id).first()

    if not member:
        raise HTTPException(status_code=404 , detail= "Member not found")
    
    db.delete(member)
    db.commit()

    return {"message" : "Success"}

@router.put("/admin/update-member/{id}")

def update_member(id : int ,data : AddMembers ,  admin = Depends(get_admin) , db = Depends(get_db)):

    member = db.query(Member).filter(Member.id == id).first()
    if not member:
        raise HTTPException(status_code=404 , detail="Member not found")

    member.name = data.name 
    member.phone = data.phone
    member.gender = data.gender
    member.joining_date = data.joining_date
    member.subs_end_date = data.subs_end_date
    member.plan = data.plan
    member.status = data.status
    member.plan_amount = data.plan_amount
    member.amount_paid = data.amount_paid
    member.email = data.email

    db.commit()
    db.refresh(member)

    return {"message" : "Success"}

    
@router.get("/admin/stats")

def get_stats(admin = Depends(get_admin) , db = Depends(get_db)):

    total_revenue = db.query(func.sum(Member.amount_paid)).scalar()
    total_amount_as_per_plan_amount = db.query(func.sum(Member.plan_amount)).scalar()
    total_members = db.query(Member).count()
    total_due = total_amount_as_per_plan_amount - total_revenue

    return {"total_revenue" : total_revenue , "total_members" : total_members , "total_due" : total_due}

@router.get("/admin/requests")

def get_requests(admin = Depends(get_admin) , db = Depends(get_db)):

    combined_data = []

    all_request = db.query(EnrollmentRequest).all()

    if not all_request:
        raise HTTPException(status_code=404 , detail="No request found")

    for request in all_request:
        id = request.id
        email = request.email
        plan_id = request.plan_id
        request_status = request.request_status
        plan = db.query(Plans).filter(Plans.id == plan_id).first()
        coupen = request.coupen_code

        combined_data.append({"id" : id , "email" : email , "plan" : plan , "status" : request_status , "coupen" : coupen})

    return {"all_request" : combined_data}

@router.post("/admin/update-req-status/{id}")

def update_req_status(id : int ,data : UpdateRequestStatus , admin = Depends(get_admin) , db = Depends(get_db)):

    request = db.query(EnrollmentRequest).filter(EnrollmentRequest.id == id).first()

    if not request:
        raise HTTPException(status_code=404 , detail="Request Not found")
    request.request_status = data.status

    db.commit()
    db.refresh(request)

    if request.request_status == "Approved":
        if request.coupen_code:
            coupen = db.query(Coupen).filter(Coupen.coupen_code == request.coupen_code).first()
            coupen.used_count += 1
            db.commit()
        

        plan = db.query(Plans).filter(Plans.id == request.plan_id).first()

        new_member = db.query(Users).filter(request.email == Users.email).first()

        alr_a_member = db.query(Member).filter(request.email == Member.email).first()

        if alr_a_member:
            alr_a_member.joining_date = data.joining_date
            alr_a_member.subs_end_date = data.subs_end_date
            alr_a_member.plan = plan.plan
            alr_a_member.status = data.status_member
            alr_a_member.plan_amount = data.plan_amount
            alr_a_member.amount_paid = data.amount_paid

            db.commit()
            db.refresh(alr_a_member)
            return {"message" : "success"}


        else:
            adding_member = Member(name = new_member.name , phone = new_member.phone_no , gender = data.gender , joining_date = data.joining_date ,
                                subs_end_date = data.subs_end_date , plan = plan.plan , status = data.status_member , plan_amount = data.plan_amount ,
                                amount_paid = data.amount_paid , email = data.email)
        
            db.add(adding_member)
            db.commit()

            return {"message" : "success"}
        
    
        
    return {"message" : "Success"}

@router.put("/admin/plans-price/{id}")

def update_plan_price(id : int , data : UpdatePlanPrice , admin = Depends(get_admin) , db = Depends(get_db)):

    plan = db.query(Plans).filter(Plans.id == id).first()

    if not plan:
        raise HTTPException(status_code=404 , detail="Plan not found")
    
    plan.price = data.plan_price

    db.commit()
    db.refresh(plan)

    return {"message" : "Success"}

@router.post("/admin/add-coupens")

def add_coupen(data : CreateCoupen , admin = Depends(get_admin) , db = Depends(get_db)):

    new_coupen = Coupen(coupen_code = data.coupen_code , discount_amount = data.discount_amount , discount_percentage = data.discount_percentage ,
                        total_uses = data.total_uses)
    
    db.add(new_coupen)
    db.commit()
    db.refresh(new_coupen)

    return {"message" : "Success"}

@router.get("/admin/get-coupens")

def get_coupens(admin = Depends(get_admin) , db = Depends(get_db)):

    all_coupens = db.query(Coupen).all()

    if not all_coupens:
        return {"all_coupens" : []}

    return {"all_coupens" : all_coupens}

@router.delete("/admin/delete-coupen/{id}")

def delete_coupen(id : int , admin = Depends(get_admin) , db = Depends(get_db)):

    coupen = db.query(Coupen).filter(Coupen.id == id).first()

    if not coupen:
        raise HTTPException(status_code=404 , detail="Coupen Not found")
    db.delete(coupen)
    db.commit()

    return {"message" : "success"}

@router.get("/admin/expiry-email")

def send_expiry_email(user = Depends(get_admin) , db = Depends(get_db)):

    date_to_check = (date.today() + timedelta(days=9)).strftime("%Y-%m-%d")

    members = db.query(Member).filter(Member.subs_end_date == date_to_check).all()
    
    for member in members:
        if member.email:
            expiry_email(member.email , member.name , member.plan) 

    return {"message" : "success"}




