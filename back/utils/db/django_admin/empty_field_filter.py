from django.contrib.admin import SimpleListFilter


class EmptyFieldFilter(SimpleListFilter):
    title = "Not Empty"
    parameter_name = "not_empty"

    def get_field_lookup(self):
        raise NotImplementedError(
            "You must implement this method in the subclass."
        )

    def lookups(self, request, model_admin):
        return (
            ("not_empty", "Yes"),
            ("empty", "No"),
        )

    def queryset(self, request, queryset):
        lookup = self.get_field_lookup()
        if self.value() == "not_empty":
            return queryset.exclude(**{f"{lookup}__isnull": True})
        if self.value() == "empty":
            return queryset.filter(**{f"{lookup}__isnull": True})
        return queryset
