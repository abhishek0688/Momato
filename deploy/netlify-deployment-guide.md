# How to Deploy FoodHub on Netlify

This guide walks you through deploying your **FoodHub React frontend** to **Netlify**, and linking it to your FastAPI backend.

---

## Method 1: Git-Connected Deployment (Recommended)

1. Push your project to **GitHub** (or GitLab / Bitbucket).
2. Log into [Netlify](https://app.netlify.com/).
3. Click **"Add new site"** ➔ **"Import an existing project"** ➔ Select **GitHub**.
4. Choose your `Antigravity Project` repository.
5. Netlify will automatically read the `netlify.toml` file with the following settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
6. Click **"Deploy Site"**!
   Netlify will build the production bundle and assign you an instant live URL (e.g. `https://foodhub-platform.netlify.app`).

---

## Method 2: Instant Manual Drag-and-Drop (Netlify Drop)

If you don't have GitHub connected yet, you can deploy your pre-built `dist/` folder directly in 10 seconds:

1. Open your terminal and build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Navigate to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `c:\Users\IDEAPAD\OneDrive\Desktop\Antigravity Project\frontend\dist` folder directly onto the Netlify Drop page.
4. Your site will immediately go live!

---

## Connecting the Frontend to Your FastAPI Backend

Netlify hosts static assets and serverless functions, so your Python FastAPI backend can be hosted on a cloud provider like **Render** or **Railway** (free tiers available) or **AWS EC2**:

### Option A: Free 1-Click Hosting for Backend (Render.com)
1. Sign up on [Render.com](https://render.com/).
2. Click **New +** ➔ **Web Service** ➔ Connect your GitHub repository.
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Copy your live backend URL (e.g. `https://foodhub-backend.onrender.com`).

### Option B: Point Netlify Frontend to Backend
Once your backend is live:
1. Go to your **Netlify Dashboard** ➔ **Site configuration** ➔ **Environment variables**.
2. Add a new variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
3. Trigger a redeploy. Your Netlify frontend is now connected to your live cloud database and API!
