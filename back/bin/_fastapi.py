import logging
import os

import django
from django.conf import settings
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from django.core.wsgi import get_wsgi_application
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.wsgi import WSGIMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "conf.settings")
os.environ.setdefault("API_MODE", "1")

logger = logging.getLogger(__name__)

django.setup()

app = FastAPI(
    version="1.0",
    openapi_tags=[
        {
            "name": "Dev",
            "description": "Dev",
        },
    ],
    root_path="/api",
    docs_url="/",
    # redoc_url="/api"
    openapi_url="/openapi.json" if settings.DEV_MODE else None,
    # servers=[{"url": settings.ROOT_URL}],
)


from api.routes import router  # noqa

app.include_router(router)
#### Handler Executed for all requests ####


# handler for pydantic validation errors
@app.exception_handler(ValidationError)
async def validation_error_handler(request, exc: ValidationError):
    return JSONResponse(status_code=422, content={"errors": exc.errors()})


# handler for django object does not exist errors
@app.exception_handler(ObjectDoesNotExist)
async def does_not_exist_error_handler(request, exc: ObjectDoesNotExist):
    return JSONResponse(status_code=404, content={"error": {"msg": str(exc)}})


# # handler for django multiple objects returned errors
# @app.exception_handler(MultipleObjectsReturned)
# async def multiple_objects_returned_error_handler(
#     request, exc: MultipleObjectsReturned
# ):
#     return JSONResponse({"error": {"msg": str(exc)}}, status_code=404)


# # handler for value errors
# @app.exception_handler(ValueError)
# async def value_error_error_handler(request, exc: ValueError):
#     return JSONResponse({"error": {"msg": str(exc)}}, status_code=404)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.ALLOWED_HOSTS] or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

application = get_wsgi_application()
app.mount("/admin", WSGIMiddleware(application))
