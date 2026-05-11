from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import shop
from app.routes import auth
from app.routes import warenkorb



app = FastAPI(swagger_ui_parameters={"persistAuthorization": True})
app.include_router(shop.router)
app.include_router(warenkorb.router)
app.include_router(auth.router)


origins = [
    "http://cookieno-shop.s3-website.eu-central-1.amazonaws.com",
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