import mongoose from 'mongoose';
import { ITEM_STATUSES } from '../constants/index.js';

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    requestedAt: { type: Date, default: Date.now },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    notes: { type: String, default: '', trim: true },
    status: { type: String, enum: Object.values(ITEM_STATUSES), default: ITEM_STATUSES.PENDING },
    completedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const Item = mongoose.model('Item', itemSchema);
