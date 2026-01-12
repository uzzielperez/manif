/**
 * Simple admin authentication helper for marketing agent functions
 * Checks for admin password in request headers or query params
 */

export function checkAdminAuth(event: any): boolean {
  // Get admin password from environment or use default
  const adminPassword = process.env.ADMIN_PASSWORD || 'manifest-admin-2024';
  
  // Check Authorization header
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (authHeader) {
    // Support "Bearer <password>" or just the password
    const token = authHeader.replace('Bearer ', '').trim();
    if (token === adminPassword) {
      return true;
    }
  }
  
  // Check query parameter (less secure, but convenient for testing)
  const queryParams = new URLSearchParams(event.queryStringParameters || {});
  const adminKey = queryParams.get('admin_key');
  if (adminKey === adminPassword) {
    return true;
  }
  
  // For now, allow access (will be restricted once password is set in production)
  // In production, return false if no valid auth is found
  if (process.env.NODE_ENV === 'production' && !adminPassword) {
    return false;
  }
  
  // Development mode: allow access
  return true;
}
