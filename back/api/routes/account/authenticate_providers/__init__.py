from typing import Literal, Type


class UserData:
    id: str
    token: str | None
    email: str | None
    first_name: str | None
    last_name: str | None
    auth_picture: str | None
    data: dict | None

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)


class Provider:
    callback: str
    callback_data: dict | None
    redirect_url: str
    position: str | None
    user_data: UserData
    UserData = UserData
    Key = Literal["google", "linkedin", "facebook", "github"]

    def __init__(self, callback, position=None, callback_data=None):
        self.callback = callback
        self.callback_data = callback_data
        self.redirect_url = position
        self.position = position
        self.user_data = None

    def authenticate(self) -> str:
        raise Exception("Not implemented")

    @classmethod
    def get_provider(cls, provider: Key):
        from . import google

        providers: dict[Provider.Key, Type[Provider]] = {
            "google": google.GoogleProvider
        }
        return providers.get(provider, None)
