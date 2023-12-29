FROM node:19 AS builder
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV:-"production"}
ENV TSC_COMPILE_ON_ERROR=true
ENV REACT_EDITOR=atom
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY package.json *.lock ./
RUN yarn set version latest
# https://nextjs.org/docs/messages/non-standard-node-env
RUN if [ "$NODE_ENV" = "production" ]; then yarn install --frozen-lockfile; fi
RUN if [ "$NODE_ENV" = "test" ]; then yarn install --frozen-lockfile; fi
COPY . .
RUN if [ "$NODE_ENV" = "test" ]; then yarn run lint; fi
RUN if [ "$NODE_ENV" = "production" ]; then yarn run experimental-compile; fi
RUN if [ "$NODE_ENV" = "test" ]; then yarn run build; fi
EXPOSE 8080
CMD ["yarn", "run", "start"]


# # Ready to use light weight image for production
# FROM node:19-alpine as runner
# ARG NODE_ENV
# ENV NODE_ENV=${NODE_ENV:-"production"}
# ENV PORT="8080"
# ENV NEXT_SHARP_PATH="./node_modules/sharp"
# WORKDIR /app
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./static
# EXPOSE 8080
# CMD ["node", "server.js"]

FROM builder as runner
EXPOSE 8080
CMD ["yarn", "run", "start"]