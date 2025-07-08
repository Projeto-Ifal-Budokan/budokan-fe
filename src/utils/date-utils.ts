/**
 * Calculates and formats the time elapsed since a given date
 * @param createdAt - The creation date as ISO string
 * @returns Formatted string in Portuguese (e.g., "6 meses", "1 ano e 2 meses")
 */
export function calculatePlatformTime(createdAt: string): string {
  if (!createdAt) return 'Não informado';

  try {
    const now = new Date();
    const createdDate = new Date(createdAt);

    // Calculate the difference in months
    const yearsDiff = now.getFullYear() - createdDate.getFullYear();
    const monthsDiff = now.getMonth() - createdDate.getMonth();
    const daysDiff = now.getDate() - createdDate.getDate();

    // Total months calculation
    let totalMonths = yearsDiff * 12 + monthsDiff;

    // Adjust if the day hasn't passed yet in the current month
    if (daysDiff < 0) {
      totalMonths--;
    }

    // Handle cases where the user was created very recently
    if (totalMonths <= 0) {
      const timeDiff = now.getTime() - createdDate.getTime();
      const daysDifference = Math.floor(timeDiff / (1000 * 3600 * 24));

      if (daysDifference === 0) {
        return 'Hoje';
      } else if (daysDifference === 1) {
        return '1 dia';
      } else if (daysDifference < 30) {
        return `${daysDifference} dias`;
      } else {
        return '1 mês';
      }
    }

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0) {
      return months === 1 ? '1 mês' : `${months} meses`;
    } else if (months === 0) {
      return years === 1 ? '1 ano' : `${years} anos`;
    } else {
      const yearText = years === 1 ? '1 ano' : `${years} anos`;
      const monthText = months === 1 ? '1 mês' : `${months} meses`;
      return `${yearText} e ${monthText}`;
    }
  } catch (error) {
    console.error('Error calculating platform time:', error);
    return 'Não informado';
  }
}
