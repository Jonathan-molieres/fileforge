from api.utils.schemas import ModelData
from django.contrib.gis.geos import Point, Polygon
from pydantic import field_validator

__all__ = ["LocationData", "LocationDetailsData"]


class LocationData(ModelData):
    address: str | None
    city: str | None
    country: str | None
    department: str | None
    zip_code: str | None
    zip_code_alpha_2: str | None
    latitude: float | None
    longitude: float | None
    formatted_address: str | None


class LocationDetailsData(LocationData):
    geometry: dict | None = None

    @field_validator("geometry", mode="before")
    @classmethod
    def validate_geometry(cls, value):
        if value:
            if isinstance(value, Polygon):
                return {"type": "Polygon", "coordinates": value.coords}
            elif isinstance(value, Point):
                return {"type": "Point", "coordinates": value.coords}
            elif (
                isinstance(value, dict)
                and value.get("type") == "Polygon"
                and "coordinates" in value
            ):
                return value
            else:
                raise ValueError("Invalid geometry type")
        return value
