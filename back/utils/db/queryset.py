import math
from base64 import b64decode, b64encode
from collections import Sequence
from functools import reduce

from django.core.paginator import (
    EmptyPage,
    InvalidPage,
    Page,
    PageNotAnInteger,
    Paginator,
    QuerySetPaginator,
)
from django.db.models import Field, Func, TextField, Value
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

__all__ = (
    "InvalidPage",
    "ExPaginator",
    "DiggPaginator",
    "QuerySetDiggPaginator",
    "SortedQueryset",
    "ListTable",
    "slug_for_search",
    "chunked_queryset_iterator",
)


def slug_for_search(value):
    return slugify(value.replace("_", ""))


class ExPage(Page):
    def page_to_json(self):
        return {
            "paginator": {
                "count": self.paginator.count,
                "num_pages": self.paginator.num_pages,
            },
            "page_range": self.page_range,
            "has_next": self.has_next(),
            "has_previous": self.has_previous(),
            "has_other_pages": self.has_other_pages(),
            "next_page_number": self.next_page_number()
            if self.has_next()
            else None,
            "previous_page_number": self.previous_page_number()
            if self.has_previous()
            else None,
            "start_index": self.start_index(),
            "end_index": self.end_index(),
            "number": self.number,
        }


class ExPaginator(Paginator):
    """Adds a ``softlimit`` option to ``page()``. If True, querying a
    page number larger than max. will not fail, but instead return the
    last available page.

    This is useful when the data source can not provide an exact count
    at all times (like some search engines), meaning the user could
    possibly see links to invalid pages at some point which we wouldn't
    want to fail as 404s.

    >>> items = range(1, 1000)
    >>> paginator = ExPaginator(items, 10)
    >>> paginator.page(1000)
    Traceback (most recent call last):
    InvalidPage: That page contains no results
    >>> paginator.page(1000, softlimit=True)
    <Page 100 of 100>

    # [bug] graceful handling of non-int args
    >>> paginator.page("str")
    Traceback (most recent call last):
    InvalidPage: That page number is not an integer
    """

    def _ensure_int(self, num, e):
        # see Django #7307
        try:
            return int(num)
        except ValueError:
            raise e

    def _get_page(self, *args, **kwargs):
        return ExPage(*args, **kwargs)

    def page(self, number, softlimit=False):
        try:
            return super(ExPaginator, self).page(number)
        except InvalidPage as e:
            number = self._ensure_int(number, e)
            if number > self.num_pages and softlimit:
                return self.page(self.num_pages, softlimit=False)
            else:
                raise e


