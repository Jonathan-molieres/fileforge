from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "fake data"

    def handle(self, *args, **options):
        User = get_user_model()
        if not settings.DEV_MODE:
            raise Exception("Not in dev mode")
        print("[Fake] fake data start")
        user_dev, _ = User.objects.get_or_create(
            username="dev",
            defaults={
                "is_staff": True,
                "is_superuser": True,
            },
        )
        user_dev.set_password("dev")
        user_dev.save()
        print("[Fake] user dev created")
