import os
from pathlib import Path
from urllib.parse import urlparse

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
DJANGO_ALLOW_ASYNC_UNSAFE = True

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "^$_%7*ft#@2c0b&v%00heubzf1fypy*=@(g0l(&9a01w4%gh*o"

# Project
PROJECT = os.environ.get("PROJECT", "-")
DOMAIN = os.environ.get("DOMAIN", "127.0.0.1")
PORT = os.environ.get("PORT", "80")
API_MODE = bool(int(os.environ.get("API_MODE", "0")))
DEBUG = bool(
    int(os.environ.get("DEBUG", "0"))
)  # SECURITY WARNING: don't run with debug turned on in production!
DEV_MODE = bool(
    int(os.environ.get("DEV_MODE", "0") or "0")
)  # SECURITY WARNING: don't run with dev_mode turned on in non-local env!
ROOT_URL = f"https://{DOMAIN}:{PORT}"
ALLOWED_HOSTS = [f".{DOMAIN}", DOMAIN, "node.internal"]
CSRF_TRUSTED_ORIGINS = [
    f"https://{DOMAIN}",
    f"https://*.{DOMAIN}",
]
X_FRAME_OPTIONS = "SAMEORIGIN"
AUTH_USER_MODEL = "account.User"
ROOT_URLCONF = "conf.urls"
WSGI_APPLICATION = "bin._wsgi.application"
ASGI_APPLICATION = "bin._asgi.application"
PHONENUMBER_DB_FORMAT = "E164"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
SITE_ID = 1

# TODO: add IP of old server in  prod here for decorator require_internal
# IF ip is not dynamic
INTERNAL_IP = os.environ.get("INTERNAL_IP", "")

# Google maps api key
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")

# Email
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.environ.get("EMAIL_HOST", "")
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
EMAIL_SENDER = f"noreply@{DOMAIN}"
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_FAKE_SEND = bool(int(os.environ.get("EMAIL_FAKE_SEND", "0")))

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases
DATABASE_URL = os.environ.get("DATABASE_URL", "")
DATABASE = urlparse(DATABASE_URL)
DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "HOST": DATABASE.hostname,
        "NAME": DATABASE.path.strip("/"),
        "USER": DATABASE.username,
        "PASSWORD": DATABASE.password,
        "PORT": DATABASE.port,
        "CONN_MAX_AGE": 0,
    },
}

# Database Redis
REDIS_URL = os.environ.get("REDIS_URL")
REDIS = urlparse(REDIS_URL)


# Cache
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"{REDIS_URL}/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "PICKLE_VERSION": -1,  # Use the latest protocol version
        },
    },
    "select2": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"{REDIS_URL}/2",
        "TIMEOUT": 86400,  # 24 hours TTL
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "PICKLE_VERSION": -1,  # Use the latest protocol version
        },
    },
}


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/
STATIC_URL = "/static/"
STATIC_ROOT = "server/static/"
# STATICFILES_DIRS = [
#     BASE_DIR / "server/static",
# ]
# STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
# Application definition

INSTALLED_APPS = [
    "jazzmin",
    "django.contrib.admin",
    "rest_framework",
    # "django_api_admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.postgres",
    "django.contrib.gis",
    "django_elasticsearch_dsl",
    "django_extensions",
    "drf_yasg",
    "core",
    "apps.account",
    # Legacy modules
    "django.contrib.sites",
    "apps.manager",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "conf.authentication.AutoLoginMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # Legacy
    # "django_user_agents.middleware.UserAgentMiddleware",
]


TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


JAZZMIN_UI_TWEAKS = {
    "theme": "minty",
    "dark_mode_theme": "minty",
}

