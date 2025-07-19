# Bitespeed Identity Reconciliation

This is a simple backend service built for Bitespeed's identity reconciliation task.  
It accepts user contact details (email/phone) and links them under a common identity.

---

## 🔗 Hosted URL

https://bitespeed-identity-reconciliation-xhfu.onrender.com

---

## 🧪 API Endpoint

### `POST /identify`

Send contact info (email or phoneNumber) to find or create a linked identity.

Example request:
```json
{
  "email": "john@example.com",
  "phoneNumber": "1234567890"
}
```

---

## 🐳 Run Locally with Docker

```bash
# Build and start the service
docker-compose up --build
```

---

## 🧱 Database Migration

To run migrations:
```bash
npm run migrate
```

---

## 📁 Project Structure

- `src/` – Express app code
- `src/database/` – Sequelize migrations
- `docker-compose.yml` – For local setup
- `Dockerfile` – App container

