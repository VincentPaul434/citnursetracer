# citnursetracer

## Admin Login

An admin authentication flow is available with these routes:

- `/admin/login` - Admin sign in page
- `/admin` - Protected admin dashboard
- `/admin/logout` - Logout endpoint (POST)

Set credentials in your environment:

```env
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password
ADMIN_SESSION_SECRET=your-long-random-secret
```

If environment variables are not set, development fallback credentials are used.