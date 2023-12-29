import uuid
from typing import Any
from uuid import UUID

from django.db import models
from django.db.models.base import ModelBase

__all__ = ["Model"]


class Meta(ModelBase):
    def __new__(cls, name, bases, attrs, **kwargs):
        super_new = super().__new__(cls, name, bases, attrs, **kwargs)
        # if hasattr(super_new, "dumps"):
        #     setattr(super_new, "dumps", super_dumps(super_new.dumps))
        return super_new


class FastModel(models.Model):
    class Meta:
        abstract = True

    objects = models.Manager()

    def __init__(self, *args, **kwargs):
        self._unsaved_diffs: list[tuple[str, Any, Any]] = []
        super().__init__(*args, **kwargs)

    def register(self, **kwargs) -> None:
        for name, value in kwargs.items():
            old_value = getattr(self, name)
            if old_value != value:
                setattr(self, name, value)
                self._unsaved_diffs.append((name, old_value, value))

    @property
    def is_created(self) -> bool:
        return self.pk is None

    @property
    def updated_fields(self) -> set[str] | bool:
        if len(self._unsaved_diffs) == 0:
            return self.is_created
        return {diff[0] for diff in self._unsaved_diffs}

    def save(self, *args, **kwargs):
        if self.is_created:
            kwargs["update_fields"] = None
        super().save(*args, **kwargs)
        self._unsaved_diffs = []


class Model(FastModel, metaclass=Meta):
    class Meta:
        abstract = True

    id: UUID = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    @property
    def is_created(self) -> bool:
        return not self.pk or self.created_at is None

    def save(self, *args, **kwargs):
        if not self.is_created:
            kwargs["update_fields"] = None
        super().save(*args, **kwargs)
        self._unsaved_diffs = []
