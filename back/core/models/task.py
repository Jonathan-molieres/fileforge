from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

__all__ = ["Task"]


class QuerySet(models.QuerySet):
    pass


class Manager(models.Manager):
    def get_queryset(self):
        return QuerySet(self.model, using=self._db)

    def running(self, name):
        return self.filter(completed_at=None, name=name)

    def last_task(self, name):
        """Retourne la dernière tâche si elle existe"""
        try:
            return self.filter(name=name).latest("created_at")
        except self.model.DoesNotExist:
            return None


class Task(models.Model):
    class Meta:
        ordering = ("-created_at",)

    objects: Manager = Manager()
    Manager = Manager
    QuerySet = QuerySet

    # date
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    updated_at = models.DateTimeField(
        _("Updated at"), auto_now=True, db_index=True
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="+",
        verbose_name=_("Created by"),
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    completed_at = models.DateTimeField(
        _("Completed at"), null=True, blank=True
    )

    name = models.CharField("Name", max_length=500, db_index=True)
    title = models.CharField(
        "Title", max_length=500, db_index=True, null=True, blank=True
    )
    tags = models.CharField(
        "Tags", max_length=500, db_index=True, null=True, blank=True
    )

    message = models.TextField("Message", null=True, blank=True)
    error = models.TextField("Errors", null=True, blank=True)
    data = models.JSONField("Output data", default=dict)

    id_celery = models.CharField(
        "Celery id", unique=True, null=True, blank=True
    )

    @property
    def time_delta(self):
        if self.completed_at is not None:
            return self.completed_at - self.created_at
        else:
            return None

    @property
    def has_error(self) -> bool:
        return bool(self.error)
