import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ROLES } from '../constants/index.js';
import { buildItemFilterQuery } from '../utils/itemQuery.js';
import { Item } from '../models/Item.js';
import { PushSubscription } from '../models/PushSubscription.js';
import { User } from '../models/User.js';

const OWNER_POPULATE_FIELDS = 'name email role';

export const listUsers = catchAsync(async (_req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: 'requestedBy',
        as: 'requestedItems'
      }
    },
    {
      $project: {
        name: 1,
        email: 1,
        phone: 1,
        role: 1,
        createdAt: 1,
        itemCount: { $size: '$requestedItems' }
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  res.json({ users });
});

export const createUser = catchAsync(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('Email is already registered');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, phone, passwordHash, role });

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');

  if (email && email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing) throw ApiError.conflict('Email is already registered');
    user.email = email;
  }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (role !== undefined) user.role = role;
  if (password) user.passwordHash = await bcrypt.hash(password, 12);

  await user.save();

  res.json({
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
  });
});

export const removeUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) throw ApiError.notFound('User not found');
  if (user.role === ROLES.ADMIN) throw ApiError.badRequest('Admin users cannot be removed');

  await Item.deleteMany({ requestedBy: user._id });
  await PushSubscription.deleteMany({ user: user._id });
  await user.deleteOne();

  res.json({ message: 'User and their items removed' });
});

export const listAllItems = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const query = buildItemFilterQuery(req.query);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Item.find(query)
      .populate('requestedBy', OWNER_POPULATE_FIELDS)
      .populate('assignedTo', OWNER_POPULATE_FIELDS)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Item.countDocuments(query)
  ]);

  res.json({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      hasMore: skip + items.length < total
    }
  });
});

export const getStats = catchAsync(async (_req, res) => {
  const [users, items, categories] = await Promise.all([
    User.countDocuments(),
    Item.countDocuments(),
    Item.distinct('category')
  ]);

  res.json({ stats: { users, items, categories: categories.length } });
});
