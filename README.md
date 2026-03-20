# citnursetracer

## Admin Login

An admin authentication flow is available with these routes:

- `/admin/login` - Admin sign in page
- `/admin/dashboard` - Protected admin dashboard
- `/admin/logout` - Logout endpoint (POST)

Configure the backend API URL and session signing secret:

```env
ADMIN_API_BASE_URL=https://tracer-backend-mkls.onrender.com
ADMIN_SESSION_SECRET=your-long-random-secret
```

The admin login form validates credentials against the backend endpoint `/api/v1/auth/login` and stores the returned token in a signed HttpOnly session cookie for server-side admin requests.

## Survey Submission

Public survey submissions post to the Next.js route `/api/survey-responses`, which proxies to the backend endpoint `/api/v1/submissions` using `ADMIN_API_BASE_URL`.