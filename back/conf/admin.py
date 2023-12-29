from apps.account.models.user import User
from django.conf import settings
from django.contrib import admin
from django.contrib.auth import login
from django.http import HttpResponseRedirect
from django.utils.translation import gettext_lazy as _
from django_api_admin.sites import APIAdminSite

__all__ = ["AdminSite"]

BaseAdminClass: APIAdminSite | admin.AdminSite = (
    APIAdminSite if settings.API_MODE else admin.AdminSite
)


class AdminSite(BaseAdminClass):
    site_title = _("Admin")
    site_header = _("Admin")
    index_title = _("Admin")

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            # url(
            #     r"dev$",
            #     self.admin_view("apps.core.dev"),
            #     name="preview",
            # ),
        ]
        return urls + custom_urls

    # def login(self, request, extra_context=None):
    #     return HttpResponseRedirect("/login/")

    # def login(self, request, extra_context=None):
    #     token = request.COOKIES.get("token")
    #     try:
    #         request.user = User.objects.get(session_token=token)
    #         login(
    #             request,
    #             request.user,
    #         )
    #         return HttpResponseRedirect("/admin")
    #     except BaseException as e:
    #         print(e)
    #         return HttpResponseRedirect("/login")

    # def each_context(self, request):
    #     context = super().each_context(request)
    #     context["site_url"] = "/cvtheque/"
    #     return context


site = AdminSite()

admin.site = site
admin.site.enable_nav_sidebar = False
admin.autodiscover()
