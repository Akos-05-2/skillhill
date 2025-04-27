'use client';

import { useSession } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

export default function RoleDebugPage() {
  const { data: session } = useSession();
  const { isLoading, isAuthenticated, role, hasRole, user } = useAuth();
  const [serverRole, setServerRole] = useState<string | null>(null);
  const [isLoadingServer, setIsLoadingServer] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Szerveroldali szerep ellenőrzés
  useEffect(() => {
    const checkServerRole = async () => {
      try {
        setIsLoadingServer(true);
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const data = await response.json();
          setServerRole(data.role?.role_name || null);
        } else {
          setError(`API hiba: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        setError(`Kivétel: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoadingServer(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      checkServerRole();
    }
  }, [isAuthenticated, isLoading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Szerepkör Diagnosztika</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Munkamenet Információk</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-80">
          {JSON.stringify({
            session: {
              status: session ? 'authenticated' : 'unauthenticated',
              user: session?.user || null,
            }
          }, null, 2)}
        </pre>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">useAuth Hook Állapot</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-80">
          {JSON.stringify({
            isLoading,
            isAuthenticated,
            role,
            hasAdminRole: hasRole('admin'),
            hasSuperAdminRole: hasRole('super_admin'),
            hasTeacherRole: hasRole('teacher'),
            hasUserRole: hasRole('user'),
            user
          }, null, 2)}
        </pre>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Szerveroldali Szerepkör</h2>
        {isLoadingServer ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Szerveroldali szerepkör:</strong> {serverRole || 'Nem elérhető'}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex space-x-4">
        <a 
          href="/admin" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Admin oldal megtekintése
        </a>
        <a 
          href="/teacher" 
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Tanár oldal megtekintése
        </a>
        <a 
          href="/student" 
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          Diák oldal megtekintése
        </a>
      </div>
    </div>
  );
} 