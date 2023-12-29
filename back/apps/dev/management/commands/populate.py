import re

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import connection, transaction


class Command(BaseCommand):
    help = "Populates the database with initial data"
    sql_file = "cvtheque_cv.sql"

    def convert_statement(self, statement):
        statement = statement.replace("'", "''")
        statement = re.sub(r"’", "'", statement)
        statement = re.sub(r"“|”", '"', statement)
        return statement

    def handle(self, *args, **options):
        if not settings.DEV_MODE:
            raise Exception("Not in dev mode")

        with open(self.sql_file, "r") as f:
            sql_statements = f.read()
        statements = sql_statements.split(";")
        with connection.cursor() as cursor:
            with transaction.atomic():
                for statement in statements:
                    sql_statement = statement.strip()

                    if sql_statement:
                        sql_statement = self.convert_statement(sql_statement)

                        try:
                            cursor.execute(sql_statement)
                        except Exception as e:
                            self.stdout.write(
                                self.style.ERROR(f"Error executing SQL: {e}")
                            )

        self.stdout.write(self.style.SUCCESS("Database populated successfully"))
