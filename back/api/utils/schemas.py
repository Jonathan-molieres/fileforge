from typing import Generic, List, TypeVar

from pydantic import BaseModel, ConfigDict, Field, model_serializer

from utils.pagination import paginate

__all__ = [
    "Schema",
    "Data",
    "ModelData",
    "PageInput",
    "PageData",
    "ElasticPageData",
    "NumericRangeData",
]
DEFAULT_LIMIT = 25


def to_camel_case(string: str) -> str:
    """
    Convert string to Camel Case
    """
    components = string.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


T = TypeVar("T")


class Schema(BaseModel, Generic[T]):
    """
    Generic schema model
    """

    model_config = ConfigDict(
        populate_by_name=True, alias_generator=to_camel_case, extra="forbid"
    )


class Data(Schema):
    """
    Generic schema model  input
    """

    pass


class ModelData(Schema[T]):
    """
    Generic schema model output
    """

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def to_django_fields_without(
        cls, without_field: list[str] = []
    ) -> List[str]:
        """get all django fields to include for a model

        Args:
            without_field (list[str]): some fields to exclude

        Returns:
            List[str]: _description_
        """
        return [f for f in cls.model_fields.keys() if f not in without_field]


class PageInput(Schema):
    page: int = Field(
        default=1,
    )
    limit: int = Field(
        default=DEFAULT_LIMIT,
    )


class PageData(PageInput, Generic[T]):
    count: int = Field(
        default=0,
    )
    rows: List[T] = Field(
        default=[],
    )
    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def paginate(cls, qs, *args, **kwargs):
        page = paginate(qs, *args, **kwargs)
        return {
            "rows": page.rows,
            "count": page.count,
            "page": page.page,
            "limit": page.limit,
            # "total": page.total,
        }


class NumericRangeData(ModelData):
    lower: int | None
    upper: int | None

    @model_serializer  # custom serialiser
    def serialise(self):
        if self.lower is None or self.upper is None:
            return None
        return [self.lower, self.upper]


class ElasticPageData(PageInput, Generic[T]):
    count: int = Field(
        default=0,
    )
    rows: List[T] = Field(
        default=[],
    )
    total: int = Field(
        default=0,
    )
    debug_query: dict | None = None
    model_config = ConfigDict(from_attributes=True)

    # @classmethod
    # def search(cls, search, query=None, page=1, limit=50, queryset=None, *args, **kwargs):

    #     total = search.count()
    #     # if sort:
    #     #     print(sort.split(","))
    #     #     search = search.sort(*sort.split(","))
    #     if query:
    #         search = search.query(query)

    #     hits = {hit.meta.id: hit.meta.score for hit in search[:SIZE_RESULT]}
    #     candidates = candidates.filter(id__in=hits.keys()).filter(q)
    #     preserved_order = Case(
    #         *[When(pk=pk, then=pos) for pos, pk in enumerate(hits.keys())],
    #         output_field=IntegerField(),
    #     )
    #     candidates = candidates.order_by(preserved_order)
    #     max_score = max(hits.values()) if hits else 0

    #     for candidate in candidates:
    #         candidate.max_score = max_score
    #         candidate.score = hits.get(f"{candidate.id}", 0)

    #     return {
    #         "rows": rows,
    #         "count": search.count(),
    #         "total": total,
    #         "page": page.page,
    #         "limit": page.limit,
    #         # "total": page.total,
    #     }

    #     return SearchOutputData(
    #         page=1,
    #         count=search.count(),
    #         total=total,
    #         rows=candidates,
    #         debug_query=search.to_dict(),
    #         matrix=query_matrix,
    #     )
