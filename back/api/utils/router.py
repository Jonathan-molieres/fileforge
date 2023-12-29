import typing

from fastapi import APIRouter as BaseAPIRouter
from fastapi import Response
from fastapi.routing import APIRoute as BaseAPIRoute

from .request import Request

__all__ = ["APIRouter"]


class APIRoute(BaseAPIRoute):
    """
    This sets up a custom route handler for the APIRoute class.
    The custom route handler signs the response with the request's sessionToken.
    This is important because it prevents the response from being modified in transit.
    """

    Request: Request

    def get_route_handler(self) -> typing.Callable:
        """wrap the default route handler to override the request and the response

        Returns:
            typing.Callable: handler for Coroutine of Response method
        """
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:
            request = Request(request.scope, request.receive)
            response = await original_route_handler(request=request)
            request.sign_response(response)
            return response

        return custom_route_handler


class APIRouter(BaseAPIRouter):
    """
    A custom APIRouter class to inject the custom route class
    """

    def __init__(self, *args, **kwargs):
        """inject the custom route class in the kwargs"""
        kwargs["route_class"] = APIRoute
        super().__init__(*args, **kwargs)
