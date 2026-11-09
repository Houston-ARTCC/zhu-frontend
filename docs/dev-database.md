# Dev Database

The merged app develops against a local Postgres database named `zhu` that
holds the Django (`zhu-core`) schema and a copy of production data.

## Prerequisites

- A local PostgreSQL server running on `localhost:5432`.
- `psql`, `pg_dump`, and `pg_restore` on PATH.
- SSH access to the production server (to pull a dump).

## One-time setup

Create the database and load it from a production dump:

```bash
createdb -h localhost zhu

# Adjust the SSH host and prod DB name/user to your environment.
ssh <prod-host> "pg_dump -Fc -U <prod-db-user> <prod-db-name>" > /tmp/zhu-prod.dump
pg_restore --no-owner --no-privileges -h localhost -d zhu /tmp/zhu-prod.dump
```

A production dump provides both the schema (needed for introspection) and real
data (needed by the later validation phase).

## Connecting

The app and tooling read `DATABASE_URL` from `zhu-frontend/.env`:

```
DATABASE_URL=postgresql://<your-pg-user>@localhost:5432/zhu
```

Use `.env`, not `.env.local`. The test runner and drizzle-kit both load it via
`dotenv/config`, which reads `.env` only; Next.js reads either.
