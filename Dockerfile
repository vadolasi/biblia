FROM oven/bun AS build

COPY . /app
WORKDIR /app

RUN bun i
RUN bun run build

FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/out /var/www/out
