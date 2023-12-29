from api.utils import Request
from conf.admin import admin


class ModelAdmin(admin.ModelAdmin):
    """Base class for all model admins and gestion of permissions.
    If the user is staff, they can view.
    If the user is a superuser, they can view, add, change, and delete.
    """

    ordering = ("-created_at",)

    def has_view_permission(self, request: Request, obj=None):
        return request.user.is_superuser or request.user.is_staff

    def has_module_permission(self, request: Request, obj=None):
        return request.user.is_superuser or request.user.is_staff

    def has_permission(self, request: Request, obj=None):
        return request.user.is_superuser
