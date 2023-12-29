from apps.manager.models import File
from conf.admin import admin
from utils.db.convert_human_function import convert_human_size
from utils.db.django_admin import ModelAdmin


class FileAdmin(ModelAdmin):
    list_display = ("name", "display_size", "type", "updated_at", "created_at")
    list_filter = ("type",)
    fieldsets = (
        (
            "Fichier",
            {
                "fields": (
                    "content",
                    "type",
                    "user",
                )
            },
        ),
    )

    def display_size(self, obj):
        return convert_human_size(obj.size)

    display_size.short_description = "Taille"

    def save_model(self, request, obj, form, change):
        if not obj.user:
            obj.user = request.user
        super().save_model(request, obj, form, change)


admin.site.register(File, FileAdmin)