class DiggPaginator(ExPaginator):
    """
    Based on Django's default paginator, it adds "Digg-style" page ranges
    with a leading block of pages, an optional middle block, and another
    block at the end of the page range. They are available as attributes
    on the page:

    {# with: page = digg_paginator.page(1) #}
    {% for num in page.leading_range %} ...
    {% for num in page.main_range %} ...
    {% for num in page.trailing_range %} ...

    Additionally, ``page_range`` contains a nun-numeric ``False`` element
    for every transition between two ranges.

    {% for num in page.page_range %}
        {% if not num %} ...  {# literally output dots #}
        {% else %}{{ num }}
        {% endif %}
    {% endfor %}

    Additional arguments passed to the constructor allow customization of
    how those bocks are constructed:

    body=5, tail=2

    [1] 2 3 4 5 ... 91 92
    |_________|     |___|
    body            tail
              |_____|
              margin

    body=5, tail=2, padding=2

    1 2 ... 6 7 [8] 9 10 ... 91 92
            |_|     |__|
             ^padding^
    |_|     |__________|     |___|
    tail    body             tail

    ``margin`` is the minimum number of pages required between two ranges; if
    there are less, they are combined into one.

    When ``align_left`` is set to ``True``, the paginator operates in a
    special mode that always skips the right tail, e.g. does not display the
    end block unless necessary. This is useful for situations in which the
    exact number of items/pages is not actually known.

    # odd body length
    >>> print DiggPaginator(range(1,1000), 10, body=5).page(1)
    1 2 3 4 5 ... 99 100
    >>> print DiggPaginator(range(1,1000), 10, body=5).page(100)
    1 2 ... 96 97 98 99 100

    # even body length
    >>> print DiggPaginator(range(1,1000), 10, body=6).page(1)
    1 2 3 4 5 6 ... 99 100
    >>> print DiggPaginator(range(1,1000), 10, body=6).page(100)
    1 2 ... 95 96 97 98 99 100

    # leading range and main range are combined when close; note how
    # we have varying body and padding values, and their effect.
    >>> print DiggPaginator(range(1,1000), 10, body=5, padding=2, margin=2).page(3)
    1 2 3 4 5 ... 99 100
    >>> print DiggPaginator(range(1,1000), 10, body=6, padding=2, margin=2).page(4)
    1 2 3 4 5 6 ... 99 100
    >>> print DiggPaginator(range(1,1000), 10, body=5, padding=1, margin=2).page(6)
    1 2 3 4 5 6 7 ... 99 100
    >>> print DiggPaginator(range(1,1000), 10, body=5, padding=2, margin=2).page(7)
    1 2 ... 5 6 7 8 9 ... 99 100
    >>> print DiggPaginator(range(1,1000), 10, body=5, padding=1, margin=2).page(7)
    1 2 ... 5 6 7 8 9 ... 99 100

    # the trailing range works the same
    >>> print DiggPaginator(range(1,1000), 10, body=5, padding=2, margin=2, ).page(98)
    1 2 ... 96 97 98 99 100
    >>> print DiggPaginator(range(1,1000), 10, body=6, padding=2, margin=2, ).page(97)
    1 2 ... 95 96 97 98 99 100
    >>> print DiggPaginator(range(1,1000), 10, body=5, padding=1, margin=2, ).page(95)
    1 2 ... 94 95 96 97 98 99 100
    >>> print DiggPaginator(range(1,1000), 10, body=5, padding=2, margin=2, ).page(94)
    1 2 ... 92 93 94 95 96 ... 99 100
    >>> print DiggPaginator(range(1,1000), 10, body=5, padding=1, margin=2, ).page(94)
    1 2 ... 92 93 94 95 96 ... 99 100

    # all three ranges may be combined as well
    >>> print DiggPaginator(range(1,151), 10, body=6, padding=2).page(7)
    1 2 3 4 5 6 7 8 9 ... 14 15
    >>> print DiggPaginator(range(1,151), 10, body=6, padding=2).page(8)
    1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
    >>> print DiggPaginator(range(1,151), 10, body=6, padding=1).page(8)
    1 2 3 4 5 6 7 8 9 ... 14 15

    # no leading or trailing ranges might be required if there are only
    # a very small number of pages
    >>> print DiggPaginator(range(1,80), 10, body=10).page(1)
    1 2 3 4 5 6 7 8
    >>> print DiggPaginator(range(1,80), 10, body=10).page(8)
    1 2 3 4 5 6 7 8
    >>> print DiggPaginator(range(1,12), 10, body=5).page(1)
    1 2

    # test left align mode
    >>> print DiggPaginator(range(1,1000), 10, body=5, align_left=True).page(1)
    1 2 3 4 5
    >>> print DiggPaginator(range(1,1000), 10, body=5, align_left=True).page(50)
    1 2 ... 48 49 50 51 52
    >>> print DiggPaginator(range(1,1000), 10, body=5, align_left=True).page(97)
    1 2 ... 95 96 97 98 99
    >>> print DiggPaginator(range(1,1000), 10, body=5, align_left=True).page(100)
    1 2 ... 96 97 98 99 100

    # padding: default value
    >>> DiggPaginator(range(1,1000), 10, body=10).padding
    4

    # padding: automatic reduction
    >>> DiggPaginator(range(1,1000), 10, body=5).padding
    2
    >>> DiggPaginator(range(1,1000), 10, body=6).padding
    2

    # padding: sanity check
    >>> DiggPaginator(range(1,1000), 10, body=5, padding=3)
    Traceback (most recent call last):
    ValueError: padding too large for body (max 2)
    """

    def __init__(self, *args, **kwargs):
        self.body = kwargs.pop("body", 10)
        self.tail = kwargs.pop("tail", 2)
        self.align_left = kwargs.pop("align_left", False)
        self.margin = kwargs.pop(
            "margin", 4
        )  # TODO: make the default relative to body?
        # validate padding value
        max_padding = int(math.ceil(self.body / 2.0) - 1)
        self.padding = kwargs.pop("padding", min(4, max_padding))
        if self.padding > max_padding:
            raise ValueError(
                "padding too large for body (max %d)" % max_padding
            )
        super().__init__(*args, **kwargs)

    def get_queryset_for_instance(self, instance_pk):
        try:
            instance_pk = int(instance_pk)
            if hasattr(self.object_list, "values_list") and callable(
                self.object_list.values_list
            ):
                instance_pk_list = list(
                    self.object_list.values_list("pk", flat=True)
                )
            else:
                instance_pk_list = [o.pk for o in self.object_list]
            object_index = instance_pk_list.index(instance_pk)
            page = int(math.ceil(float(object_index + 1) / self.per_page))
        except (ValueError, AttributeError, TypeError):
            # AttributeError if object_list has no count() method.
            # TypeError if object_list.count() requires arguments
            # (i.e. is of type list).
            page = 1

        return self.get_queryset_for_page(page)

    def get_queryset_for_page(self, page=1):
        if page is None:
            page = 1
        else:
            try:
                page = int(page)
            except (ValueError, TypeError) as e:
                page = 1
        try:
            queryset = self.page(page)
        except PageNotAnInteger:
            queryset = self.page(1)
        except EmptyPage:
            queryset = self.page(self.num_pages)
        return queryset

    def page(self, number, *args, **kwargs):
        """Return a standard ``Page`` instance with custom, digg-specific
        page ranges attached.
        """

        page = super().page(number, *args, **kwargs)
        number = int(number)  # we know this will work

        # easier access
        num_pages, body, tail, padding, margin = (
            self.num_pages,
            self.body,
            self.tail,
            self.padding,
            self.margin,
        )

        # put active page in middle of main range
        main_range = list(
            map(
                int,
                [
                    math.floor(number - body / 2.0)
                    + 1,  # +1 = shift odd body to right
                    math.floor(number + body / 2.0),
                ],
            )
        )
        # adjust bounds
        if main_range[0] < 1:
            main_range = list(map(abs(main_range[0] - 1).__add__, main_range))
        if main_range[1] > num_pages:
            main_range = list(
                map((num_pages - main_range[1]).__add__, main_range)
            )

        # Determine leading and trailing ranges; if possible and appropriate,
        # combine them with the main range, in which case the resulting main
        # block might end up considerable larger than requested. While we
        # can't guarantee the exact size in those cases, we can at least try
        # to come as close as possible: we can reduce the other boundary to
        # max padding, instead of using half the body size, which would
        # otherwise be the case. If the padding is large enough, this will
        # of course have no effect.
        # Example:
        #     total pages=100, page=4, body=5, (default padding=2)
        #     1 2 3 [4] 5 6 ... 99 100
        #     total pages=100, page=4, body=5, padding=1
        #     1 2 3 [4] 5 ... 99 100
        # If it were not for this adjustment, both cases would result in the
        # first output, regardless of the padding value.
        if main_range[0] <= tail + margin:
            leading = []
            main_range = [1, max(body, min(number + padding, main_range[1]))]
            main_range[0] = 1
        else:
            leading = list(range(1, tail + 1))
        # basically same for trailing range, but not in ``left_align`` mode
        if self.align_left:
            trailing = []
        else:
            if main_range[1] >= num_pages - (tail + margin) + 1:
                trailing = []
                if not leading:
                    # ... but handle the special case of neither leading nor
                    # trailing ranges; otherwise, we would now modify the
                    # main range low bound, which we just set in the previous
                    # section, again.
                    main_range = [1, num_pages]
                else:
                    main_range = [
                        min(
                            num_pages - body + 1,
                            max(number - padding, main_range[0]),
                        ),
                        num_pages,
                    ]
            else:
                trailing = list(range(num_pages - tail + 1, num_pages + 1))

        # finally, normalize values that are out of bound; this basically
        # fixes all the things the above code screwed up in the simple case
        # of few enough pages where one range would suffice.
        main_range = [max(main_range[0], 1), min(main_range[1], num_pages) - 1]

        # make the result of our calculations available as custom ranges
        # on the ``Page`` instance.
        page.main_range = list(range(main_range[0], main_range[1] + 2))
        page.leading_range = leading
        page.trailing_range = trailing
        page.page_range = reduce(
            lambda x, y: x + ((x and y) and [False]) + y,
            [page.leading_range, page.main_range, page.trailing_range],
        )

        page.__class__ = DiggPage
        return page


