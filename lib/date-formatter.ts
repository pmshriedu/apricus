/**
 * Utility functions for formatting dates in the application
 */

/**
 * Options for date formatting
 */
interface DateFormatterOptions {
  /** Whether to include the year in the formatted date (default: true) */
  includeYear?: boolean;
  /** Whether to include the day of week (default: false) */
  includeDay?: boolean;
  /** The locale to use for formatting (default: 'en-US') */
  locale?: string;
}

/**
 * Formats a date string into a human-readable format
 * @param {string | Date} dateString - The date string to format (ISO 8601 format)
 * @param {DateFormatterOptions} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatDate(
  dateString: string | Date,
  options: DateFormatterOptions = {}
): string {
  const { includeYear = true, includeDay = false, locale = "en-US" } = options;

  if (!dateString) return "";

  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString);
      return "";
    }

    const formatOptions: Intl.DateTimeFormatOptions = {
      month: "short", // 'Jan', 'Feb', etc.
      day: "numeric", // 1, 2, etc.
    };

    if (includeYear) {
      formatOptions.year = "numeric"; // 2025
    }

    if (includeDay) {
      formatOptions.weekday = "short"; // 'Mon', 'Tue', etc.
    }

    return date.toLocaleDateString(locale, formatOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return typeof dateString === "string" ? dateString : "";
  }
}

/**
 * Formats a date for display in a datetime input field
 * @param {string | Date} dateString - The date string to format
 * @returns {string} Date string in YYYY-MM-DD format
 */
export function formatDateForInput(dateString: string | Date): string {
  if (!dateString) return "";

  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
}

/**
 * Returns a relative time string (e.g., "2 days ago", "in 3 hours")
 * @param {string | Date} dateString - The date string to format
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} Relative time string
 */
export function getRelativeTimeString(
  dateString: string | Date,
  locale = "en-US"
): string {
  if (!dateString) return "";

  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInSeconds = Math.round(diffInMs / 1000);
    const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (Math.abs(diffInSeconds) < 60) {
      return formatter.format(Math.round(diffInSeconds), "second");
    } else if (Math.abs(diffInSeconds) < 3600) {
      return formatter.format(Math.round(diffInSeconds / 60), "minute");
    } else if (Math.abs(diffInSeconds) < 86400) {
      return formatter.format(Math.round(diffInSeconds / 3600), "hour");
    } else if (Math.abs(diffInSeconds) < 2592000) {
      return formatter.format(Math.round(diffInSeconds / 86400), "day");
    } else if (Math.abs(diffInSeconds) < 31536000) {
      return formatter.format(Math.round(diffInSeconds / 2592000), "month");
    } else {
      return formatter.format(Math.round(diffInSeconds / 31536000), "year");
    }
  } catch (error) {
    console.error("Error getting relative time:", error);
    return "";
  }
}
