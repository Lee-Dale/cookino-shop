from pydantic import EmailStr
from sqlmodel import SQLModel, Field
from typing import Optional

# Order Bestellung
class OrderRequest(SQLModel):
    produkt_variante_id: str
    menge: int

class UserRegister(SQLModel):
    vorname: str
    nachname: str
    email: EmailStr
    password: str = Field(min_length=8)

class UserLogin(SQLModel): 
    email: EmailStr
    password: str = Field(min_length=8)

class KontoAendern(SQLModel):
    vorname: Optional[str] = None
    nachname: Optional[str] = None
    email: Optional[EmailStr] = None
    neues_password: Optional[str] = Field(default=None, min_length=8)

class KontoLoeschen(SQLModel):
    password: str = Field(min_length=8)

# Warenkorb Schemas 

class ArtikelHinzufuegen(SQLModel):
    produkt_variante_id: str
    menge: int

class ArtikelAendern(SQLModel):
    produkt_variante_id: str
    neue_menge: int



