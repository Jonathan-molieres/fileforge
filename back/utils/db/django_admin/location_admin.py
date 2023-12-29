from conf.admin import admin

__all__ = ["LocationAdmin"]


class LocationAdmin(admin.ModelAdmin):
    search_fields = "location_formatted_address"
    readonly_fields = (
        "location_latitude",
        "location_longitude",
        "location_geometry",
        "location_formatted_address",
    )
    fieldsets = (
        (
            "Localisation",
            {
                "fields": [
                    "location_address",
                    "location_city",
                    "location_country",
                    "location_department",
                    "location_zip_code",
                    "location_zip_code_alpha_2",
                ],
            },
        ),
        (
            "Location Lat-Long & Géométrie",
            {
                "fields": [
                    "location_latitude",
                    "location_longitude",
                    "location_geometry",
                    "location_formatted_address",
                ],
            },
        ),
    )
