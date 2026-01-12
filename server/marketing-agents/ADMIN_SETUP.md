# Admin Portal Setup Guide

## Accessing the Admin Portal

The marketing agents dashboard is now protected behind an admin portal.

### URL
- **Admin Portal**: `https://manifest.ink/admin`
- **Old URL** (no longer accessible): `/marketing-dashboard` (removed for security)

### Authentication

The admin portal uses password-based authentication. The password can be set in two ways:

#### Option 1: Environment Variable (Recommended)
Set `REACT_APP_ADMIN_PASSWORD` in your Netlify environment variables:
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add: `REACT_APP_ADMIN_PASSWORD` = `your-secure-password-here`
3. Redeploy the site

#### Option 2: Default Password (Development Only)
If no environment variable is set, the default password is:
- `manifest-admin-2024`

**⚠️ Important**: Change this in production!

### Session Duration
- Admin sessions last **8 hours**
- After 8 hours, you'll need to log in again
- Sessions are stored in browser localStorage

### Security Features

1. **Password Protection**: Admin portal requires password to access
2. **API Authentication**: Marketing agent API endpoints check for admin authentication
3. **Session Management**: Automatic logout after 8 hours
4. **No Public Links**: Marketing dashboard is not linked in navigation

### Setting Up API Authentication

For API endpoints, you can authenticate using:

1. **Authorization Header**:
   ```bash
   curl -H "Authorization: Bearer your-admin-password" \
     https://manifest.ink/.netlify/functions/marketing-agents/agent-status
   ```

2. **Query Parameter** (less secure, for testing only):
   ```bash
   curl "https://manifest.ink/.netlify/functions/marketing-agents/agent-status?admin_key=your-admin-password"
   ```

### Best Practices

1. **Use Strong Password**: Choose a strong, unique password
2. **Set Environment Variable**: Don't rely on default password in production
3. **Rotate Passwords**: Change admin password periodically
4. **Monitor Access**: Check Netlify function logs for unauthorized access attempts
5. **Don't Share URL**: Keep the `/admin` URL private

### Troubleshooting

**Can't log in?**
- Check that `REACT_APP_ADMIN_PASSWORD` is set correctly in Netlify
- Verify the password matches what you're entering
- Clear browser localStorage and try again

**API returns 401 Unauthorized?**
- Make sure you're passing the admin password in the Authorization header
- Check that `ADMIN_PASSWORD` environment variable matches your password

**Session expired?**
- Simply log in again - sessions last 8 hours
- This is by design for security

### Future Enhancements

Consider implementing:
- Two-factor authentication (2FA)
- IP whitelisting
- Audit logging of admin access
- Role-based access control (RBAC)
- JWT tokens instead of localStorage