JAZZMIN_SETTINGS = {
    "site_title": "A4E diag admin",
    "custom_css": "admin/css/main.css",
    # "changeform_format": "horizontal_tabs",
    # "changeform_format_overrides": {"surveys.Question": "collapsible"},
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# OpenAI
OPENAI_API_KEY = os.environ.get(
    "OPENAI_API_KEY",
)

# Google
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")


# Breezy
BREEZY_COMPANY_ID = "27fb6cec5ea801"
BREEZY_POOL_ID = "4e6bd1bbc1b701"
BREEZY_API_EMAIL = os.getenv("BREEZY_API_EMAIL", "")
BREEZY_API_PASSWORD = os.getenv("BREEZY_API_PASSWORD", "")
BREEZY_WEBHOOKS_SECRET = os.getenv("BREEZY_WEBHOOKS_SECRET", "")


AUTHENTICATION_BACKENDS = ["conf.authentication.DefaultBackend"]

ELASTICSEARCH_HOSTS = os.getenv("ELASTICSEARCH_HOSTS", "")
ELASTICSEARCH_DSL = {
    "default": {"hosts": ELASTICSEARCH_HOSTS},
    "timeout": 30,  # default is 10 seconds
}
# ELASTICSEARCH_DSL_SIGNAL_PROCESSOR = (
#     "django_elasticsearch_dsl.signals.RealTimeSignalProcessor"
# )
# ELASTICSEARCH_SETTINGS = {"number_of_shards": 3, "number_of_replicas": 1}
ELASTICSEARCH_SETTINGS = {"number_of_shards": 1, "number_of_replicas": 0}
# number_of_shards = Data partitioning for load distribution across clusters
# number_of_replicas = Number of shard copies for redundancy and fault tolerance

CKEDITOR_CONFIGS = {
    "default": {
        "allowedContent": True,
        "skin": "moono",
        # 'skin': 'office2013',
        "toolbar_Basic": [["Source", "-", "Bold", "Italic"]],
        "toolbar_YourCustomToolbarConfig": [
            # {'name': 'document', 'items': ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates']},
            # {'name': 'clipboard', 'items': ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
            {
                "name": "forms",
                "items": [
                    "Form",
                    "Checkbox",
                    "Radio",
                    "TextField",
                    "Textarea",
                    "Select",
                    "Button",
                    "ImageButton",
                    "HiddenField",
                ],
            },
            "/",
            {
                "name": "basicstyles",
                "items": [
                    "Bold",
                    "Italic",
                    "Underline",
                    "Strike",
                    "Subscript",
                    "Superscript",
                    "-",
                    "RemoveFormat",
                ],
            },
            {
                "name": "paragraph",
                "items": [
                    "NumberedList",
                    "BulletedList",
                    "-",
                    "Outdent",
                    "Indent",
                    "-",
                    "Blockquote",
                    "CreateDiv",
                    "-",
                    "JustifyLeft",
                    "JustifyCenter",
                    "JustifyRight",
                    "JustifyBlock",
                    "-",
                    "BidiLtr",
                    "BidiRtl",
                    "Language",
                ],
            },
            {"name": "links", "items": ["Link", "Unlink", "Anchor"]},
            {
                "name": "insert",
                "items": [
                    "Image",
                    "Flash",
                    "Table",
                    "HorizontalRule",
                    "Smiley",
                    "SpecialChar",
                    "PageBreak",
                    "Iframe",
                ],
            },
            "/",
            {
                "name": "styles",
                "items": [
                    "Styles",
                    "Format",
                    "Font",
                    "FontSize",
                    "SourceArea",
                ],
            },
            {
                "name": "codes",
                "items": [
                    "Source",
                    "SourceArea",
                ],
            },
            {"name": "colors", "items": ["TextColor", "BGColor"]},
            # {'name': 'tools', 'items': ['Maximize', 'ShowBlocks']},
            {"name": "about", "items": ["About"]},
            "/",  # put this to force next toolbar on new line
            {
                "name": "yourcustomtools",
                "items": [
                    # put the name of your editor.ui.addButton here
                    "Preview",
                    "Maximize",
                ],
            },
        ],
        "toolbar": "YourCustomToolbarConfig",  # put selected toolbar config here
        # 'toolbarGroups': [{ 'name': 'document', 'groups': [ 'mode', 'document', 'doctools' ] }],
        # 'height': 291,
        # 'width': '100%',
        # 'filebrowserWindowHeight': 725,
        # 'filebrowserWindowWidth': 940,
        # 'toolbarCanCollapse': True,
        # 'mathJaxLib': '//cdn.mathjax.org/mathjax/2.2-latest/MathJax.js?config=TeX-AMS_HTML',
        "tabSpaces": 4,
        "extraPlugins": ",".join(
            [
                "uploadimage",  # the upload image feature
                # your extra plugins here
                "div",
                "autolink",
                "image2",
                "autoembed",
                "embedsemantic",
                "autogrow",
                # 'devtools',
                "widget",
                "lineutils",
                "clipboard",
                "dialog",
                "dialogui",
                "elementspath",
                "sourcearea",
                #'django_admin_search',
            ]
        ),
    }
}


if DEBUG:
    INSTALLED_APPS += [
        "debug_toolbar",
    ]
    MIDDLEWARE += [
        "debug_toolbar.middleware.DebugToolbarMiddleware",
    ]
    import socket  # only if you haven't already imported this

    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
    INTERNAL_IPS = [ip[: ip.rfind(".")] + ".1" for ip in ips] + [
        "127.0.0.1",
        "10.0.2.2",
    ]


# ██████╗ ███████╗██╗   ██╗███╗   ███╗ ██████╗ ██████╗ ███████╗
# ██╔══██╗██╔════╝██║   ██║████╗ ████║██╔═══██╗██╔══██╗██╔════╝
# ██║  ██║█████╗  ██║   ██║██╔████╔██║██║   ██║██║  ██║█████╗
# ██║  ██║██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║██║   ██║██║  ██║██╔══╝
# ██████╔╝███████╗ ╚████╔╝ ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗
# ╚═════╝ ╚══════╝  ╚═══╝  ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
if DEV_MODE:
    # settings of elasticsearc for development
    ELASTICSEARCH_SETTINGS = {"number_of_shards": 1, "number_of_replicas": 0}

    # DEFAULT_FILE_STORAGE = "conf.storage.fake_gc_storage.FakeGCStorage"
    AUTHENTICATION_BACKENDS = ["conf.authentication.DevBackend"]
    ALLOWED_HOSTS = ["*"]
    CSRF_TRUSTED_ORIGINS = [
        "http://*",
        "https://*",
        f"http://*.{DOMAIN}",
        f"https://*.{DOMAIN}",
        f"http://{DOMAIN}:{PORT}",
        f"http://*.{DOMAIN}:{PORT}",
    ]

    from logging import Formatter

    default_log_colors = {
        "DEBUG": "white",
        "INFO": "green",
        "WARNING": "yellow",
        "ERROR": "red",
        "CRITICAL": "bold_red",
    }

    def esc(*x):
        return "\x1b[" + ";".join(x) + "m"

    # The initial list of escape codes
    escape_codes = {
        "reset": esc("39", "49", "0"),
        "bold": esc("01"),
    }

    # The color names
    colors = [
        "black",
        "red",
        "green",
        "yellow",
        "blue",
        "purple",
        "cyan",
        "white",
    ]
    for lcode, lname in [("3", ""), ("4", "bg_")]:
        for code, name in enumerate(colors):
            escape_codes[f"{lname}{name}"] = esc(f"{lcode}{code}")
            escape_codes[f"{lname}bold_{name}"] = esc(f"{lcode}{code}", "01")

    class LoggingFormatter(Formatter):
        def __init__(
            self,
            format,
            datefmt=None,
            log_colors=default_log_colors,
            reset=True,
            style="%",
        ):
            super().__init__(format, datefmt, style=style)
            self.log_colors = log_colors
            self.reset = reset

        def format(self, record):
            record.__dict__.update(escape_codes)
            if record.levelname in self.log_colors:
                color = self.log_colors[record.levelname]
                record.log_color = escape_codes[color]
            else:
                record.log_color = ""
            message = super().format(record)
            if self.reset and not message.endswith(escape_codes["reset"]):
                message += escape_codes["reset"]
            return message.replace('File "/app', 'File ".')

    LOGGING = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "verbose": {
                "format": "{asctime} {levelname} {name} \t {message}",
                "style": "{",
            },
            "devmode": {
                "()": "conf.settings.LoggingFormatter",
                "format": "%(log_color)s%(message)s",
                "log_colors": {
                    "DEBUG": "cyan",
                    "INFO": "green",
                    "WARNING": "yellow",
                    "ERROR": "red",
                    "CRITICAL": "bold_red",
                },
            },
        },
        "handlers": {
            "stream": {
                "class": "logging.StreamHandler",
                "formatter": "verbose",
            },
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "devmode",
                # "formatter": "verbose",
            },
            "null": {
                "class": "logging.NullHandler",
            },
        },
        "root": {
            "handlers": ["console"],
            "level": "DEBUG",
        },
        "loggers": {
            "elasticsearch": {  # ES logger
                "handlers": ["console"],
                "level": "WARNING",
            },
            "socketio": {
                "handlers": ["console"],
                "level": "ERROR",
            },
            "daphne": {
                "handlers": ["console"],
                "level": "ERROR",
            },
        },
    }
