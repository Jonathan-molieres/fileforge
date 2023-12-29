__all__ = ["pdict"]

from typing import Any


class pdict(dict):
    def get(self, path: str, default: Any = None):
        if path in self:
            return super().get(path)
        else:
            splitted = path.split(".", 1)
            value = super().get(splitted[0], default)
            if len(splitted) > 1:
                return (
                    pdict(value).get(splitted[1], default)
                    if isinstance(value, dict)
                    else value
                )
            else:
                return pdict(value) if isinstance(value, dict) else value
