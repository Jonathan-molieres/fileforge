from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)

if TYPE_CHECKING:
    from django.db.models.manager import RelatedManager

from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from nanoid import generate as nanoid
from phonenumber_field.modelfields import PhoneNumberField
from utils import is_valid_email
from utils.db import Model

__all__ = ["User"]
logger = logging.getLogger(__name__)


class QuerySet(models.QuerySet):
    def verified(self):
        return self.filter(is_verified=False)


class Manager(BaseUserManager):
    def get_queryset(self):
        return QuerySet(self.model, using=self._db)

    def create_anonymous(self) -> User:
        return self.create(is_verified=False)


class User(Model, AbstractBaseUser, PermissionsMixin):
    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("utilisateur")
        verbose_name_plural = _("utilisateurs")

    objects: Manager = Manager()
    Manager = Manager
    QuerySet = QuerySet

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"

    email = models.EmailField(unique=True, null=True, blank=True)
    phone = PhoneNumberField(unique=True, null=True, blank=True)
    username = models.CharField(max_length=254, null=True, blank=True)

    # Auth
    session_token = models.CharField(max_length=2000, unique=True, null=True)
    session_token_created_at = models.DateTimeField(null=True)
    auth_redirect = models.CharField(
        max_length=1500, null=True, help_text="Url post login"
    )

    is_verified = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(
        _("superuser status"),
        default=False,
        help_text=_(
            "Designates that this user has all permissions without "
            "explicitly assigning them."
        ),
    )
    is_debugging = models.BooleanField(default=False)
    is_cgu_accepted = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        to="auth.Group",
        verbose_name=_("groups"),
        blank=True,
        help_text=_(
            "The groups this user belongs to. A user will get all permissions "
            "granted to each of their groups."
        ),
        related_name="users",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        to="auth.Permission",
        verbose_name=_("user permissions"),
        blank=True,
        help_text=_("Specific permissions for this user."),
        related_name="users",
        related_query_name="user",
    )

    # Personnal
    first_name = models.CharField(max_length=254, null=True)
    last_name = models.CharField(max_length=254, null=True)
    birth_date = models.DateField(null=True)
    auth_picture = models.TextField(null=True)

    # Google
    google_id = models.CharField(
        unique=True, max_length=254, null=True, blank=True
    )
    google_token = models.CharField(max_length=2000, null=True, blank=True)

    meta = models.JSONField(default=None, null=True, blank=True)

    def save(self, *args, **kwargs):
        if "update_fields" in kwargs:
            update_fields = list(kwargs["update_fields"])
        else:
            update_fields = None

        if not self.session_token:
            self.session_token = nanoid()
            if update_fields:
                update_fields.append("session_token")

        if not self.session_token_created_at:
            self.session_token_created_at = timezone.now()

        if self.username:
            self.username_slug = slugify(self.username)
            if update_fields and "username" in update_fields:
                update_fields.append("username_slug")
        else:
            self.username = None

        if self.is_admin is True:
            self.is_staff = True
            if update_fields and "is_admin" in update_fields:
                update_fields.append("is_staff")

        if self.is_superuser is True:
            self.is_admin = True
            self.is_staff = True
            if update_fields and "is_superuser" in update_fields:
                update_fields.append("is_admin")
                update_fields.append("is_staff")

        if self.is_debugging is True:
            self.is_debugging = self.is_superuser

        if self.email:
            if not is_valid_email(self.email):
                logger.error(f"This email address is not valid : {self.email}")
                self.email = None

        if update_fields and "update_fields" in kwargs:
            kwargs["update_fields"] = update_fields

        super().save(*args, **kwargs)

    def __str__(self):
        return self.email or self.phone or str(self.id) or ""

    @property
    def is_anonymous(self):
        """
        The user is anonymous if he has no email or phone verified way to
        """
        return not self.is_verified
