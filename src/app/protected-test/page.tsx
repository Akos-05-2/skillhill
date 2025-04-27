'use client';

import { useAuth } from "@/hooks/useAuth";
import RoleGuard from "@/app/components/auth/RoleGuard";
import { useEffect, useState } from "react";

export default function ProtectedTestPage() {
  const { isLoading, isAuthenticated, role, user, hasRole } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Beállítjuk az aktuális időt minden 1 másodpercben
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Szerepkör alapú hozzáférés tesztoldal</h1>
          </div>
          
          <div className="px-6 py-4">
            <p className="text-gray-600 mb-4">Ez az oldal bemutatja, hogyan működik a szerepkör alapú hozzáférés vezérlés.</p>
            
            <div className="mb-6 p-4 bg-gray-100 rounded-md">
              <h2 className="text-lg font-semibold mb-2">Felhasználói adatok:</h2>
              {isAuthenticated ? (
                <div>
                  <p><span className="font-semibold">Név:</span> {user?.name}</p>
                  <p><span className="font-semibold">Email:</span> {user?.email}</p>
                  <p><span className="font-semibold">Szerepkör:</span> {role}</p>
                  <p><span className="font-semibold">Idő:</span> {currentTime}</p>
                </div>
              ) : (
                <p className="text-red-500">Nem vagy bejelentkezve! Egyes tartalmak nem lesznek elérhetőek számodra.</p>
              )}
            </div>

            {/* Alap tartalom - mindenki láthatja */}
            <div className="mb-6 p-4 bg-green-100 rounded-md">
              <h2 className="text-lg font-semibold mb-2">Nyilvános tartalom</h2>
              <p>Ezt a tartalmat <strong>mindenki</strong> láthatja, bejelentkezés nélkül is.</p>
            </div>

            {/* Bejelentkezett felhasználóknak */}
            <RoleGuard allowedRoles={['user', 'teacher', 'admin']}>
              <div className="mb-6 p-4 bg-blue-100 rounded-md">
                <h2 className="text-lg font-semibold mb-2">Bejelentkezett felhasználói tartalom</h2>
                <p>Ezt a tartalmat csak <strong>bejelentkezett felhasználók</strong> láthatják (bármilyen szerepkörrel).</p>
              </div>
            </RoleGuard>

            {/* Tanári tartalom */}
            <RoleGuard allowedRoles={['teacher', 'admin']}>
              <div className="mb-6 p-4 bg-yellow-100 rounded-md">
                <h2 className="text-lg font-semibold mb-2">Tanári tartalom</h2>
                <p>Ezt a tartalmat csak <strong>tanárok és adminisztrátorok</strong> láthatják.</p>
              </div>
            </RoleGuard>

            {/* Admin tartalom */}
            <RoleGuard allowedRoles={['admin', 'super_admin']}>
              <div className="mb-6 p-4 bg-red-100 rounded-md">
                <h2 className="text-lg font-semibold mb-2">Admin tartalom</h2>
                <p>Ezt a tartalmat <strong>kizárólag adminisztrátorok</strong> láthatják.</p>
                <p>Titkos admin információ: XYZ123</p>
              </div>
            </RoleGuard>

            {/* Feltételes megjelenítés JavaScript-tel */}
            <div className="mb-6 p-4 bg-purple-100 rounded-md">
              <h2 className="text-lg font-semibold mb-2">Feltételes megjelenítés</h2>
              <p>Ez a rész mindenki számára látható, de a tartalom változik a szerepkör alapján:</p>
              
              <div className="mt-2 pl-4 border-l-4 border-purple-300">
                {!isAuthenticated && (
                  <p>Vendég felhasználóként látod ezt a szöveget.</p>
                )}
                
                {isAuthenticated && hasRole('user') && !hasRole('teacher') && !hasRole('admin') && !hasRole('super_admin') && (
                  <p>Sima felhasználóként látod ezt a szöveget.</p>
                )}
                
                {hasRole('teacher') && !hasRole('admin') && !hasRole('super_admin') && (
                  <p>Tanárként látod ezt a szöveget. Oktathatsz új kurzusokat!</p>
                )}
                
                {hasRole('admin') && !hasRole('super_admin') && (
                  <p>Adminisztrátorként látod ezt a szöveget. Teljes hozzáférésed van a rendszerhez!</p>
                )}
                
                {hasRole('super_admin') && (
                  <p>Szuper adminisztrátorként látod ezt a szöveget. Korlátlan hozzáférésed van az összes funkcióhoz!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 