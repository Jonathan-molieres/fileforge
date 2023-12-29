import logging
import os

from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = """Little help to describe the command
        \nusage:   de manage.py gitlab <command>  
        \ntask_name = """

    def add_arguments(self, parser):
        parser.add_argument("commands", nargs="+", type=str)

    def handle(self, commands, *args, **options):
        import gitlab

        print(commands)

        self.gl = gitlab.Gitlab(private_token=os.getenv("GITLAB_PRIVATE_TOKEN"))
        self.gl.auth()

        if "move" in commands:
            self.move_issues()

        if "cleanup" in commands:
            self.clean_issues()

    @property
    def old_cvtheque_project(self):
        return self.gl.projects.get(46686567)

    def clean_issues(self):
        for project in [self.workandyou_project]:
            for issue in project.issues.list(get_all=True):
                if issue.weight is None:
                    issue = project.issues.get(issue.get_id())
                    issue.weight = 1
                    issue.save()

                if (
                    issue.state == "closed"
                    and "workflow::Terminé" not in issue.labels
                ):
                    issue = project.issues.get(issue.get_id())
                    issue.labels = issue.labels + ["workflow::Terminé"]
                    issue.save()
