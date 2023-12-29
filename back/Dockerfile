FROM python:3.11.4-slim as base 
ARG PYTHON_ENV
ENV PYTHON_ENV=${PYTHON_ENV:-"production"}

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONFAULTHANDLER=1 \
    PYTHONHASHSEED=random \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    DEBIAN_FRONTEND=noninteractive \
    TERM=xterm-256color \
    DISABLE_COLLECTSTATIC=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.7.1 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv"
ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

RUN set -xe \
    && packages=' \
    ca-certificates \
    python3-lxml \
    ffmpeg \
    libsqlite3-mod-spatialite \
    procps \
    ' \
    && buildPackages=' \
    gcc \
    curl \
    build-essential \ 
    libpq-dev \
    libmagic-dev \
    tk-dev \
    uuid-dev \
    binutils \
    libproj-dev \
    default-libmysqlclient-dev \
    gdal-bin \
    ' \
    && apt-get -qq -y update \
    && apt-get install -y $packages \
    && apt-get install -y $buildPackages --no-install-recommends
RUN curl -sSL https://install.python-poetry.org | python3 -
WORKDIR /app

# <PROD>
# WORKDIR $PYSETUP_PATH
COPY pyproject.toml poetry.lock ./
RUN if [ "$PYTHON_ENV" = "production" ]; then poetry install --only main; fi
RUN if [ "$PYTHON_ENV" = "production" ]; then set -xe \
    && apt-get -qq -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    ; fi
# </PROD>

COPY . .

EXPOSE 8080
ENTRYPOINT [ "/bin/bash", "/app/entrypoint" ]
CMD [ "fastapi-start" ]


FROM builder AS runner
ENTRYPOINT [ "/bin/bash", "/app/entrypoint" ]
EXPOSE 8080
CMD [ "fastapi-start" ]