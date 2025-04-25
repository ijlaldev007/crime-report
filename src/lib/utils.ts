import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPasswordStrength(password: string): {
  score: number;
  color: string;
  message: string;
} {
  let score = 0;
  
  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const strengthMap = {
    0: { color: 'bg-destructive/50', message: 'Very Weak' },
    1: { color: 'bg-destructive', message: 'Weak' },
    2: { color: 'bg-yellow-500', message: 'Fair' },
    3: { color: 'bg-yellow-600', message: 'Good' },
    4: { color: 'bg-green-500', message: 'Strong' },
    5: { color: 'bg-green-600', message: 'Very Strong' },
    6: { color: 'bg-green-700', message: 'Excellent' }
  };

  return {
    score,
    ...strengthMap[score as keyof typeof strengthMap]
  };
}

