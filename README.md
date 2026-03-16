# citnursetracer

## Backend integration

Survey submissions now post to `POST /api/v1/submissions` in the frontend app and are proxied to the Spring backend.

1. Copy `.env.example` to `.env.local`
2. Set `BACKEND_API_BASE_URL` to your backend root host (for example: `http://localhost:8080`)
	- Do not append `/api/v1/submissions` to this variable.
	- If you prefer a full endpoint, set `BACKEND_SUBMISSION_URL` instead.
3. Run the frontend with `pnpm dev`

When you click **Submit Survey**, the form is sent to the backend endpoint and uses backend responses for success/error handling.