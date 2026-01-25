import uuid

def generate_doc_path(user_id: str, filename: str) -> str:
    ext = filename.split(".")[-1]
    return f"{user_id}/{uuid.uuid4()}.{ext}"
