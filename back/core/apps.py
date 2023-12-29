from django.apps import AppConfig


class Config(AppConfig):
    name = "core"
    label = "core"

    def ready(self):
        pass
