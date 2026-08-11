# Healthcare Analytics - Deployment Guide

This guide describes how to deploy the **MedPulse Healthcare Analytics** platform locally or on cloud providers (Render, Railway, Vercel, Docker).

---

## Quick Option 1: Docker Container Deployment (Recommended for Self-Hosting)

Run both MongoDB and the Healthcare Analytics web application in containers with a single command.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Steps
1. Open terminal in the project root directory.
2. Run:
   ```bash
   docker-compose up -d --build
   ```
3. Access the live application at:
   ```text
   http://localhost:5001
   ```

To stop containers:
```bash
docker-compose down
```

---

## Quick Option 2: Render.com (Free Cloud Hosting)

Deploy the full application and database online with zero server administration.

### Steps
1. Push your repository to GitHub or GitLab.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Blueprints**.
3. Connect your Git repository (Render auto-detects `render.yaml`).
4. Set the environment variable `GROQ_API_KEY` (or `GEMINI_API_KEY`).
5. Click **Apply**. Render will automatically provision the MongoDB database and deploy your Node/React web application.

---

## Quick Option 3: Railway.app Deployment

1. Go to [Railway.app](https://railway.app/).
2. Create a new project -> **Deploy from GitHub repo**.
3. Add a **MongoDB** database plugin to the project.
4. Set environment variables for your application service:
   - `PORT`: `5001`
   - `DB_URL`: `${{MongoDB.MONGO_URL}}`
   - `JWT_SECRET`: `your_random_secret`
   - `GROQ_API_KEY`: `your_groq_api_key`
5. Set Build Command: `npm run build`
6. Set Start Command: `node backend/server.js`

---

## Quick Option 4: Vercel Deployment

1. Install Vercel CLI or connect repository on [Vercel.com](https://vercel.com).
2. The project contains `vercel.json` pre-configured to route `/api/*` requests to `backend/server.js` and serve static React assets.
3. Configure environment variables in the Vercel dashboard:
   - `DB_URL`: MongoDB Atlas URI (e.g. `mongodb+srv://...`)
   - `JWT_SECRET`: `your_jwt_secret`
   - `GROQ_API_KEY`: `your_groq_api_key`

---

## Quick Option 5: Local Production Mode

Run the production build on your local machine:

1. Build frontend static bundle:
   ```bash
   npm run build
   ```
2. Ensure MongoDB is running locally on port `27017`.
3. Start the production server:
   ```bash
   npm start
   ```
4. Access app at: `http://localhost:5001`

---

## Required Environment Variables

| Variable | Description | Example / Default |
|----------|-------------|-------------------|
| `PORT` | Web server listening port | `5001` |
| `DB_URL` | MongoDB connection URI | `127.0.0.1:27017/healthcare` or Mongo Atlas URI |
| `JWT_SECRET` | Secret key for signing auth tokens | `mysecretkey` |
| `GROQ_API_KEY` | Groq cloud AI API key | `gsk_...` |
| `GEMINI_API_KEY` | Optional Gemini AI API key | `AIza...` |
