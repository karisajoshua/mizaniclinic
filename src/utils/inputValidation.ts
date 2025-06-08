
// Utility functions for input validation and sanitization

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{7,}$/;
  return phoneRegex.test(phone.trim());
};

export const validateAmbassadorId = (ambassadorId: string): boolean => {
  const ambassadorIdRegex = /^MCA25-[A-Z0-9]+$/;
  return ambassadorIdRegex.test(ambassadorId.trim());
};

export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long' };
  }
  
  return { isValid: true };
};

export const validateName = (name: string): { isValid: boolean; message?: string } => {
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  
  if (trimmedName.length > 100) {
    return { isValid: false, message: 'Name is too long' };
  }
  
  // Basic name validation - only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true };
};
