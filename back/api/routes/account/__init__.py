from api.routes.account import login, me
from api.utils import APIRouter

router = APIRouter(prefix="/account", tags=["account"])
router.include_router(me.router)
router.include_router(login.router)
