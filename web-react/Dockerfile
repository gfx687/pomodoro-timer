FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM alpine:latest
WORKDIR /srv/app
COPY --from=build /app/dist .
# does not respect close signals
# CMD [ "tail", "-f", "/dev/null" ]
CMD ["/bin/sh", "-c", "trap 'exit 0' TERM; while true; do wait; done"]