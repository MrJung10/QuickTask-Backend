export function normalizeDueDate(dueDate: string): Date {
  
    // Handle 'YYYY-MM-DD' format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      return new Date(`${dueDate}T00:00:00.000Z`);
    }
  
    // Handle full ISO strings
    return new Date(dueDate);
  }