class DiggPage(ExPage):
    def __str__(self):
        return " ... ".join(
            filter(
                None,
                [
                    " ".join(map(str, self.leading_range)),
                    " ".join(map(str, self.main_range)),
                    " ".join(map(str, self.trailing_range)),
                ],
            )
        )


class QuerySetDiggPaginator(DiggPaginator, QuerySetPaginator):
    pass


if __name__ == "__main__":
    import doctest

    doctest.testmod()


class Paginator(DiggPaginator):
    pass


def SortedQueryset(queryset, order_by, mapping={}):
    if order_by:
        ordering = []
        for sort in [s.strip() for s in order_by.split(",")]:
            field = sort.strip("-")
            orders = mapping.get(field, field)

            if isinstance(fields, (str, bytes)):
                fields = tuple((fields,))

            if isinstance(fields, tuple):
                for field in fields:
                    if order_by[0] == "-":
                        ordering.append(F(field).desc(nulls_last=True))
                    else:
                        ordering.append(F(field).asc(nulls_last=True))

        if ordering:
            queryset.current_ordering = order_by
            queryset = queryset.order_by(*ordering)
    return queryset


def ListTable(
    queryset,
    limit=50,
    body=6,
    padding=2,
    page=1,
    ordering=None,
    ordering_mapping={},
):
    if ordering:
        queryset = SortedQueryset(queryset, ordering, ordering_mapping={})

    paginator = DiggPaginator(queryset, limit, body=body, padding=padding)
    queryset = paginator.get_queryset_for_page(page)

    return queryset


