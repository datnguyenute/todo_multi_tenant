# Team Todo API

## Overview
Multi-tenant Todo application with RBAC, GraphQL Query + REST Mutation.

## Tech Stack
- NestJS
- PostgreSQL
- Prisma
```
npx prisma generate
```
- JWT Auth
- GraphQL (Query)
- REST (Mutation)

## Architecture
- Domain-driven modules
- RBAC with permission matrix
- Workspace-based multi-tenant

## Running locally
```bash
docker compose up -d
npm run start:dev
