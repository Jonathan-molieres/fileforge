import logging
import os

from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = """Little help to describe the command
        \nusage:   de manage.py task <task_name>  
        \ntask_name = """

    def add_arguments(self, parser):
        parser.add_argument("task", nargs="+", type=str)

    def handle(self, *args, **options):
        from bin._celery import app

        task_name = options.get("task")[0]
        task = app.tasks.get(task_name)
        if task:
            task.apply_async()
            logger.info(f"Task '{task_name}' scheduled for now.")
        else:
            task_folder = os.path.abspath("tasks")
            files = os.listdir(task_folder)
            task_files = [
                os.path.splitext(file)[0]
                for file in files
                if os.path.isfile(os.path.join(task_folder, file))
                and file != "__init__.py"
            ]
            logger.warning(f"Task '{task_name}' not found.")
            logger.warning(f"{self.help} {task_files}")
