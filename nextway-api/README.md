# NEXTWAY School Management System — Backend API

## Quick Start
```bash
npm install
# Edit .env — set MONGODB_URI
npm run seed    # Populate 180+ students, attendance, fees, exams...
npm run dev     # http://localhost:5000
```

## Environment Variables (.env)
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | 64-char random string for access tokens |
| `JWT_REFRESH_SECRET` | 64-char random string for refresh tokens |
| `CLIENT_URL` | Frontend URL for CORS (http://localhost:5173) |
| `AI_PROVIDER` | claude \| openai \| gemini |
| `ANTHROPIC_API_KEY` | For AI Doubt Solver (optional) |

## Demo Credentials (after seed)
| Role | Email | Password |
|---|---|---|
| School Admin | admin@nextway.edu | Admin@2026! |
| Principal | principal@nextway.edu | Principal@2026! |
| Teacher | priya@nextway.edu | Teacher@2026! |
| Student | aarav@student.nextway.edu | Student@2026! |
| Parent | suresh@gmail.com | Parent@2026! |

## API Base
`http://localhost:5000/api/v1`

## All Endpoints
- `POST /auth/login` `POST /auth/logout` `POST /auth/refresh` `GET /auth/me`
- `GET/POST/PUT/DELETE /students`
- `GET/POST /attendance`
- `GET/POST /fees/invoices` `POST /fees/payments`
- `GET/POST /homework` `GET/POST /exams` `GET/POST /exams/:id/results`
- `GET/POST/PATCH /leaves`
- `GET/POST/PUT/DELETE /notices`
- `GET/POST /library/books` `POST /library/issues` `PATCH /library/issues/:id/return`
- `GET/POST /transport` `GET/POST /hostel/rooms`
- `GET/POST/PUT /inventory`
- `GET /audit`
- `POST /ai/doubt` (SSE streaming)
- `GET /classes` `GET /sections` `GET /subjects`
- `GET/POST/PUT /users`
- `GET /reports/dashboard-stats`
