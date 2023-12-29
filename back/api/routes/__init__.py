from api.routes import account
from api.utils import APIRouter

router = APIRouter()
router.include_router(account.router)
