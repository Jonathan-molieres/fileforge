from api.utils.request import Request
from apps.account.models import User
from conf.admin import admin


class UserAdmin(admin.ModelAdmin):
    fieldsets = (
        (
            "Personal info",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                    "phone",
                ),
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_verified",
                    "is_staff",
                    "is_admin",
                    "is_superuser",
                    "is_debugging",
                    "is_cgu_accepted",
                ),
            },
        ),
        (
            "search for cvtheque",
            {
                "fields": ("current_search",),
            },
        ),
    )

    list_display = (
        "email",
        "phone",
        "is_verified",
        "is_staff",
        "is_superuser",
        "created_at",
    )
    search_fields = ("email", "phone")
    ordering = ("-created_at",)
    list_filter = ("is_verified", "is_staff", "is_superuser")

    def has_view_permission(self, request: Request, obj=None):
        return request.user.is_superuser

    def has_module_permission(self, request: Request, obj=None):
        return request.user.is_superuser

    def has_permission(self, request: Request, obj=None):
        return request.user.is_superuser


admin.site.register(User, UserAdmin)
