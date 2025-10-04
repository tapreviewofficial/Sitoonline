// Input validation and sanitization utilities for security

// XSS-prone patterns to detect and block
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // event handlers like onclick, onerror
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
];

// SQL injection patterns (additional layer, Drizzle ORM already prevents this)
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
  /(;|--|\*|\/\*|\*\/)/g,
  /(\bOR\b|\bAND\b).*=.*=/gi,
];

/**
 * Sanitize text input by removing dangerous patterns
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove XSS patterns
  let sanitized = input;
  XSS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  // Trim and normalize whitespace
  return sanitized.trim();
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const lowercased = email.toLowerCase().trim();
  
  if (!emailRegex.test(lowercased)) {
    throw new Error('Invalid email format');
  }
  
  // Remove any XSS attempts
  if (XSS_PATTERNS.some(pattern => pattern.test(lowercased))) {
    throw new Error('Invalid characters in email');
  }
  
  return lowercased;
}

/**
 * Validate username (alphanumeric, underscore, dash only)
 */
export function sanitizeUsername(username: string): string {
  if (!username || typeof username !== 'string') {
    throw new Error('Username is required');
  }
  
  // Remove leading/trailing whitespace
  const trimmed = username.trim();
  
  // Check length
  if (trimmed.length < 3 || trimmed.length > 30) {
    throw new Error('Username must be between 3 and 30 characters');
  }
  
  // Only allow alphanumeric, underscore, and dash
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(trimmed)) {
    throw new Error('Username can only contain letters, numbers, underscores, and dashes');
  }
  
  return trimmed;
}

/**
 * Sanitize URL (remove javascript:, data:, etc.)
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  const trimmed = url.trim();
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = trimmed.toLowerCase();
  
  if (dangerousProtocols.some(proto => lowerUrl.startsWith(proto))) {
    throw new Error('Invalid URL protocol');
  }
  
  // Ensure it starts with http:// or https:// or is a relative path
  if (!lowerUrl.startsWith('http://') && !lowerUrl.startsWith('https://') && !lowerUrl.startsWith('/')) {
    // Auto-prepend https://
    return `https://${trimmed}`;
  }
  
  return trimmed;
}

/**
 * Sanitize HTML content (for rich text fields)
 * This is a basic implementation - for production, use DOMPurify
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Remove script tags and event handlers
  let sanitized = html;
  XSS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  // Strip dangerous attributes
  sanitized = sanitized.replace(/\s(on\w+|style|formaction|form)\s*=/gi, ' data-removed=');
  
  return sanitized;
}

/**
 * Detect potential SQL injection attempts (paranoid mode)
 */
export function validateNoSqlInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return true;
  
  return !SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * General purpose input sanitizer
 */
export function sanitizeInput(input: unknown, type: 'text' | 'email' | 'url' | 'username' | 'html' = 'text'): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  switch (type) {
    case 'email':
      return sanitizeEmail(input);
    case 'username':
      return sanitizeUsername(input);
    case 'url':
      return sanitizeUrl(input);
    case 'html':
      return sanitizeHtml(input);
    case 'text':
    default:
      return sanitizeText(input);
  }
}
