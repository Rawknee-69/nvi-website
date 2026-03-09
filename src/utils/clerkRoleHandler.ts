import { User } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';

/**
 * Sets the user role in Clerk public metadata
 * This should be called after user signs up to set their role
 * Note: This requires backend API to update user metadata via Clerk Backend API
 */
export const setUserRole = async (role: 'owner' | 'student', getToken?: () => Promise<string | null>) => {
  try {
    // Get the session token from Clerk
    let token: string | null = null;
    if (getToken) {
      token = await getToken();
    }

    if (!token) {
      throw new Error('No session token available');
    }

    // This will be handled by backend API
    // Frontend cannot directly update user metadata for security reasons
    // The backend should verify the user's session token
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/users/set-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to set user role' }));
      throw new Error(errorData.message || errorData.error || 'Failed to set user role');
    }

    return await response.json();
  } catch (error) {
    console.error('Error setting user role:', error);
    throw error;
  }
};

/**
 * Gets the user role from Clerk public metadata
 */
export const getUserRole = (user: User | null | undefined): 'owner' | 'student' | null => {
  if (!user) return null;
  return (user.publicMetadata?.role as 'owner' | 'student') || null;
};

/**
 * Checks if user is an owner
 */
export const isOwner = (user: User | null | undefined): boolean => {
  return getUserRole(user) === 'owner';
};

