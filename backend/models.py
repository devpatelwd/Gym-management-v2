from sqlalchemy import Integer , String , Boolean , Column , Date , DateTime
from database import Base

class Plans(Base):
    __tablename__ = "plans"
    id = Column(Integer , primary_key= True , autoincrement= True)
    plan = Column(String , nullable=False)
    price = Column(Integer , nullable=False)
    months = Column(Integer , nullable=False)

class Member(Base):
    __tablename__ = "members"
    id = Column(Integer , primary_key=True , autoincrement=True)
    name = Column(String , nullable=False)
    phone = Column(String , nullable = False)
    gender = Column(String)
    joining_date = Column(Date)
    subs_end_date = Column(Date)
    plan = Column(String)
    status = Column(String)
    plan_amount = Column(Integer)
    amount_paid = Column(Integer)
    is_active = Column(Boolean , default=True)

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer , primary_key=True , autoincrement=True )
    name = Column(String , nullable=False)
    phone_no = Column(String , nullable=False)
    email = Column(String , nullable= False)
    password = Column(String , nullable=True)
    verified = Column(Boolean , default=False)
    otp = Column(Integer)
    otp_expiry = Column(DateTime)

class EnrollmentRequest(Base):
    __tablename__ = "enrollmentrequest"
    id = Column(Integer , primary_key=True , autoincrement=True)
    email = Column(String , nullable=False)
    plan_id = Column(Integer , nullable=False)
    request_status = Column(String , default="Pending")
    coupen_code = Column(String , nullable=True)
    

class Coupen(Base):
    __tablename__ = "coupens"
    id = Column(Integer , primary_key=True , autoincrement=True)
    coupen_code = Column(String)
    discount_amount = Column(Integer , nullable=True)
    discount_percentage = Column(Integer , nullable=True)
    total_uses = Column(Integer)
    used_count = Column(Integer , default=0)
    plan_id = Column(Integer)





