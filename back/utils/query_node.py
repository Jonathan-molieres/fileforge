from django.db.models import Q

__all__ = ["query_node", "SEARCH_TYPE_MAPPING", "FIELDS_AUTHORISED"]

FIELDS_AUTHORISED = [
    "name",
    "resume_content",
    "header",
    "positions_content",
    "education_content",
]

SEARCH_TYPE_MAPPING = {
    "CONTAINS": "icontains",
    "EXACT": "iexact",
}


class QueryNode:
    """class for Query node"""

    def __init__(self):
        pass

    def parse(self, node: dict, fields=[], qs=Q()) -> Q:
        """Parse a query node

        Args:
            node (dict): _description_
            fields (list, string): _description_. Defaults to [].
            qs (Q(), optional): _description_. Defaults to Q().

        Returns:
            Q: query for django orm
        """
        if node.type in ["AND", "OR", "NOT"]:
            for child_node in node.value:
                if node.type == "OR":
                    qs = qs | self.parse(child_node, fields, qs=qs)
                elif node.type == "AND":
                    qs = qs & self.parse(child_node, fields, qs=qs)
                elif node.type == "NOT":
                    qs = qs & ~self.parse(child_node, fields, qs=qs)
                else:
                    qs = qs & self.parse(child_node, fields, qs=qs)

            return qs

        elif node.type in SEARCH_TYPE_MAPPING.keys():
            fields = node.fields or fields
            return Q(
                **{
                    f"{field}__{SEARCH_TYPE_MAPPING.get(node.type, 'iexact')}": node.value
                    for field in fields
                }
            )

        else:
            return qs


query_node = QueryNode()


example = {
    "input": {"page": 1, "limit": 100},
    "node": {
        "fields": ["resume_content", "header"],
        "type": "OR",
        "value": [
            {
                "type": "AND",
                "value": [
                    {
                        "fields": ["header"],
                        "type": "CONTAIN",
                        "value": "boulanger",
                    },
                    {"type": "CONTAIN", "value": "pâtissier"},
                ],
            },
            {"type": "EXACT", "value": "éclair au chocolat"},
        ],
    },
    "filters": {"value": ["name", "header"]},
}
