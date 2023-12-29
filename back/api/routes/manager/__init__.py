from api.routes.manager
from api.utils import APIRouter

router = APIRouter(prefix="/manager", tags=["manager"])
router.include_router(me.router)
