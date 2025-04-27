import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';

interface UseAuthReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  isAuthorized: (roles: string[]) => boolean;
  user: any;
  role: string | null;
  hasRole: (role: string) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'loading') return;
      
      if (!session) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setRole(userData.role?.role_name || null);
        }
      } catch (error) {
        console.error('Hiba a felhasználói adatok betöltése közben:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, status]);

  const hasRole = useCallback((requiredRole: string) => {
    if (!role) return false;
    
    const roleHierarchy: Record<string, string[]> = {
      'super_admin': ['admin', 'teacher', 'user'],
      'admin': ['teacher', 'user'],
      'teacher': ['user'],
      'user': []
    };
    
    return role === requiredRole || 
           (roleHierarchy[role] && roleHierarchy[role].includes(requiredRole));
  }, [role]);

  const isAuthorized = useCallback((roles: string[]) => {
    if (!role) return false;
    return roles.some(requiredRole => hasRole(requiredRole));
  }, [role, hasRole]);

  return {
    isLoading,
    isAuthenticated: !!session,
    isAuthorized,
    user,
    role,
    hasRole
  };
};

export default useAuth; 