/**
 * Formats a UTC ISO timestamp into a user-friendly relative format
 * 
 * @param utcDateString ISO string date from backend (in UTC format)
 * @returns Formatted date string based on time difference
 */
export const smartFormatDate = (utcDateString: string | null): string => {
    if (!utcDateString) return '';
    
    try {
      // Parse the UTC ISO string to a Date object
      // JavaScript automatically converts this to local time
      const localDate = new Date(utcDateString);
      
      // Verify the date is valid
      if (isNaN(localDate.getTime())) {
        console.error('Invalid date string:', utcDateString);
        return '';
      }
      
      // Get current time
      const now = new Date();
      
      // Calculate time differences (in milliseconds)
      const diffMs = now.getTime() - localDate.getTime();
      
      // Calculate different units of time
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      // Format based on elapsed time
      if (diffSeconds < 60) {
        return 'Just now';
      }
      
      if (diffMinutes < 60) {
        return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      
      if (diffHours < 24) {
        return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      }
      
      // Check for yesterday
      const localDateDay = localDate.getDate();
      const localDateMonth = localDate.getMonth();
      const localDateYear = localDate.getFullYear();
      
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      
      const isYesterday = 
        localDateDay === yesterday.getDate() &&
        localDateMonth === yesterday.getMonth() &&
        localDateYear === yesterday.getFullYear();
      
      if (isYesterday) {
        return `Yesterday at ${localDate.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit'
        })}`;
      }
      
      if (diffDays < 7) {
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
      }
      
      // For dates older than a week
      return localDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };