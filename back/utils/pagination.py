from django.core.paginator import Page as BasePage
from django.core.paginator import Paginator as BasePaginator

__all__ = ["paginate"]


class Page(BasePage):
    @property
    def count(self):
        return self.paginator.count

    @property
    def limit(self):
        return self.paginator.per_page

    @property
    def page(self):
        return self.number

    @property
    def rows(self) -> list:
        return list(self)


class Paginator(BasePaginator):
    def _get_page(self, *args, **kwargs):
        return Page(*args, **kwargs)


def paginate(
    qs, data={}, output=lambda o: dict(id=o.pk), page=1, limit=25
) -> Page:
    try:
        page = int(data.get("page", page))
    except (KeyError, ValueError, TypeError):
        page = 1

    try:
        limit = max(1, min(100, int(data.get("limit", limit))))
    except (KeyError, ValueError, TypeError):
        limit = 25

    paginator = Paginator(qs, limit)
    return paginator.get_page(page)
