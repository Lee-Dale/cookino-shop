## Phase-2

@router.get("/health")
def health():
    return {"status": "Ok"}
