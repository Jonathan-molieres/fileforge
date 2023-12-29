from api.schemas import UserData
from api.utils import APIRouter, Request

router = APIRouter()


@router.get("/me", response_model=UserData)
async def get_current_user(request: Request) -> UserData:
    """Get current user

    Args:
        request (Request): _description_

    Returns:
        User: _description_
    """
    return request.user