"""
Toolbox for chunking / slicing querysets
"""


class MissingPkFieldException(Exception):
    """
    Exception raised when the "pk" field is missing in the query.
    (when using ``values()``).
    """

    pass


# def chunkator_page(source_qs, chunk_size, query_log=None):
#     """
#     Yield pages of a queryset.
#     """
#     pk = None
#     # In django 1.9, _fields is always present and `None` if 'values()' is used
#     # In Django 1.8 and below, _fields will only be present if using `values()`
#     has_fields = hasattr(source_qs, '_fields') and source_qs._fields
#     if has_fields:
#         if "pk" not in source_qs._fields:
#             raise MissingPkFieldException("The values() call must include the `pk` field")  # noqa

#     field = source_qs.model._meta.pk
#     # set the correct field name:
#     # for ForeignKeys, we want to use `model_id` field, and not `model`,
#     # to bypass default ordering on related model
#     order_by_field = field.attname

#     source_qs = source_qs.order_by(order_by_field)
#     queryset = source_qs
#     while True:
#         if pk:
#             queryset = source_qs.filter(pk__gt=pk)
#         page = queryset[:chunk_size]
#         if query_log is not None:
#             query_log.write('{page.query}\n'.format(page=page))
#         page = list(page)
#         nb_items = len(page)

#         if nb_items == 0:
#             return

#         last_item = page[-1]
#         # source_qs._fields exists *and* is not none when using "values()"
#         if has_fields:
#             pk = last_item["pk"]
#         else:
#             pk = last_item.pk

#         yield page

#         if nb_items < chunk_size:
#             return


# def chunkator(source_qs, chunk_size, query_log=None):

#   USE https://docs.djangoproject.com/en/2.2/ref/models/querysets/ iterator instead


#     """
#     Yield over a queryset by chunks.
#     This method does not involve counting elements or measuring the iterable
#     length. We're saving at least a ``count()`` query on QuerySets, or a
#     CPU-and-RAM-consuming ``len(queryset)`` query.
#     """
#     for page in chunkator_page(source_qs,
#                                chunk_size,
#                                query_log=query_log):
#         for item in page:
#             yield item


class TupleField(Field):
    pass


class Tuple(Func):
    function = ""
    output_field = TupleField()

    def get_group_by_cols(self):
        # Irrespective of whether we have an aggregate, we want to drill down
        # to the children here. You can't GROUP BY a tuple like you would for a
        # "normal" function - i.e. GROUP BY ("a", "b") is invalid SQL. However,
        # it's logically equivalent to GROUP BY "a", "b" in call cases, so we
        # never need the case where this 'function' needs to be included in the
        # clause.
        cols = []
        for expr in self.source_expressions:
            cols += expr.get_group_by_cols()
        return cols


