from __future__ import annotations

from django.db import models
from django.utils.translation import gettext_lazy as _
from utils.db import Model

__all__ = ["File"]


class QuerySet(models.QuerySet):
    pass


class Manager(models.Manager):
    def get_queryset(self):
        return QuerySet(self.model, using=self._db)


class File(Model):
    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("fichier")
        verbose_name_plural = _("fichiers")

    class types(models.TextChoices):
        tax = "tax", _("impot")
        bulletin = "bulletin", _("bulletin")
        bank = "bank", _("banque")
        mutual = "mutual", _("mutuelle")

    def get_upload_path(instance, filename):
        return f"media/files/{instance.type}/{filename}"

    content = models.FileField(upload_to=get_upload_path)
    name = models.CharField(max_length=100, blank=True)
    size = models.IntegerField(blank=True)
    type = models.CharField(max_length=100, choices=types.choices)
    mimetypes = models.CharField(max_length=100, blank=True)
    user = models.ForeignKey("account.user", on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        self.size = self.content.size
        self.name = self.content.name
        self.mimetypes = self.content.file.content_type
        super().save(*args, **kwargs)
