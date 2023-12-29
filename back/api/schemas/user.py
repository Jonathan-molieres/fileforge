from uuid import UUID

from api.utils import ModelData

__all__ = ["UserData"]


class UserData(ModelData):
    id: UUID
    is_verified: bool
    is_staff: bool
    is_admin: bool
    is_superuser: bool
    is_debugging: bool
    is_anonymous: bool
    email: str | None
    first_name: str | None
    last_name: str | None
    phone: str | None
    auth_picture: str | None