class InvalidCursor(Exception):
    pass


def reverse_ordering(ordering_tuple):
    """
    Given an order_by tuple such as `('-created', 'uuid')` reverse the
    ordering and return a new tuple, eg. `('created', '-uuid')`.
    """

    def invert(x):
        return x[1:] if (x.startswith("-")) else "-" + x

    return tuple([invert(item) for item in ordering_tuple])


class CursorPage(Sequence):
    def __init__(self, items, paginator, has_next=False, has_previous=False):
        self.items = items
        self.paginator = paginator
        self.has_next = has_next
        self.has_previous = has_previous

    def __len__(self):
        return len(self.items)

    def __getitem__(self, key):
        return self.items.__getitem__(key)

    def __repr__(self):
        return "<Page: [%s%s]>" % (
            ", ".join(repr(i) for i in self.items[:21]),
            " (remaining truncated)" if len(self.items) > 21 else "",
        )


class CursorPaginator(object):
    delimiter = "|"
    invalid_cursor_message = _("Invalid cursor")

    def __init__(self, queryset, ordering):
        self.queryset = queryset.order_by(*ordering)
        self.ordering = ordering

        if not all(o.startswith("-") for o in ordering) and not all(
            not o.startswith("-") for o in ordering
        ):
            raise InvalidCursor("Direction of orderings must match")

    def page(self, first=None, last=None, after=None, before=None):
        qs = self.queryset
        page_size = first or last
        if page_size is None:
            return CursorPage(qs, self)

        if after is not None:
            qs = self.apply_cursor(after, qs)
        if before is not None:
            qs = self.apply_cursor(before, qs, reverse=True)
        if first is not None:
            qs = qs[: first + 1]
        if last is not None:
            if first is not None:
                raise ValueError("Cannot process first and last")
            qs = qs.order_by(*reverse_ordering(self.ordering))[: last + 1]

        qs = list(qs)
        items = qs[:page_size]
        if last is not None:
            items.reverse()
        has_additional = len(qs) > len(items)
        additional_kwargs = {}
        if first is not None:
            additional_kwargs["has_next"] = has_additional
            additional_kwargs["has_previous"] = bool(after)
        elif last is not None:
            additional_kwargs["has_previous"] = has_additional
            additional_kwargs["has_next"] = bool(before)
        return CursorPage(items, self, **additional_kwargs)

    def apply_cursor(self, cursor, queryset, reverse=False):
        position = self.decode_cursor(cursor)

        is_reversed = self.ordering[0].startswith("-")
        queryset = queryset.annotate(
            _cursor=Tuple(*[o.lstrip("-") for o in self.ordering])
        )
        current_position = [
            Value(p, output_field=TextField()) for p in position
        ]
        if reverse != is_reversed:
            return queryset.filter(_cursor__lt=Tuple(*current_position))
        return queryset.filter(_cursor__gt=Tuple(*current_position))

    def decode_cursor(self, cursor):
        try:
            orderings = b64decode(cursor.encode("ascii")).decode("utf8")
            return orderings.split(self.delimiter)
        except (TypeError, ValueError):
            raise InvalidCursor(self.invalid_cursor_message)

    def encode_cursor(self, position):
        encoded = b64encode(
            self.delimiter.join(position).encode("utf8")
        ).decode("ascii")
        return encoded

    def position_from_instance(self, instance):
        position = []
        for order in self.ordering:
            parts = order.lstrip("-").split("__")
            attr = instance
            while parts:
                attr = getattr(attr, parts[0])
                parts.pop(0)
            position.append(attr)
            # position.append(six.text_type(attr))
        return position

    def cursor(self, instance):
        return self.encode_cursor(self.position_from_instance(instance))


def chunked_queryset_iterator(queryset, size, *, ordering=("id",)):
    """Split a queryset into chunks.
    This can be used instead of ``queryset.iterator()``,
    so ``.prefetch_related()`` also works.
    .. note::
        The ordering must uniquely identify the object,
        and be in the same order (ASC/DESC).
    """
    pager = CursorPaginator(queryset, ordering)
    after = None
    while True:
        page = pager.page(after=after, first=size)
        if page:
            yield from page.items
        else:
            return
        if not page.has_next:
            break
        # take last item, next page starts after this.
        after = pager.cursor(instance=page[-1])
