/**
 * Security Validation Utilities
 * Provides input sanitization and validation to prevent injection attacks
 */

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Phone regex - allows international formats
const PHONE_REGEX = /^[\d\s\-+()]{7,20}$/;

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    if (email.length > 254) return false; // RFC 5321 limit
    return EMAIL_REGEX.test(email.trim());
}

/**
 * Validates phone number format
 */
export function isValidPhone(phone: string): boolean {
    if (!phone || typeof phone !== 'string') return false;
    return PHONE_REGEX.test(phone.trim());
}

/**
 * Validates and parses integer ID
 * Returns null if invalid (prevents SQL injection via ID parameters)
 */
export function parseValidId(id: string | number | null | undefined): number | null {
    if (id === null || id === undefined) return null;

    // Already a number
    if (typeof id === 'number') {
        if (!Number.isInteger(id) || id < 0) return null;
        return id;
    }

    // String - must be numeric only
    if (typeof id === 'string') {
        // Reject anything that's not purely numeric
        if (!/^\d+$/.test(id.trim())) return null;
        const parsed = parseInt(id.trim(), 10);
        if (isNaN(parsed) || parsed < 0) return null;
        return parsed;
    }

    return null;
}

/**
 * Sanitizes text input to prevent XSS
 * Escapes HTML special characters
 */
export function sanitizeText(input: string | null | undefined): string {
    if (!input || typeof input !== 'string') return '';

    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

/**
 * Sanitizes text but preserves newlines (for textareas/messages)
 */
export function sanitizeMultilineText(input: string | null | undefined): string {
    if (!input || typeof input !== 'string') return '';

    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

/**
 * Strips all HTML tags from input
 */
export function stripHtml(input: string | null | undefined): string {
    if (!input || typeof input !== 'string') return '';
    return input.replace(/<[^>]*>/g, '').trim();
}

/**
 * Validates a URL string
 */
export function isValidUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

/**
 * Validates a date string
 */
export function isValidDate(dateString: string): boolean {
    if (!dateString || typeof dateString !== 'string') return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

/**
 * Validates booking/event data
 */
export interface BookingValidationResult {
    valid: boolean;
    errors: string[];
}

export function validateBookingData(data: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    eventDate?: string;
}): BookingValidationResult {
    const errors: string[] = [];

    if (data.email && !isValidEmail(data.email)) {
        errors.push('Invalid email format');
    }

    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Invalid phone format');
    }

    if (data.firstName && (data.firstName.length < 1 || data.firstName.length > 100)) {
        errors.push('First name must be between 1 and 100 characters');
    }

    if (data.lastName && (data.lastName.length < 1 || data.lastName.length > 100)) {
        errors.push('Last name must be between 1 and 100 characters');
    }

    if (data.eventDate && !isValidDate(data.eventDate)) {
        errors.push('Invalid event date');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Rate limiting helper - stores request counts in memory
 * Note: For production, use Redis or similar distributed cache
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 60000
): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const record = requestCounts.get(identifier);

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
        for (const [key, value] of requestCounts.entries()) {
            if (value.resetTime < now) {
                requestCounts.delete(key);
            }
        }
    }

    if (!record || record.resetTime < now) {
        // New window
        requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
        return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
    }

    if (record.count >= maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetIn: record.resetTime - now
        };
    }

    record.count++;
    return {
        allowed: true,
        remaining: maxRequests - record.count,
        resetIn: record.resetTime - now
    };
}
