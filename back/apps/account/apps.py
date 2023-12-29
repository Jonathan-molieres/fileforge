from django.apps import AppConfig


class Config(AppConfig):
    name = "apps.account"
    label = "account"
    verbose_name = "Account"

    def ready(self):
        from .sessions import sessions  # noqa
