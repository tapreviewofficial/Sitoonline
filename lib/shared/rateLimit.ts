// Simple in-memory rate limiter for serverless functions
// Note: This is per-function instance. For distributed rate limiting, use Redis/Upstash

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000); // Clean every minute

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const key = identifier;

  // Clean expired entry
  if (store[key] && store[key].resetTime < now) {
    delete store[key];
  }

  // Initialize or get current state
  if (!store[key]) {
    store[key] = {
      count: 1,
      resetTime: now + config.windowMs
    };
    return { allowed: true };
  }

  // Check if limit exceeded
  if (store[key].count >= config.maxRequests) {
    const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment count
  store[key].count++;
  return { allowed: true };
}

// Predefined rate limit configs
export const RATE_LIMITS = {
  // Strict limit for login attempts (prevent brute force)
  AUTH_LOGIN: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 minutes
  
  // Medium limit for registration
  AUTH_REGISTER: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 registrations per hour
  
  // Strict limit for password reset
  PASSWORD_RESET: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 attempts per hour
  
  // Limit for ticket redemption (prevent abuse)
  TICKET_REDEEM: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 redemptions per minute
  
  // General API limit
  API_GENERAL: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 requests per minute
};
