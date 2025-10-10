import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getLogger } from '../utils';
import { getKnex } from '../utils/knex';

const logger = getLogger('AUTH_SERVICE');

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'Admin' | 'Owner' | 'Analyst' | 'Viewer';
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface AuthPayload {
  user: User;
  token: string;
  expiresAt: Date;
}

const JWT_SECRET = process.env.JWT_SECRET || 'trendradar-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  /**
   * Hash a password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Verify a password against its hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a JWT token
   */
  generateToken(userId: number, email: string, role: string): string {
    return jwt.sign(
      { userId, email, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  /**
   * Verify and decode a JWT token
   */
  verifyToken(token: string): { userId: number; email: string; role: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        email: string;
        role: string;
      };
      return decoded;
    } catch (error) {
      logger.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Login a user
   */
  async login(email: string, password: string): Promise<AuthPayload | null> {
    const knex = getKnex();

    // Find user by email
    const user = await knex('users')
      .where({ email })
      .first();

    if (!user) {
      logger.warn(`Login attempt for non-existent user: ${email}`);
      return null;
    }

    // Check if user is active
    if (user.status !== 'active') {
      logger.warn(`Login attempt for ${user.status} user: ${email}`);
      return null;
    }

    // Verify password
    const isValid = await this.verifyPassword(password, user.password_hash);
    if (!isValid) {
      logger.warn(`Invalid password for user: ${email}`);
      return null;
    }

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create session
    await knex('sessions').insert({
      user_id: user.id,
      token,
      expires_at: expiresAt
    });

    // Update last login
    await knex('users')
      .where({ id: user.id })
      .update({ last_login_at: new Date() });

    logger.info(`User logged in: ${email} (${user.role})`);

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as User,
      token,
      expiresAt
    };
  }

  /**
   * Logout a user
   */
  async logout(token: string): Promise<boolean> {
    const knex = getKnex();

    const result = await knex('sessions')
      .where({ token })
      .del();

    return result > 0;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<User | null> {
    const knex = getKnex();

    const user = await knex('users')
      .where({ id: userId })
      .first();

    if (!user) {
      return null;
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * Get user by token
   */
  async getUserByToken(token: string): Promise<User | null> {
    const knex = getKnex();

    // Verify token
    const decoded = this.verifyToken(token);
    if (!decoded) {
      return null;
    }

    // Check session
    const session = await knex('sessions')
      .where({ token })
      .where('expires_at', '>', new Date())
      .first();

    if (!session) {
      return null;
    }

    // Get user
    return this.getUserById(decoded.userId);
  }

  /**
   * Register a new user (Admin only)
   */
  async register(
    email: string,
    name: string,
    password: string,
    role: 'Admin' | 'Owner' | 'Analyst' | 'Viewer'
  ): Promise<User> {
    const knex = getKnex();

    // Check if user exists
    const existingUser = await knex('users').where({ email }).first();
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const [userId] = await knex('users')
      .insert({
        email,
        name,
        password_hash: passwordHash,
        role,
        status: 'active'
      })
      .returning('id');

    // Create user preferences
    await knex('user_preferences').insert({
      user_id: userId,
      language: 'EN',
      timezone: 'UTC',
      two_fa_enabled: false
    });

    logger.info(`User registered: ${email} (${role})`);

    return this.getUserById(userId) as Promise<User>;
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const knex = getKnex();

    const result = await knex('sessions')
      .where('expires_at', '<', new Date())
      .del();

    if (result > 0) {
      logger.info(`Cleaned up ${result} expired sessions`);
    }

    return result;
  }
}

export const authService = new AuthService();


