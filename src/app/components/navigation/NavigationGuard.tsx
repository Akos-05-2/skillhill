'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface NavigationLink {
  href: string;
  label: string;
  allowedRoles: string[];
}

interface NavigationGuardProps {
  links: NavigationLink[];
  linkClassName?: string;
  activeLinkClassName?: string;
}

export default function NavigationGuard({
  links,
  linkClassName = '',
  activeLinkClassName = 'active'
}: NavigationGuardProps) {
  const { isAuthenticated, role } = useAuth();
  const pathname = usePathname();
  
  
  useEffect(() => {
    console.log('NavigationGuard szerepkör:', role);
  }, [role]);

  // Szűrjük a linkeket a felhasználó jogosultságai alapján
  const filteredLinks = links.filter(link => {
    // Ha a link bárki számára megengedett (üres szerepkör tömb)
    if (link.allowedRoles.length === 0) return true;
    
    // Ha bejelentkezést igényel, de a felhasználó nincs bejelentkezve
    if (!isAuthenticated || !role) return false;
    
    // Admin és super_admin felhasználók csak az admin felületet láthatják
    if (role === 'admin' || role === 'super_admin') {
      return link.href === '/admin';
    }
    
    // Teacher felhasználók csak a tanári felületet láthatják
    if (role === 'teacher') {
      return link.href === '/teacher';
    }
    
    // User csak a user menüpontokat láthatja
    if (role === 'user') {
      return link.href === '/courses' || 
             link.href === '/my-courses' || 
             link.href === '/about';
    }
    
    return false;
  });

  return (
    <>
      {filteredLinks.map((link, index) => (
        <Link 
          key={index}
          href={link.href} 
          className={`${linkClassName} ${pathname === link.href ? activeLinkClassName : ''}`}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
} 