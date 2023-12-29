from api.routes.account.authenticate_providers import Provider
from django.conf import settings
from google_auth_oauthlib.flow import Flow


class GoogleProvider(Provider):
    CLIENT_ID = settings.GOOGLE_CLIENT_ID
    CLIENT_SECRET = settings.GOOGLE_CLIENT_SECRET
    DISCOVERY_URL = (
        "https://accounts.google.com/.well-known/openid-configuration"
    )
    # -> https://console.cloud.google.com/apis/credentials/oauthclient?

    def authenticate(self):
        flow = self.get_flow()
        if self.callback_data:
            code = self.callback_data.get("code")
            flow.fetch_token(code=code)
            api = GoogleAPI(flow=flow)
            data = api.me()
            self.user_data = Provider.UserData(
                id=data["id"],
                token=api.token,
                email=data.get("email"),
                first_name=data.get("given_name"),
                last_name=data.get("family_name"),
                auth_picture=data.get("picture"),
                data=data,
            )
            self.redirect_url = (
                f"/{self.position}"
                if not self.position.startswith("/")
                else self.position
            ) or "/"
        else:
            self.redirect_url = flow.authorization_url()[0]

    def get_flow(self):
        return Flow.from_client_config(
            client_config={
                "web": {
                    "client_id": self.CLIENT_ID,
                    "client_secret": self.CLIENT_SECRET,
                    # "callback_urk": route,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://accounts.google.com/o/oauth2/token",
                }
            },
            scopes=[
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
                "openid",
            ],
            redirect_uri=self.callback,
        )


# API & OAuth2 bindings


class GoogleAPI:
    def __init__(self, flow):
        self.flow = flow
        self.session = self.flow.authorized_session()

    def me(self):
        return self.get("me")

    def url(self, endpoint=""):
        return f"https://www.googleapis.com/userinfo/v2/{endpoint}"

    def get(self, endpoint, params={}):
        return self.session.get(self.url(endpoint), params=params).json()

    def post(self, endpoint, data={}):
        return self.session.post(self.url(endpoint), data=data).json()

    @property
    def token(self):
        return self.flow.credentials.rapt_token
