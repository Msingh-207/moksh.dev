---
slug: levithan-backend
title: Backend & Cloud Infrastructure @ Levithan Technologies
subtitle: Production engineering case study
track: dev
year: "2026"
role: Software Developer Trainee
order: 2
featured: true
summary: REST APIs, relational schemas, Docker containerisation and CI/CD pipelines, learnt and shipped inside a production engineering team.
stack: [REST APIs, MySQL, PostgreSQL, Docker, CI/CD, Git, Python]
metrics:
  - { label: Role, value: SDE Trainee }
  - { label: Since, value: Sept 2026 }
  - { label: Focus, value: Backend + Infra }
links: []
embeds: [pipeline]
---

## Context

At **Levithan Technologies Pvt. Ltd.** I work as a Software Developer Trainee on backend services and the infrastructure that ships them. Client code is confidential, so this case study covers the *patterns and practices* rather than proprietary details.

## REST API design

- Resource-oriented endpoints with consistent pagination, filtering and error envelopes.
- Request validation at the edge so handlers only see well-formed data.
- Versioned routes so clients can migrate without breaking.

## Relational schemas

- Modelling entities in **MySQL** and **PostgreSQL** with proper foreign keys, indexes on hot query paths, and migrations tracked in version control.
- Reading query plans (`EXPLAIN`) before reaching for caching.

```sql
CREATE TABLE orders (
  id          BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id),
  status      TEXT   NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_customer_created ON orders (customer_id, created_at DESC);
```

## Containers & delivery

- Multi-stage **Docker** builds that keep runtime images small and reproducible.
- `docker compose` environments so every developer runs the same database and service versions locally.
- **CI/CD** pipelines that lint, test, build the image and deploy on merge — the diagram above traces one commit through that path.

## What I'm learning

Observability (structured logs, metrics, traces), zero-downtime migrations, and how to write runbooks that someone else can follow at 2 a.m.
