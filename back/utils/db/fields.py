from django import forms
from django.contrib.postgres.fields import ArrayField as ArrayFieldBase
from django.db.models import Field

__all__ = ["ArrayField", "ArrayChoiceField"]


class ArrayField(ArrayFieldBase):
    def formfield(self, **kwargs):
        return Field.formfield(
            self,
            **{
                # "form_class": forms.MultipleChoiceField,
                # "choices": self.base_field.choices,
                # "widget": forms.SelectMultiple,
                **kwargs,
            }
        )


class ArrayChoiceField(ArrayFieldBase):
    def formfield(self, **kwargs):
        return Field.formfield(
            self,
            **{
                "form_class": forms.MultipleChoiceField,
                "choices": self.base_field.choices or [],
                "widget": forms.SelectMultiple,
                **kwargs,
            }
        )
