#!/bin/bash

# ██████╗ ███████╗██╗   ██╗
# ██╔══██╗██╔════╝██║   ██║
# ██║  ██║█████╗  ██║   ██║
# ██║  ██║██╔══╝  ╚██╗ ██╔╝
# ██████╔╝███████╗ ╚████╔╝
# ╚═════╝ ╚══════╝  ╚═══╝

export DOMAIN=${DOMAIN:-"localhost"}
export PORT=${PORT:-"80"}

PROTOCOL="http:"
if [[ "80" == "443" ]]; then
    PROTOCOL="https:"
fi
ROOT_URL=//:80



before-dev() {
     network inspect "fileforge" >/dev/null 2>&1 ||  network create "fileforge" >/dev/null 2>&1
}

# Command called between build and up, usefull to install dependencies localy
before-dev-up() {
    poetry install
    yarn install
    db init
}

after-dev() {
    infos
}

infos() {
    prints success "  Application fileforge started"
    print info "  FRONT:    "
    print info "  API:      /api"
    print info "  API DOC:  /docs"
    printe info "  ADMIN:   /admin"
}

poetry() {
    compose run --rm back poetry "$@"
}

pip() {
    compose run --rm back pip "$@"
}

conda() {
    compose run --rm back conda "$@"
}

yarn() {
    compose run --rm front yarn "$@"
}

npx() {
    compose run --rm front npx "$@"
}

npm() {
    compose run --rm front npm "$@"
}

manage() {
    compose run --rm back manage "$@"
}

migrate() {
    manage migrate "$@"
}
mm () {
    makemigrations
    migrate
}
makemigrations() {
    manage makemigrations "$@"
}

flush-redis() {
    compose exec -it redis redis-cli -h redis FLUSHALL
}

psql() {
    compose run --rm -T database psql -U postgres "$@"
}

db() {
    case $1 in
    drop) shift && echo "DROP SCHEMA public CASCADE; CREATE SCHEMA public; " | psql "$@" ;;
    reset) shift && db drop && makemigrations "" && migrate "" && flush-redis ;;
    init) shift && migrate "" ;;
    esac
}

# ██████╗ ███████╗██████╗ ██╗      ██████╗ ██╗   ██╗
# ██╔══██╗██╔════╝██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝
# ██║  ██║█████╗  ██████╔╝██║     ██║   ██║ ╚████╔╝
# ██║  ██║██╔══╝  ██╔═══╝ ██║     ██║   ██║  ╚██╔╝
# ██████╔╝███████╗██║     ███████╗╚██████╔╝   ██║
# ╚═════╝ ╚══════╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝

before-deploy() {
    docker build --build-arg NODE_ENV=production -t "${CONTAINER_REGISTRY}/front:${DEPLOY_TAG}" ./front || exit 1
    docker build --build-arg PYTHON_ENV=production -t "${CONTAINER_REGISTRY}/back:${DEPLOY_TAG}" ./back || exit 1
}
