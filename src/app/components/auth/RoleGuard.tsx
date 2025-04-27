import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { isLoading, isAuthenticated, role, hasRole } = useAuth();

  console.log('RoleGuard ellenőrzés:', {
    isLoading,
    isAuthenticated,
    userRole: role,
    allowedRoles,
    hasAccess: allowedRoles.length === 0 || (role && allowedRoles.includes(role))
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Hozzáférés megtagadva! </strong>
        <span className="block sm:inline">Jelentkezz be a tartalom megtekintéséhez.</span>
      </div>
    );
  }

  if (role && allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Hozzáférés megtagadva! </strong>
      <span className="block sm:inline">Nincs megfelelő jogosultságod a tartalom megtekintéséhez.</span>
    </div>
  );
};

export default RoleGuard; 