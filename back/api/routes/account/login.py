from typing import Type

from api.routes.account.authenticate_providers import Provider
from api.utils import APIRouter, Request
from apps.account.models import User
from django.conf import settings
from fastapi import Body, HTTPException, Path, Query, Response

router = APIRouter()


@router.post("/login/{user_id}")
def authenticate(
    request: Request,
    response: Response,
    user_id: str = Path(example="me"),
    provider_key: Provider.Key = Query(alias="provider", example="google"),
    callback: str = Query(
        example=f"{settings.ROOT_URL}/account/authenticate/google/",
        default=f"{settings.ROOT_URL}/account/authenticate/google/",
    ),
    position: str
    | None = Query(example=f"{settings.ROOT_URL}/dashboard", default=None),
    callback_data: dict | None = Body(default=None),
) -> str | None:
    """Authenticate user with provider

    Args:
        request (Request): _description_
        response (Response): _description_
        user_id (str, optional): _description_. Defaults to Query(example="me", default="me").
        provider_key (Provider.Key, optional): _description_. Defaults to Query(alias="provider", example="google").
        callback (str, optional): _description_. Defaults to Query( example=f"{settings.ROOT_URL}/account/authenticate/google/", default=f"{settings.ROOT_URL}/account/authenticate/google/", ).
        position (str | None, optional): _description_. Defaults to Query(example=f"{settings.ROOT_URL}/dashboard", default=None).
        callback_data (dict | None, optional): _description_. Defaults to Body(default=None).

    Raises:
        HTTPException: _description_

    Returns:
        _type_: _description_
    """
    if user_id == "me":
        ProviderClass: Type[Provider] | None = Provider.get_provider(
            provider_key
        )
        if not ProviderClass:
            raise HTTPException(status_code=404, detail="Provider not found")

        provider = ProviderClass(
            callback=callback,
            position=position,
            callback_data=callback_data,
        )
        provider.authenticate()

        # Verified user
        if provider.user_data:
            user_attributes = {
                "email": "email",
                "phone": "phone",
                "id": f"{provider_key}_id",
            }
            for (
                user_data_attribute,
                user_model_attribute,
            ) in user_attributes.items():
                if hasattr(provider.user_data, user_data_attribute):
                    try:
                        user = User.objects.get(
                            **{
                                user_model_attribute: getattr(
                                    provider.user_data, user_data_attribute
                                )
                            }
                        )
                        # L'utilisateur existe déjà
                        # diff request.user anonyme et user vient de la db
                        # request.user.pins.all()
                        # user.pins.all()
                        request.set_user(user)
                        break

                    except User.DoesNotExist:
                        pass

            request.user.register(is_verified=True, is_anonymous=False)

            user_attributes_optionnal = {
                **user_attributes,
                "first_name": "first_name",
                "last_name": "last_name",
                "auth_picture": "auth_picture",
                f"{provider_key}_token": "token",
            }
            request.user.register(
                **{
                    user_model_attribute: getattr(
                        provider.user_data, user_data_attribute
                    )
                    for user_data_attribute, user_model_attribute in user_attributes_optionnal.items()
                    if hasattr(provider.user_data, user_data_attribute)
                }
            )

            if request.user.email and request.user.email.endswith(
                ("@workandyou.fr", "@surviving-data.fr")
            ):
                request.user.register(
                    is_staff=True,
                )

            if request.user.updated_fields:
                request.user.save()

        return provider.redirect_url

    return None
