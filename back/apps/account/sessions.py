from apps.account.models import User
from django.core.cache import cache
from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver


class Sessions:
    def get_session_cache_key(self, token) -> str:
        """Return the cache key for a session token."""
        return f"sessions.{token }"

    def user_deleted(self, session_token) -> None:
        """Delete the session when the user is deleted."""
        cache.delete(self.get_session_cache_key(session_token))

    def get_user(self, session_token) -> User:
        """Return the user for a session token."""
        return cache.get(self.get_session_cache_key(session_token))

    def set_user(self, session_token, user) -> None:
        """Set the user for a session token."""
        cache.set(self.get_session_cache_key(session_token), user, 60 * 60 * 24)


sessions = Sessions()


@receiver(pre_delete, sender=User, dispatch_uid="user_deleted")
def user_pre_deleted(sender, instance, **kwargs) -> None:
    sessions.user_deleted(instance.session_token)


@receiver(pre_save, sender=User, dispatch_uid="user_save")
def user_pre_save(sender, instance, **kwargs) -> None:
    sessions.user_deleted(instance.session_token)
