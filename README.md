# express-prisma-nginx-docker
A simple template for immediately spinning up an Express.js/PostgreSQL backend with an NGINX proxy. Comes with user management (customizable in `schema.prisma`), auth APIs, and email sending functionality through Resend API.

## what's in this
- Express.js backend
- Prisma ORM
- PostgreSQL db
- NGINX proxy server
- Resend for email sending (optional; requires an API key, check [https://resend.com](resend.com))

## prod vs dev
Just set your env to `PROD=true` or `PROD=false` to switch between PROD and DEV modes.
- http only on DEV
- https (with http redirect) on PROD
- `PROD` env available in all containers to disable/enable things on dev/prod
- `PROD=false` logs emails to console rather than use Resend API

## how to use
Just clone it. Run `docker compose up` (add `-d` and/or `--build` if needed). Voila.
- make sure Docker is already running
- by default `PROD` is `false`

Happy developing~