import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ROLES } from '../constants/index.js';
import { buildItemFilterQuery } from '../utils/itemQuery.js';
import { Item } from '../models/Item.js';
import { sendEmail } from '../utils/mail.js';
import { sendPushToUser } from '../utils/push.js';
import { logger } from '../utils/logger.js';

const OWNER_POPULATE_FIELDS = 'name email role';

// SMS notifications via Twilio are wired but disabled for now (paid account setup pending).
// See server/src/utils/sms.js and server/.env for TWILIO_* config to re-enable later.
async function notifyAssignee(item) {
  // No point notifying people about items they assigned to themselves.
  if (item.assignedTo._id.toString() === item.requestedBy._id.toString()) return;

  try {
    await Promise.all([
      sendEmail({
        to: item.assignedTo.email,
        subject: `You've been assigned a grocery item: ${item.name}`,
        text: `Hi ${item.assignedTo.name},\n\n${item.requestedBy.name} added "${item.name}" (${item.quantity}) to the list and assigned it to you.\n\nAdded by: ${item.requestedBy.name} <${item.requestedBy.email}>\n\n- Household Grocery`,
        replyTo: item.requestedBy.email
      }),
      sendPushToUser(item.assignedTo._id, {
        title: 'New grocery item assigned to you',
        body: `${item.requestedBy.name} assigned "${item.name}" (${item.quantity}) to you.`,
        url: '/my-assigned'
      })
    ]);
  } catch (error) {
    logger.warn(`Failed to notify assignee for item ${item._id}: ${error.message}`);
  }
}

function isOwnerOrAdmin(user, item) {
  if (user.role === ROLES.ADMIN) return true;
  return item.requestedBy.toString() === user._id.toString();
}

function canUpdateStatus(user, item) {
  if (isOwnerOrAdmin(user, item)) return true;
  return item.assignedTo.toString() === user._id.toString();
}

function buildScopedQuery(req) {
  const { scope } = req.query;
  const query = buildItemFilterQuery(req.query);

  if (scope === 'mine') {
    query.$or = [{ requestedBy: req.user._id }, { assignedTo: req.user._id }];
  } else if (scope === 'assigned') {
    query.assignedTo = req.user._id;
  }

  return query;
}

export const listItems = catchAsync(async (req, res) => {
  const query = buildScopedQuery(req);
  const { page, limit } = req.query;
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

export const getItemStats = catchAsync(async (req, res) => {
  const { scope } = req.query;
  const scopeQuery = {};

  if (scope === 'mine') {
    scopeQuery.$or = [{ requestedBy: req.user._id }, { assignedTo: req.user._id }];
  } else if (scope === 'assigned') {
    scopeQuery.assignedTo = req.user._id;
  }

  const [total, pending, purchased, delivered, requestedByMe, assignedToMe] = await Promise.all([
    Item.countDocuments(scopeQuery),
    Item.countDocuments({ ...scopeQuery, status: 'pending' }),
    Item.countDocuments({ ...scopeQuery, status: 'purchased' }),
    Item.countDocuments({ ...scopeQuery, status: 'delivered' }),
    Item.countDocuments({ requestedBy: req.user._id }),
    Item.countDocuments({ assignedTo: req.user._id })
  ]);

  res.json({ stats: { total, pending, purchased, delivered, requestedByMe, assignedToMe } });
});

export const createItem = catchAsync(async (req, res) => {
  const completedAt = req.body.status === 'delivered' ? new Date() : null;
  const item = await Item.create({ ...req.body, requestedBy: req.user._id, completedAt });
  await item.populate([
    { path: 'requestedBy', select: OWNER_POPULATE_FIELDS },
    { path: 'assignedTo', select: OWNER_POPULATE_FIELDS }
  ]);

  notifyAssignee(item);

  res.status(201).json({ item });
});

export const updateItem = catchAsync(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) throw ApiError.notFound('Item not found');

  const bodyKeys = Object.keys(req.body);
  const isStatusOnlyUpdate = bodyKeys.length === 1 && bodyKeys[0] === 'status';
  const allowed = isStatusOnlyUpdate ? canUpdateStatus(req.user, item) : isOwnerOrAdmin(req.user, item);

  if (!allowed) {
    throw ApiError.forbidden(
      isStatusOnlyUpdate
        ? 'Only the person who added this item, the assignee, or an admin can update its status'
        : 'Only the person who added this item (or an admin) can edit it'
    );
  }

  if (req.body.status && req.body.status !== item.status) {
    item.completedAt = req.body.status === 'delivered' ? new Date() : null;
  }

  const previousAssignedTo = item.assignedTo.toString();

  Object.assign(item, req.body);
  await item.save();
  await item.populate([
    { path: 'requestedBy', select: OWNER_POPULATE_FIELDS },
    { path: 'assignedTo', select: OWNER_POPULATE_FIELDS }
  ]);

  if (item.assignedTo._id.toString() !== previousAssignedTo) {
    notifyAssignee(item);
  }

  res.json({ item });
});

export const deleteItem = catchAsync(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) throw ApiError.notFound('Item not found');
  if (!isOwnerOrAdmin(req.user, item)) throw ApiError.forbidden('Only the person who added this item (or an admin) can delete it');

  await item.deleteOne();
  res.json({ message: 'Item deleted' });
});
