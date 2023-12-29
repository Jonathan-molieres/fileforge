from api.utils import Request
from apps.account.models import User
from apps.account.sessions import sessions
from django.contrib.auth import login, logout
from django.contrib.auth.backends import ModelBackend


class AutoLoginMiddleware:
    """connect user if sessionToken cookie is present"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if (
            request.method == "POST"
            and request.user.is_authenticated
            and request.path == "/admin2/logout/"
        ):
            logout(request)
            response = self.get_response(request)
            response.delete_cookie("sessionToken")
            return response
        if "sessionToken" in request.COOKIES:
            session_token = request.COOKIES["sessionToken"]
            user = sessions.get_user(session_token)
            if user:
                login(request, user)
            else:
                try:
                    user = User.objects.get(session_token=session_token)
                    login(request, user)
                except User.DoesNotExist:
                    return None
        response = self.get_response(request)
        return response


class DefaultBackend(ModelBackend):
    def authenticate(
        self, request: Request, username=None, password=None, **kwargs
    ):
        return request.user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None


class DevBackend(DefaultBackend):
    """only backend for dev mode"""

    def authenticate(
        self, request: Request, username=None, password=None, **kwargs
    ):
        if username == "dev":
            user, _ = User.objects.get_or_create(
                email="dev@test.local",
                first_name="Local",
                last_name="Developper",
                username=username,
            )
            user.set_password("dev")
            user.is_superuser = False
            user.is_staff = True
            user.is_verified = True
            user.save()
            return user

        elif username == "admin":
            user, _ = User.objects.get_or_create(
                email="admin@test.local",
                first_name="Local",
                last_name="Admin",
                username=username,
            )
            user.set_password("admin")
            user.is_superuser = True
            user.is_staff = True
            user.is_verified = True
            user.save()
            return user

        else:
            try:
                user = User.objects.get(username=username)

                return user
            except User.DoesNotExist:
                return None
