import { POST } from '../route';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

describe('API /auth/logout', () => {
  it('should return 200 and a cookie-clearing header', async () => {
    // Act
    const response = await POST();
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.message).toBe('Logout successful');

    const cookie = response.headers.get('Set-Cookie');
    expect(cookie).not.toBeNull();
    expect(cookie).toContain(`${AUTH_COOKIE_NAME}=;`);
    expect(cookie?.toLowerCase()).toContain('max-age=0');
  });
});
