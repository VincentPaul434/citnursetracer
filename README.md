# citnursetracer

## Admin Login

An admin authentication flow is available with these routes:

- `/admin/login` - Admin sign in page
- `/admin/dashboard` - Protected admin dashboard
- `/admin/logout` - Logout endpoint (POST)

Configure the backend API URL and session signing secret:

```env
ADMIN_API_BASE_URL=http://localhost:8080
ADMIN_SESSION_SECRET=your-long-random-secret
```

The admin login form validates credentials against the backend endpoint `/api/v1/auth/login` and stores the returned token in a signed HttpOnly session cookie for server-side admin requests.