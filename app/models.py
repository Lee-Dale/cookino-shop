from sqlmodel import SQLModel

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
