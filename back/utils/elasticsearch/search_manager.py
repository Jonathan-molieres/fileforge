from __future__ import annotations

import functools
from typing import Type, TypeVar

from django.db.models import Case, QuerySet, When
from django.db.models.fields import IntegerField
from elasticsearch_dsl import Document
from elasticsearch_dsl.query import Q as QES

from utils.pagination import paginate

__all__ = ["SearchManager"]

# ES Params
SIZE_RESULT = 50
SIZE_RESULT_MIN = 10
MAX_RESULT_FOR_ES = 10000

TModel = TypeVar("TModel")
TSearchModelOutput = TypeVar("TSearchModelOutput")


class SearchManager:
    def __init__(
        self,
        query_matrix,
        document: Document,
        size: int = SIZE_RESULT,
        min_size: int = SIZE_RESULT_MIN,
        max_size: int = MAX_RESULT_FOR_ES,
    ):
        self.query_matrix = query_matrix
        self.document = document
        self.size = size
        self.min_size = min_size
        self.max_size = max_size

    def vector_to_qse(self, vector: str, query: str) -> QES:
        """Convert a vector to a query elastic search.

        Args:
            vector (str): _description_
            query (str): _description_

        Returns:
            QES: _description_
        """
        return functools.reduce(
            lambda q, fb: q
            | QES(
                "match",
                **{
                    fb[0]: dict(
                        query=self.document.normalize(query), boost=fb[1]
                    )
                },
            )
            if q
            else QES(
                "match",
                **{
                    fb[0]: dict(
                        query=self.document.normalize(query), boost=fb[1]
                    )
                },
            ),
            self.query_matrix.get(vector, {}).items(),
            None,
        )

    def query_elastic_search(self, **kwargs) -> QES:
        """Query elastic search.

        Returns:
            QES: _description_
        """
        qse = QES()
        for key, value in kwargs.items():
            if key in self.query_matrix:
                if value and value.strip():
                    qse &= self.vector_to_qse(key, value)
        return qse

    def execute_search(
        self,
        queryset: QuerySet,
        search_model_output: Type[TSearchModelOutput],
        page: int = 1,
        limit: int = 50,
        **kwargs,
    ) -> Type[TSearchModelOutput]:
        """Execute a search with elastic search.

        Args:
            model (Type[TModel]): _description_
            search_model_output (Type[TSearchModelOutput]): _description_
            page (int, optional): _description_. Defaults to 1.
            limit (int, optional): _description_. Defaults to 50.

        Returns:
            Type[TSearchModelOutput]: _description_
        """
        if all(value in [None, ""] for value in kwargs.values()):
            return paginate(qs=queryset, page=page, limit=limit)

        hits: dict[str, float] = {}
        max_score = 0

        limit = max(min(self.size, limit), self.min_size)
        page = max(1, page)
        search = self.document.search()

        qse = self.query_elastic_search(**kwargs)
        total = search.count()
        search = search.query(qse)
        count = search.count()
        offset = (page - 1) * limit if limit is not None else 0
        offset = min(self.max_size, offset)
        search = search[offset : min(self.max_size, offset + limit)]

        response = search.execute()
        hits = {hit.meta.id: hit.meta.score for hit in response}
        objects = self.get_objects_from_hits(hits, queryset)
        for object in objects:
            object.score = hits[str(object.id)]
            object.max_score = max_score
        objects_count = objects.count()
        if objects_count < limit:
            count = objects_count
        return search_model_output(
            page=page,
            limit=limit,
            count=count,
            total=total,
            rows=objects,
            debug_query=search.to_dict(),
        )

    def get_objects_from_hits(
        self, hits: dict[str, float], queryset: QuerySet
    ) -> QuerySet:
        queryset = queryset.filter(id__in=hits.keys())
        preserved_order = Case(
            *[When(pk=pk, then=pos) for pos, pk in enumerate(hits.keys())],
            output_field=IntegerField(),
        )
        return queryset.order_by(preserved_order)
