from lxml import etree

__all__ = ["html_get_text"]


def html_get_text(hml: str) -> str | None:
    """Get text from html.

    Args:
        hml (str): _description_

    Returns:
        str: _description_
    """
    if not hml:
        return None
    return etree.tostring(
        etree.fromstring(hml, etree.HTMLParser()),
        encoding="unicode",
        method="text",
    )
