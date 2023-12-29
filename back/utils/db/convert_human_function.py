from datetime import timedelta

__all__ = ["convert_human_size", "format_duration_human"]


def convert_human_size(size: int):
    """humain size display

    Args:
        size (int): _description_

    Returns:
        _type_: _description_
    """
    if size < 1024:
        return f"{size} B"
    elif size < 1024 * 1024:
        return f"{size / 1024:.2f} KB"
    elif size < 1024 * 1024 * 1024:
        return f"{size / (1024 * 1024):.2f} MB"
    else:
        return f"{size / (1024 * 1024 * 1024):.2f} GB"


def format_duration_human(duration: timedelta):
    """humain duration display

    Args:
        duration (timedelta): _description_

    Returns:
        _type_: _description_
    """
    seconds = duration.total_seconds()
    days, remainder = divmod(seconds, 86400)
    hours, remainder = divmod(remainder, 3600)
    minutes, seconds = divmod(remainder, 60)

    if days >= 1:
        return "{:0.0f} days {:02} h {:02} m {:02} s".format(
            days, int(hours), int(minutes), int(seconds)
        )
    else:
        return "{:02} h {:02} m {:02} s".format(
            int(hours), int(minutes), int(seconds)
        )
