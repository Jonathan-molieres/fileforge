from django.contrib.gis.db.models import GeometryField
from django.db import models

__all__ = ["Location"]


class Location(models.Model):
    """Generic location model.

    Args:
        models (_type_): django models

    Returns:
        _type_: _description_
    """

    class Meta:
        abstract = True

    location_address = models.CharField(
        null=True, blank=True, verbose_name="Adresse"
    )
    location_city = models.CharField(
        null=True, blank=True, verbose_name="Ville"
    )
    location_country = models.CharField(
        null=True, blank=True, verbose_name="Pays"
    )
    location_department = models.CharField(
        null=True, blank=True, verbose_name="Département"
    )

    # zip code
    location_zip_code = models.CharField(
        null=True, blank=True, verbose_name="Code postal"
    )
    location_zip_code_alpha_2 = models.CharField(null=True, blank=True)

    # geometry
    location_geometry = GeometryField(null=True, blank=True)

    location_latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        verbose_name="Latitude",
        null=True,
        blank=True,
    )
    location_longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        verbose_name="Longitude",
        null=True,
        blank=True,
    )
    # location for nominatim
    location_dirty = models.CharField(
        max_length=255,
        null=True,
        blank=True,
    )

    # address formatted like : "Monpazier, Dordogne, Nouvelle-Aquitaine, France métropolitaine, 24540, France"
    location_formatted_address = models.CharField(
        null=True,
        blank=True,
        verbose_name="Adresse formatée",
    )

    @property
    def location(self):
        """Location property without geometry field.

        Returns:
            _type_: _description_
        """
        return {
            field.name.replace("location_", ""): getattr(self, field.name)
            for field in self._meta.fields
            if field.name.startswith("location_")
            and field.name != "location_geometry"
            # and field.name != "location_formatted_address"
            and field.name != "location_dirty"
        }

    @property
    def location_details(self):
        """Location property .

        Returns:
            _type_: _description_
        """
        return {
            field.name.replace("location_", ""): getattr(self, field.name)
            for field in self._meta.fields
            if field.name.startswith("location_")
        }

    def save(self, *args, **kwargs):
        if self.location_formatted_address is None:
            self.location_formatted_address = (
                f"{self.location_address}, {self.location_city}, {self.location_department}, "
                f"{self.location_zip_code}, {self.location_country},  "
                f"{self.location_zip_code_alpha_2}"
            )
        super().save(*args, **kwargs)
