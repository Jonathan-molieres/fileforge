import hashlib
import hmac
from functools import wraps

from api.utils.request import Request
from django.conf import settings
from fastapi import HTTPException

__all__ = [
    "require_internal",
    "require_staff_user",
    "require_super_user",
    "require_breezy_webhook_signature",
]


def require_staff_user(func):
    @wraps(func)
    async def wrapper(request: Request, *args, **kwargs):
        print(request.user)
        if not request.user.is_staff:
            raise HTTPException(
                status_code=403,
                detail="Staff required",
            )
        return await func(request, *args, **kwargs)

    return wrapper


def require_super_user(func):
    @wraps(func)
    async def wrapper(request: Request, *args, **kwargs):
        if not request.user.is_superuser:
            raise HTTPException(
                status_code=403,
                detail="Super user required",
            )
        return await func(request, *args, **kwargs)

    return wrapper


def require_internal(func):
    allowed_ip = settings.INTERNAL_IP

    @wraps(func)
    async def wrapper(*args, **kwargs):
        request = kwargs.get("request")
        if settings.DEV_MODE:
            return await func(*args, **kwargs)

        # TODO: check
        else:
            client_ip = request.client.host
            print(client_ip)
            return await func(*args, **kwargs)

        client_ip = request.client.host
        if client_ip != allowed_ip:
            raise HTTPException(
                status_code=403,
                detail="Only internal requests are allowed.",
            )

        return await func(request, *args, **kwargs)

    return wrapper


def require_breezy_webhook_signature(func):
    @wraps(func)
    async def wrapper(request: Request, *args, **kwargs):
        user_agent = request.headers.get("User-Agent")
        webhook_version = request.headers.get("X-Breezy-Webhook-Version")
        hook_signature = request.headers.get("X-Hook-Signature")
        if user_agent != "BreezyHR Webhook Delivery Agent":
            raise HTTPException(status_code=403, detail="Invalid User-Agent")

        if webhook_version != "1.0":
            raise HTTPException(
                status_code=403, detail="Invalid webhook version"
            )
        payload = await request.body()
        calculated_signature = hmac.new(
            bytes(settings.BREEZY_WEBHOOKS_SECRET, "utf-8"),
            payload,
            hashlib.sha256,
        ).hexdigest()
        if calculated_signature != hook_signature:
            raise HTTPException(
                status_code=403, detail="Invalid webhook signature"
            )

        return await func(request, *args, **kwargs)

    return wrapper
