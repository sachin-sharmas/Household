import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { ROLES } from '../constants/index.js';
import { User } from '../models/User.js';

export async function seedDefaults() {
  const adminExists = await User.exists({ email: env.adminEmail });
  if (!adminExists) {
    const passwordHash = await bcrypt.hash(env.adminPassword, 12);
    await User.create({
      name: 'Household Grocery Admin',
      email: env.adminEmail,
      passwordHash,
      role: ROLES.ADMIN
    });
  }
}
