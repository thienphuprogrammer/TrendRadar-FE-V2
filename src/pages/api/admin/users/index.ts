import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUser } from '@/apollo/server/auth/authMiddleware';
import knex from '@/apollo/server/utils/knex';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Authenticate user
    const user = await authenticateUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is Admin
    if (user.role !== 'Admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    switch (req.method) {
      case 'GET':
        return await getUsers(req, res);
      
      case 'POST':
        return await createUser(req, res);
      
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Admin users API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;

    let query = knex('users')
      .select(
        'users.id',
        'users.email',
        'users.name',
        'users.role',
        'users.status',
        'users.created_at as createdAt',
        'users.updated_at as updatedAt',
        knex.raw('user_preferences.last_login_at as lastLoginAt')
      )
      .leftJoin('user_preferences', 'users.id', 'user_preferences.user_id');

    // Apply filters
    if (search) {
      query = query.where((builder) => {
        builder
          .where('users.email', 'like', `%${search}%`)
          .orWhere('users.name', 'like', `%${search}%`);
      });
    }

    if (role) {
      query = query.where('users.role', role);
    }

    if (status) {
      query = query.where('users.status', status);
    }

    // Get total count
    const countQuery = query.clone();
    const [{ count }] = await countQuery.count('* as count');

    // Apply pagination
    const offset = (Number(page) - 1) * Number(limit);
    const users = await query
      .limit(Number(limit))
      .offset(offset)
      .orderBy('users.created_at', 'desc');

    return res.status(200).json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(count),
        pages: Math.ceil(Number(count) / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, name, password, role, status = 'active' } = req.body;

    // Validate required fields
    if (!email || !name || !password || !role) {
      return res.status(400).json({
        error: 'Missing required fields: email, name, password, role',
      });
    }

    // Validate role
    const validRoles = ['Admin', 'Owner', 'Analyst', 'Viewer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
      });
    }

    // Check if user already exists
    const existingUser = await knex('users').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in transaction
    const result = await knex.transaction(async (trx) => {
      // Insert user
      const [newUser] = await trx('users')
        .insert({
          email,
          name,
          password_hash: passwordHash,
          role,
          status,
        })
        .returning(['id', 'email', 'name', 'role', 'status', 'created_at as createdAt']);

      // Create user preferences
      await trx('user_preferences').insert({
        user_id: newUser.id,
        language: 'EN',
        timezone: 'UTC',
        two_fa_enabled: false,
      });

      return newUser;
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: result,
    });
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

