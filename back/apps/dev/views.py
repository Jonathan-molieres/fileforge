from django.apps import apps as django_apps
from django.db.models.fields.related import (
    ForeignKey,
)
from django.http import JsonResponse
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView


class GraphModels(APIView):
    """
    Return all the models definitions in a graph format.
    """

    authentication_classes: list = []
    permission_classes: list = []
    renderer_classes: list = [TemplateHTMLRenderer]

    def get(self, request):
        return Response(
            template_name="dev/graph_models.html",
        )

    def post(self, request):
        print(request.data)
        return JsonResponse(
            self.get_graph(
                include_apps=request.data.get(
                    "includeApps", request.data.get("include_apps", [])
                ),
                show_attributes=request.data.get(
                    "showAttributes",
                    request.data.get("show_attributes", True),
                ),
                show_null_attributes=request.data.get(
                    "showNullAttributes",
                    request.data.get("show_null_attributes", True),
                ),
                show_attribute_types=request.data.get(
                    "showAttributeTypes",
                    request.data.get("show_attribute_types", False),
                ),
                show_relevant=request.data.get(
                    "showRelevant", request.data.get("show_relevant", True)
                ),
            ),
        )

    def get_graph(
        self,
        include_apps=[],
        show_attributes=True,
        show_null_attributes=True,
        show_attribute_types=False,
        show_relevant=True,
    ):
        """
        Return a graph of all the models.
        """
        nodes = []
        links = []
        apps = []
        print(include_apps)

        for app_name, app in django_apps.app_configs.items():
            if app_name in ["contenttypes"]:
                continue

            app_models = list(app.get_models())
            if len(app_models) > 0:
                apps.append(app_name)

            if app_name not in include_apps:
                continue

            for app_model in app_models:
                if not app_model._meta.abstract and not (
                    getattr(app_model, "_hide_model_in_graph_view ", False)
                    and show_relevant
                ):
                    items = []
                    model_key = f"{app_name}:{app_model.__name__}"
                    for field in app_model._meta.local_fields:
                        if field.primary_key:
                            figure = "Triangle"
                            color = "#9c27b0"
                        elif field.remote_field:
                            figure = "Diamond"
                            color = "#ff9900"
                        else:
                            figure = "Ellipse"
                            color = "#22b8f2"

                        if show_attributes and (
                            field.remote_field
                            or not field.null
                            or show_null_attributes
                        ):
                            items.append(
                                {
                                    "name": f'{field.name}{ "?" if field.null else ""}',
                                    "iskey": field.primary_key,
                                    "figure": figure,
                                    "color": color + "50"
                                    if field.null
                                    else color,
                                    "info": f" :: {field.get_internal_type()}"
                                    if show_attribute_types
                                    else None,
                                }
                            )

                        if isinstance(field, ForeignKey):
                            remote_model_key = f"{field.remote_field.model._meta.app_label}:{field.remote_field.model.__name__}"
                            links.append(
                                {
                                    "from": model_key,
                                    "to": remote_model_key,
                                    "text": f'{ "0" if field.null else "1"}+',
                                    "toText": f'{ "0" if field.null else "1"}',
                                }
                            )

                    for field in app_model._meta.local_many_to_many:
                        remote_model_key = f"{field.remote_field.model._meta.app_label}:{field.remote_field.model.__name__}"
                        links.append(
                            {
                                "from": model_key,
                                "to": remote_model_key,
                                "text": "*",
                                "toText": "*",
                            }
                        )
                    nodes.append(
                        {
                            "app": app_name,
                            "key": model_key,
                            "model": app_model.__name__,
                            "items": items,
                        }
                    )

        return {"nodes": nodes, "links": links, "apps": apps}
