import { authService } from '../authService';

describe('AuthService', () => {
  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword123';
      const hash = await authService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it('should verify correct password', async () => {
      const password = 'testPassword123';
      const hash = await authService.hashPassword(password);

      const isValid = await authService.verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hash = await authService.hashPassword(password);

      const isValid = await authService.verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT Token', () => {
    it('should generate valid JWT token', () => {
      const token = authService.generateToken(1, 'test@example.com', 'Admin');

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should verify and decode valid token', () => {
      const userId = 1;
      const email = 'test@example.com';
      const role = 'Admin';

      const token = authService.generateToken(userId, email, role);
      const decoded = authService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(userId);
      expect(decoded?.email).toBe(email);
      expect(decoded?.role).toBe(role);
    });

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = authService.verifyToken(invalidToken);

      expect(decoded).toBeNull();
    });
  });
});
