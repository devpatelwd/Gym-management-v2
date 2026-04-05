from passlib.context import CryptContext
from jose import jwt
from datetime import datetime , timedelta
import os
from dotenv import load_dotenv
from fastapi.security import HTTPBearer , HTTPAuthorizationCredentials
from fastapi import Depends , HTTPException
load_dotenv()


# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
bearer_scheme = HTTPBearer()

pwd_context = CryptContext(schemes=["bcrypt"])

def hashed_password(password):
    password = password[:72]
    hashed__password = pwd_context.hash(password)
    return hashed__password

def verify_password(plain , hashed):
    plain = plain[:72]
    return pwd_context.verify(plain , hashed)

def create_token(data):
    to_encode = data.copy()
    expiry = datetime.now() + timedelta(days=3)
    to_encode["exp"] = expiry
    token = jwt.encode(to_encode , os.getenv("SECRET_KEY"), algorithm="HS256")
    return token

def verify_token(token):
    return jwt.decode(token , os.getenv("SECRET_KEY") , algorithms=["HS256"])

def get_current_user(credentiels: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentiels.credentials
    try:
        return verify_token(token)
    except :
        raise HTTPException(status_code=401 , detail="Invalid Token")
    
def get_admin(credentiels : HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentiels.credentials

    try:
        data =  verify_token(token)
        if data["role"] == "admin":
            return data
        else:
            raise HTTPException(status_code=403 , detail="Not Authorized")
    except:
        raise HTTPException(status_code=403 , detail="Not Authorized")
    


