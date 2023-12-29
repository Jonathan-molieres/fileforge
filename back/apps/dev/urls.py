from django.urls import path, re_path
from django.conf.urls.static import static

from . import views


urlpatterns = [
    path("", views.GraphModels.as_view(), name="graph-models"),
] + static("statics/", document_root="/app/apps/dev/statics/dev/")
