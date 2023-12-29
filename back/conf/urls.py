from conf.admin import site
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

urlpatterns = []

if settings.API_MODE:
    urlpatterns += [re_path(r"^", site.urls)]
else:
    urlpatterns += [re_path(r"^admin/", site.urls)]


if settings.DEBUG:
    schema_view = get_schema_view(
        openapi.Info(
            title="ACT4ECO API",
            default_version="v1",
        ),
        url=f"http{'s' if settings.PORT ==  443 else ''}://localhost:{settings.PORT}",
        public=True,
        permission_classes=(permissions.AllowAny,),
    )
    urlpatterns += [
        path(
            "",
            schema_view.with_ui("swagger", cache_timeout=0),
            name="schema-swagger-ui",
        ),
        re_path(r"^dev/", include("apps.dev.urls")),
        path("__debug__/", include("debug_toolbar.urls")),
    ]
    urlpatterns += static(
        settings.STATIC_URL, document_root=settings.STATIC_ROOT
    )

if settings.DEV_MODE:
    from django.conf import settings
    from django.conf.urls.static import static

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
