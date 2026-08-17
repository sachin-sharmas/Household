export const ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin'
});

export const AUTH_COOKIE_NAME = 'household_grocery_token';

export const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const ITEM_STATUSES = Object.freeze({
  PENDING: 'pending',
  PURCHASED: 'purchased',
  DELIVERED: 'delivered'
});
