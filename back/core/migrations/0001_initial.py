from django.contrib.postgres.operations import (
    BtreeGinExtension,
    BtreeGistExtension,
    CreateExtension,
    HStoreExtension,
    TrigramExtension,
    UnaccentExtension,
)
from django.db import migrations
from django.db.migrations.operations.base import Operation


class TextSearchExtension(Operation):
    reversible = True

    def state_forwards(self, app_label, state):
        pass

    def database_forwards(self, app_label, schema_editor, from_state, to_state):
        if schema_editor.connection.vendor != "postgresql":
            return
        try:
            schema_editor.execute(
                "CREATE TEXT SEARCH CONFIGURATION french_unaccent( COPY = french )"
            )
            schema_editor.execute(
                "ALTER TEXT SEARCH CONFIGURATION french_unaccent ALTER MAPPING FOR hword, hword_part, word WITH unaccent, french_stem"
            )
        except:
            print("French text search already exists")
            return

    def database_backwards(
        self, app_label, schema_editor, from_state, to_state
    ):
        schema_editor.execute(
            "DROP TEXT SEARCH CONFIGURATION IF EXISTS french_unaccent"
        )

    def describe(self):
        return "Creates french text search"


class Migration(migrations.Migration):
    initial = True

    operations = [
        CreateExtension("postgis"),
        CreateExtension("postgis_raster"),
        CreateExtension("postgis_topology"),
        HStoreExtension(),
        TrigramExtension(),
        BtreeGinExtension(),
        BtreeGistExtension(),
        UnaccentExtension(),
        TextSearchExtension(),
    ]
