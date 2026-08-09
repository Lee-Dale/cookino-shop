from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import shop
from app.routes import auth
from app.routes import warenkorb
from app.routes import admin
from app.routes import LEE_buch_api as buch_api
   


app = FastAPI(swagger_ui_parameters={"persistAuthorization": True})
app.include_router(shop.router)
app.include_router(warenkorb.router)
app.include_router(auth.router)
app.include_router(buch_api.router, prefix="/api")

origins = [
    "https://cookino-shop.de",
    "https://www.cookino-shop.de",
    "https://dpierpxha84mf.cloudfront.net",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"Message": "LET'S GO COOKINO!"}
