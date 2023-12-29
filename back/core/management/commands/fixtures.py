import logging

from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connections

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = """Load fixtures based on command-line arguments"""

    def add_arguments(self, parser):
        parser.add_argument(
            "fixtures", nargs="*", type=str, help="Specify the fixtures to load"
        )

    def handle(self, *args, **kwargs):
        fixtures = kwargs.get("fixtures", [])

        if not fixtures:  # all fixtures
            # with connections["legacy"].cursor() as cursor:
            #     cursor.execute(
            #         '''UPDATE django_migrations SET app="jobs_legacy" WHERE app="jobs"'''
            #     )
            call_command("default_matrix")
        else:  # specific fixtures
            for fixture in fixtures:
                call_command(fixture)
