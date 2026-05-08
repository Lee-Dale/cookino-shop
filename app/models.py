from pydantic import EmailStr
from sqlmodel import SQLModel, Field

# Order Bestellung
class OrderRequest(SQLModel):
    artikel_id: int
    menge: int
    
    class Config:
        from_attributes = True


# Order Response
class Artikel(SQLModel):
    id: int
    name: str
    beschreibung: str
    preis: float
    lagerbestand: int

    class Config:
        from_attributes = True

# Collection Response  
class Kollektion(SQLModel):
    id: int
    name: str
    beschreibung: str

    class Config:
        from_attributes = True

class User(SQLModel, table=True):
    id: int= Field(default=None, primary_key=True)
    email: EmailStr
    username: str
    password: str = Field(min_length=8)

    class Config:
        from_attributes = True

class UserRegister(SQLModel):
    vorname: str
    nachname: str
    email: EmailStr
    password: str = Field(min_length=8)

class UserLogin(SQLModel): 
    email: EmailStr
    password: str = Field(min_length=8)