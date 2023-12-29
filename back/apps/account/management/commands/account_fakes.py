from apps.account.models import User
from django.core.management.base import BaseCommand
from faker import Faker

faker = Faker(["fr-FR"])

max_hordes = 100


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        user, _ = User.objects.get_or_create(email="dev@dev")
        user.is_active = True
        user.is_superuser = True
        user.is_staff = True
        user.save()
        user.set_password("dev")
        user.save()
