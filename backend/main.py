from fastapi import FastAPI
from database import engine , Base
from routes.user_routes import router as user_router
from routes.admin_routes import router as admin_router
from routes.whatsapp import router as whatsapp_route
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind = engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(user_router)

app.include_router(admin_router)

app.include_router(whatsapp_route)






