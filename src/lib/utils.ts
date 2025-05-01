
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function getColorClass(colorGrade: string): string {
  // Higher colors (D-F) get blue tones, mid-range (G-J) get neutral, lower get yellow tones
  switch(colorGrade) {
    case 'D':
    case 'E':
    case 'F':
      return 'text-blue-600 bg-blue-50';
    case 'G':
    case 'H':
    case 'I':
    case 'J':
      return 'text-gray-700 bg-gray-50';
    default:
      return 'text-yellow-600 bg-yellow-50';
  }
}

export function getClarityClass(clarityGrade: string): string {
  // Higher clarity grades get green tones
  if (['FL', 'IF', 'VVS1', 'VVS2'].includes(clarityGrade)) {
    return 'text-green-600 bg-green-50';
  } else if (['VS1', 'VS2', 'SI1'].includes(clarityGrade)) {
    return 'text-blue-600 bg-blue-50';
  } else {
    return 'text-orange-600 bg-orange-50';
  }
}

export function getCutClass(cutGrade: string): string {
  switch(cutGrade) {
    case 'Excellent':
      return 'text-purple-600 bg-purple-50';
    case 'Very Good':
      return 'text-blue-600 bg-blue-50';
    case 'Good':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-orange-600 bg-orange-50';
  }
}

export function getStatusClass(status: string): string {
  switch(status) {
    case 'Available':
      return 'bg-green-100 text-green-800';
    case 'Reserved':
      return 'bg-blue-100 text-blue-800';
    case 'Sold':
      return 'bg-purple-100 text-purple-800';
    case 'On Memo':
      return 'bg-yellow-100 text-yellow-800';
    case 'Returned':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
