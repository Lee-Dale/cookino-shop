from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import shop


app = FastAPI()
app.include_router(shop.router)

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