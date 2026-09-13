# ChatApp Backend — Vercel version (no credit card required)


## How to deploy (no card needed, all from phone browser)

1. Upload these files to a GitHub repository (same as before — via
   github.com in Chrome, "uploading an existing file").
2. Go to https://vercel.com and sign up (use "Continue with GitHub" —
   no card required for the Hobby/free plan).
3. Click **"Add New" → "Project"**.
4. Select your GitHub repository.
5. Before deploying, open **Environment Variables** and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from console.anthropic.com (starts with `sk-ant-`)
6. Click **Deploy**.
7. After a minute or two you'll get a live URL like:
   `https://your-project-name.vercel.app`

Your endpoints will be:
- `https://your-project-name.vercel.app/api/chat`
- `https://your-project-name.vercel.app/api/generate-image`

## Connect it to the HTML app

In `chatapp.html`, set:
```js
BACKEND_BASE_URL: "https://your-project-name.vercel.app"
```
