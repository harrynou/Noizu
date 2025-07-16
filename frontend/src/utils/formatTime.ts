/**
 * Parses a UTC ISO timestamp into a local Date object
 * Ensures proper timezone conversion from UTC to client timezone
 * 
 * @param utcDateString ISO string date from backend (in UTC format)
 * @returns Local Date object or null if invalid
 */
export const parseUTCToLocal = (utcDateString: string | null): Date | null => {
    if (!utcDateString) return null;
    
    try {
        // Parse the UTC ISO string to a Date object
        // JavaScript Date constructor automatically converts UTC to local timezone
        const localDate = new Date(utcDateString);
        
        // Verify the date is valid
        if (isNaN(localDate.getTime())) {
            console.error('Invalid date string:', utcDateString);
            return null;
        }
        
        return localDate;
    } catch (error) {
        console.error('Error parsing UTC date:', error);
        return null;
    }
};

/**
 * Formats a UTC ISO timestamp into a localized date string
 * Uses Intl.DateTimeFormat for proper timezone handling
 * 
 * @param utcDateString ISO string date from backend (in UTC format)
 * @param options Intl.DateTimeFormatOptions for customization
 * @returns Formatted local date string or empty string if invalid
 */
export const formatLocalDate = (utcDateString: string | null, options?: Intl.DateTimeFormatOptions): string => {
    const localDate = parseUTCToLocal(utcDateString);
    if (!localDate) return '';
    
    try {
        const defaultOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        
        return localDate.toLocaleDateString(undefined, options || defaultOptions);
    } catch (error) {
        console.error('Error formatting local date:', error);
        return '';
    }
};

/**
 * Creates a UTC ISO timestamp string for the current moment
 * Standardizes timestamp creation across the frontend
 * 
 * @returns UTC ISO string (e.g., "2023-12-25T15:30:00.000Z")
 */
export const createUTCTimestamp = (): string => {
    return new Date().toISOString();
};

/**
 * Formats a UTC ISO timestamp into a user-friendly relative format
 * Optimized for performance and readability
 * 
 * @param utcDateString ISO string date from backend (in UTC format)
 * @returns Formatted date string based on time difference
 */
export const smartFormatDate = (utcDateString: string | null): string => {
    const localDate = parseUTCToLocal(utcDateString);
    if (!localDate) return '';
    
    try {
        
        // Get current time
        const now = new Date();
        
        // Calculate time differences (in milliseconds)
        const diffMs = now.getTime() - localDate.getTime();
        
        // Early exit for very recent times (less than 60 seconds)
        if (diffMs < 60000) {
            return 'Just now';
        }
        
        // Calculate different units of time
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        
        // Minutes ago
        if (diffMinutes < 60) {
            return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
        }
        
        const diffHours = Math.floor(diffMinutes / 60);
        
        // Hours ago
        if (diffHours < 24) {
            return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        }
        
        // Check for yesterday
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        
        if (
            localDate.getDate() === yesterday.getDate() &&
            localDate.getMonth() === yesterday.getMonth() &&
            localDate.getFullYear() === yesterday.getFullYear()
        ) {
            return `Yesterday at ${localDate.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit'
            })}`;
        }
        
        const diffDays = Math.floor(diffHours / 24);
        
        // Days ago (within a week)
        if (diffDays < 7) {
            return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
        }
        
        // Use cached date formatting options for better performance
        const dateFormatOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        
        // For dates older than a week
        return localDate.toLocaleDateString(undefined, dateFormatOptions);
        
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};
