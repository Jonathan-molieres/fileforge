import re

__all__ = ["snakecase", "camelcase"]
snakecase_re = re.compile(r"(?<!^)(?=[A-Z])")
non_alpha = re.compile(r"[\W_\/]+([a-z])?")


def snakecase(value):
    """_summary_

    Args:
        value (_type_): _description_

    Returns:
        _type_: _description_
    """
    return re.sub(snakecase_re, "_", value).lower()


def camelcase(string: str | dict) -> str:
    """_summary_

    Args:
        string (str): _description_

    Returns:
        str: _description_
    """
    if isinstance(string, dict):

        return {
            camelcase(k): (camelcase(v) if isinstance(v, dict) else v)
            for k, v in string.items()
        }

    else:

        return string[0].lower() + non_alpha.sub(
            lambda m: m.group(1).upper() if m.group(1) else "", string[1:]
        )
