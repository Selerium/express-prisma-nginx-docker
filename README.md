# Express + Prisma + PostgreSQL + Nginx

A Dockerized backend starter for building Express applications with PostgreSQL, Prisma, authentication, transactional email, and an Nginx reverse proxy.

The goal is to provide a reusable application foundation rather than repeatedly rebuilding the same backend and infrastructure setup.

## Architecture

```text
                    Internet
                       │
                       ▼
                ┌─────────────┐
                │    Nginx    │
                │ HTTP / HTTPS│
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │   Express   │
                │   Backend   │
                └──────┬──────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
      ┌─────────────┐     ┌─────────────┐
      │ PostgreSQL  │     │   Resend    │
      │   Prisma    │     │    Email    │
      └─────────────┘     └─────────────┘
```

All services are managed through Docker Compose.

## Included Application Flows

The starter includes the foundation for:

* Registration
* Login
* Email verification
* Forgot password
* Profile management
* Account settings
* Password changes
* Email changes
* Onboarding
* Navigation/auth state

The user model can be customized through the Prisma schema.

## Tech Stack

* Node.js
* Express.js
* Prisma
* PostgreSQL
* Nginx
* Docker
* Docker Compose
* Resend

## Development and Production Modes

The stack supports separate development and production behavior through:

```env
PROD=false
```

or:

```env
PROD=true
```

### Development

Development mode uses HTTP and logs email operations rather than requiring an external email provider.

### Production

Production mode enables HTTPS configuration and HTTP-to-HTTPS redirection through Nginx.

Email delivery can be enabled through Resend.

## Project Structure

```text
.
├── backend/              # Express application
├── nginx/                # Nginx configuration
├── config/               # Environment configuration
├── data/                 # PostgreSQL persistence
└── docker-compose.yml
```

## Running the Stack

### Requirements

* Docker
* Docker Compose

### Start development

```bash
docker compose up
```

Rebuild when required:

```bash
docker compose up --build
```

Run detached:

```bash
docker compose up -d
```

The default configuration starts in development mode.

## Production

Set:

```env
PROD=true
```

and configure the production environment variables and TLS certificates required by the Nginx configuration.

The production configuration provides:

* HTTPS
* HTTP → HTTPS redirect
* Reverse proxying to the backend
* Persistent PostgreSQL storage
* Optional transactional email through Resend

## Why this exists

A significant amount of backend work is repeated across applications:

* authentication
* password recovery
* email verification
* database setup
* reverse proxy configuration
* HTTPS
* development/production separation

This repository packages those concerns into a reusable starting point so application development can begin from an established foundation.

## Intended Use

Use this repository when starting an Express + PostgreSQL application that needs authentication and a production-oriented container layout.

The application-specific domain model can then be built on top of the existing authentication and infrastructure foundation.
