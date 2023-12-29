from django.core.files.storage import default_storage
from django.utils.html import format_html

__all__ = ["generate_image_html"]


def generate_image_html(image, style_max_height=500, style_max_width=500):
    image_url = (
        f"/static/{image.name}"
        if default_storage.exists(image.name)
        else f"https://workandyou.fr/static/{image.name}"
    )

    if image_url:
        return format_html(
            f'<img src="{image_url}" style="max-height: {style_max_height}px; max-width: {style_max_width}px;" />'
        )
    else:
        return "Aucune image"
