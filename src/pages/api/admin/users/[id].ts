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

    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    switch (req.method) {
      case 'GET':
        return await getUser(req, res, id);
      
      case 'PUT':
        return await updateUser(req, res, id);
      
      case 'DELETE':
        return await deleteUser(req, res, id, user.id);
      
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Admin user API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUser(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const userData = await knex('users')
      .select(
        'users.id',
        'users.email',
        'users.name',
        'users.role',
        'users.status',
        'users.created_at as createdAt',
        'users.updated_at as updatedAt',
        'user_preferences.language',
        'user_preferences.timezone',
        'user_preferences.two_fa_enabled as twoFaEnabled',
        'user_preferences.last_login_at as lastLoginAt'
      )
      .leftJoin('user_preferences', 'users.id', 'user_preferences.user_id')
      .where('users.id', id)
      .first();

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(userData);
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string
) {
  try {
    const { email, name, password, role, status } = req.body;

    // Check if user exists
    const existingUser = await knex('users').where({ id }).first();
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate role if provided
    if (role) {
      const validRoles = ['Admin', 'Owner', 'Analyst', 'Viewer'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          error: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
        });
      }
    }

    // Check email uniqueness if email is being changed
    if (email && email !== existingUser.email) {
      const emailExists = await knex('users')
        .where({ email })
        .whereNot({ id })
        .first();
      
      if (emailExists) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    // Build update object
    const updateData: any = {
      updated_at: knex.fn.now(),
    };

    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    // Hash password if provided
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    // Update user
    const [updatedUser] = await knex('users')
      .where({ id })
      .update(updateData)
      .returning(['id', 'email', 'name', 'role', 'status', 'updated_at as updatedAt']);

    return res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
}

async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse,
  id: string,
  currentUserId: number
) {
  try {
    // Prevent self-deletion
    if (Number(id) === currentUserId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check if user exists
    const existingUser = await knex('users').where({ id }).first();
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user and related data in transaction
    await knex.transaction(async (trx) => {
      // Delete user preferences
      await trx('user_preferences').where({ user_id: id }).delete();
      
      // Delete user
      await trx('users').where({ id }).delete();
    });

    return res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
}

