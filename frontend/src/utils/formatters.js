// Utility functions for formatting various data

// Format date to relative time
export const getRelativeTime = (timestamp) => {
    if (!timestamp) return "Recently";

    // If timestamp is already a formatted string, return it
    if (typeof timestamp === 'string' && !timestamp.match(/^\d+$/)) {
        return timestamp;
    }

    try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    } catch {
        return timestamp;
    }
};

// Format budget with proper currency symbols and thousand separators
export const formatBudget = (budget) => {
    if (!budget) return "Not specified";

    // Handle new budget object structure
    if (typeof budget === 'object') {
        // For hourly projects
        if (budget.hourlyRate) {
            const { min, max } = budget.hourlyRate;
            if (min && max) {
                return `$${min.toLocaleString()}-$${max.toLocaleString()}/hr`;
            } else if (min) {
                return `$${min.toLocaleString()}+/hr`;
            }
            return "Hourly rate";
        }

        // For fixed price projects
        if (budget.min !== undefined || budget.max !== undefined) {
            if (budget.min && budget.max) {
                return `$${budget.min.toLocaleString()}-$${budget.max.toLocaleString()}`;
            } else if (budget.min) {
                return `$${budget.min.toLocaleString()}+`;
            } else if (budget.max) {
                return `Up to $${budget.max.toLocaleString()}`;
            }
        }

        return "Budget not specified";
    }

    // If budget is already a string with currency symbol
    if (typeof budget === 'string' && (budget.includes('$') || budget.includes('€'))) {
        return budget;
    }

    // Otherwise format the number
    const numericBudget = typeof budget === 'number' ? budget : parseFloat(budget);
    if (isNaN(numericBudget)) return budget;

    return `$${numericBudget.toLocaleString()}`;
};

// Format location with proper display
export const formatLocation = (location) => {
    if (!location) return "Remote";

    // Handle location object structure
    if (typeof location === 'object') {
        if (location.type === 'remote') return "Remote";
        if (location.type === 'onsite' || location.type === 'hybrid') {
            const parts = [];
            if (location.city) parts.push(location.city);
            if (location.country) parts.push(location.country);
            if (parts.length > 0) {
                return `${parts.join(', ')} (${location.type})`;
            }
            return location.type;
        }
        return "Remote";
    }

    // Legacy string format
    return location || "Remote";
};
