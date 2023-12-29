import logging
import os
from pathlib import Path

import django
from celery import Celery
from celery.app.log import TaskFormatter
from celery.signals import after_setup_logger
from conf.scheduler import SCHEDULED_TASKS
from django.conf import settings

__all__ = ["app"]

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "conf.settings")

logger = logging.getLogger(__name__)

django.setup()


@after_setup_logger.connect
def setup_loggers(logger, *args, **kwargs):
    for handler in logger.handlers:
        # handler.setFormatter(TaskFormatter('%(asctime)s - %(task_id)s - %(task_name)s - %(name)s - %(levelname)s - %(message)s'))
        handler.setFormatter(TaskFormatter("%(message)s"))

    logger.setLevel(logging.INFO)


app = Celery(
    __name__,
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    result_expires=120,
    accept_content=["application/json", "json"],
    broker_connection_retry_on_startup=True,
    enable_utc=True,
    task_ignore_result=True,
    task_track_started=True
    # task_always_eager=True
)


app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
# app.autodiscover_tasks(
#     ["conf.tasks"], related_name=Path(settings.BASE_DIR) / "tasks.py"
# )
for file in os.listdir(Path(settings.BASE_DIR) / "tasks"):
    if (
        file.startswith("__")
        or file.endswith(".pyc")
        or not file.endswith(".py")
    ):
        continue
    file = file[:-3]
    name = os.path.basename(file)
    app.autodiscover_tasks([f"tasks.{name}"], related_name=file, force=True)


app.conf.beat_schedule = SCHEDULED_TASKS
app.conf.timezone = "UTC"


# def async_task(async_def):
#     wrapped = async_to_sync(async_def)
#     wrapped.__name__ = async_def.__name__
#     wrapped.__annotations__ = async_def.__annotations__
#     return app.task(wrapped)


@app.task(bind=True)
def debug_task(self):
    print("Request: {0!r}".format(self.request))
