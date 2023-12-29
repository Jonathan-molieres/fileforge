import random
import string

import requests
from api.routes.account.authenticate_providers import Provider
from django.conf import settings


class LinkedinProvider(Provider):
    CLIENT_ID = settings.LINKEDIN_CLIENT_ID
    CLIENT_SECRET = settings.LINKEDIN_CLIENT_SECRET
    AUTH_REDIRECT_URI = settings.LINKEDIN_AUTH_REDIRECT_URI

    def get_redirect_url(self, callback):
        state = "".join(
            random.choice(string.ascii_lowercase) for i in range(20)
        )
        return requests.get(
            "https://www.linkedin.com/oauth/v2/authorization",
            params={
                "response_type": "code",
                "client_id": self.CLIENT_ID,
                "redirect_uri": callback,
                "state": state,
                "scope": "r_liteprofile,r_emailaddress,w_member_social",
            },
        ).url

    def exchange_token(self, code: str):
        access_token = requests.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": self.AUTH_REDIRECT_URI,
                "client_id": self.CLIENT_ID,
                "client_secret": self.CLIENT_SECRET,
            },
            timeout=30,
        ).json()["access_token"]

        api = API(access_token)
        api.me(
            {
                "projection": "(id,email,localizedLastName,localizedFirstName,profilePicture(displayImage~digitalmediaAsset:playableStreams))"
            }
        )
        emailData = api.get(
            "emailAddress",
            {"q": "members", "projection": "(elements*(handle~))"},
        )
        (
            emailData.get("elements", [{}])[0]
            .get("handle~", {})
            .get("emailAddress", "")
        )


# API & OAuth2 bindings


class API:
    def __init__(self, token):
        self.token = token

    def me(self, params={}):
        return self.get(
            "me",
            params=params,
        )

    def url(self, endpoint=""):
        return f"https://api.linkedin.com/v2/{endpoint}"

    def get(self, endpoint, params={}):
        return requests.get(
            self.url(endpoint),
            params=params,
            headers=self.headers,
        ).json()

    def post(self, endpoint, data={}):
        return requests.post(
            self.url(endpoint),
            data=data,
            headers=self.headers,
        ).json()

    @property
    def headers(self):
        return {
            "Authorization": f"Bearer {self.token}",
            "cache-control": "no-cache",
            "X-Restli-Protocol-Version": "2.0.0",
        }
