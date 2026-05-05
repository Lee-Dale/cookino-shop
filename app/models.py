from sqlmodel import SQLModel, Field

class Product(SQLModel, table=True):
    id: int= Field(default=None, primary_key=True)
    name: str
    cost: float
    size: str
    colour: str
    collection: str

class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str
    email: str
    password: str

class Order(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    product_id: int = Field(foreign_key="product.id")
    quantity: int

