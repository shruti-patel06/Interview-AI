# Hire Ready

AI interview preparation. Paste a job description, upload your resume (PDF) and/or describe yourself, and Google Gemini generates a personalised report:

- a match score (0–100) for the role
- likely technical and behavioral questions, with why they're asked and how to answer
- skill gaps ranked by severity
- a day-by-day preparation plan

It can also generate a resume tailored to the job and download it as a PDF.

## Structure

| Folder | Stack | Hosted on |
| --- | --- | --- |
| `Backend/` | Node.js, Express 5, MongoDB (Mongoose), Gemini (`@google/genai`), Puppeteer | Render |
| `Frontend/` | React 19, Vite, React Router, SCSS | Vercel |

## Running locally

### Backend

```bash
cd Backend
npm install
npm run dev      # http://localhost:3000
```

`Backend/.env`:

| Variable | Required | Description |
| --- | --- | --- |
| `MONGO_URI` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | Secret used to sign the auth cookie |
| `GOOGLE_GENAI_API_KEY` | yes | Gemini API key |
| `FRONTEND_URL` | production | Frontend origin allowed by CORS (default `http://localhost:5173`) |
| `NODE_ENV` | production | Set to `production` for cross-site (`SameSite=None; Secure`) cookies |
| `PORT` | no | Defaults to `3000` |

### Frontend

```bash
cd Frontend
npm install
npm run dev      # http://localhost:5173
```

`Frontend/.env` (optional locally): `VITE_API_URL` — backend URL, defaults to `http://localhost:3000`.

## API

All `/api/interview` routes require the auth cookie.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account (`username`, `email`, `password`) |
| POST | `/api/auth/login` | Log in (`email`, `password`) |
| POST | `/api/auth/logout` | Log out and revoke the token |
| GET | `/api/auth/get-me` | Current user |
| POST | `/api/interview/` | Generate a report — multipart: `jobDescription` (≤ 5000 chars), `resume` (PDF ≤ 3 MB) and/or `selfDescription` |
| GET | `/api/interview/` | List your reports |
| GET | `/api/interview/report/:id` | Get one report |
| POST | `/api/interview/resume/pdf/:id` | Generate a tailored resume PDF |

Errors are always returned as JSON: `{ "message": "..." }`.

## Deployment notes

- **Render (backend):** `Backend/.puppeteerrc.cjs` stores Puppeteer's Chrome inside the project on Render, so it's still available at runtime. If PDF downloads fail after a deploy, use *Clear build cache & deploy*.
- **Vercel (frontend):** `Frontend/vercel.json` rewrites every path to `index.html` for client-side routing. Set `VITE_API_URL` to the Render URL.
