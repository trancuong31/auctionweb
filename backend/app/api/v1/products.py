from fastapi import APIRouter

router = APIRouter()

@router.post("/getproducts")
def getProducts():
    return {"list": "abc"}
