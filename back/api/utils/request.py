from apps.account.models import User
from apps.account.sessions import sessions
from fastapi import Request as BaseRequest
from fastapi import Response

__all__ = ["Request"]


class Request(BaseRequest):
    _user: User
    _mole_authorized: bool = False

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.set_user()

    def get_user(self) -> User:
        user: User | None = None
        session_token = self.cookies.get("sessionToken")
        if session_token:
            user = sessions.get_user(session_token)
            if not user:
                try:
                    user = User.objects.get(session_token=session_token)
                except User.DoesNotExist:
                    pass
        if user:
            return user
        else:
            return User.objects.create_anonymous()

    def set_user(self, user: User | None = None) -> User:
        if not user:
            user = self.get_user()
        sessions.set_user(user.session_token, user)
        self._user = user = sessions.get_user(user.session_token)
        return self._user

    @property
    def user(self) -> User:
        return self._user

    def sign_response(self, response: Response) -> None:
        response.set_cookie(key="sessionToken", value=self._user.session_token)
