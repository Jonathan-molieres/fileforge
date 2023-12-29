import magic
from fastapi import HTTPException
from fastapi.responses import Response

__all__ = ["image_response"]


def image_response(file_path: str) -> Response:
    """Return a Response with the image data and the correct media type

    Args:
        file_path (str): _description_

    Raises:
        HTTPException: _description_

    Returns:
        Response: _description_
    """
    try:
        with open(file_path, "rb") as image_file:
            image_data = image_file.read()
        image_type = magic.from_buffer(image_data, mime=True)
        return Response(content=image_data, media_type=image_type)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Image not found")
