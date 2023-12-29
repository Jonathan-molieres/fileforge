from pydantic import BaseModel

__all__ = ["SuccessResponse", "FailureResponse"]


class SuccessResponse(BaseModel):
    success: bool = True
    message: str


class FailureResponse(BaseModel):
    success: bool = False
    error: str
