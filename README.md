# Identity Reconciliation - Bitespeed Backend Assignment

This is a backend system that solves the **identity reconciliation problem**, where different customer entries (via phone, email, etc.) may refer to the same individual. The system consolidates such partial identities and maintains a unified view of a customer.

---

## Features

- Accepts user identities via phone/email
- Reconciles partial identities into a primary customer profile
- Handles new or duplicate identities gracefully

---

## Tech Stack

| Layer       | Technology             |
|-------------|------------------------|
| Language    | TypeScript             |
| Runtime     | Node.js (v18+)         |
| Framework   | Express.js             |
| Database    | PostgreSQL             |
| ORM         | Sequelize              |
| Dev Tools   | Docker, ts-node-dev    |
| Linting     | ESLint                 |
| Logging     | Morgan                 |

---
