'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import './style.css';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  roleId: number;
  image: string | null;
}

interface UserEditDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const roleEmojis = {
  2: '👨‍🎓',
  3: '👨‍🏫',
  4: '👨‍💼',
  5: '👑'
} as const;

const roleNames = {
  2: 'Tanuló',
  3: 'Tanár',
  4: 'Admin',
  5: 'Szuperadmin'
} as const;

export function UserEditDialog({ user, open, onOpenChange, onSave }: UserEditDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string>('2');
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = useSession();
  const currentUserRoleId = session?.user?.roleId || 2;

  useEffect(() => {
    if (user) {
      setSelectedRole(user.roleId.toString());
    }
  }, [user]);

  // Ellenőrizzük, hogy az aktuális felhasználó módosíthatja-e a kiválasztott felhasználó szerepkörét
  const canEditRole = () => {
    if (!user || !session?.user) return false;

    // Admin saját magát nem módosíthatja
    if (session.user.id === user.id) return false;

    // Szuperadmin mindent módosíthat
    if (currentUserRoleId === 5) return true;

    // Admin csak alacsonyabb jogosultságú felhasználókat módosíthat
    if (currentUserRoleId === 4) {
      // Admin nem módosíthat másik admint vagy szuperadmint
      if (user.roleId >= 4) return false;
      // Admin nem adhat admin vagy szuperadmin jogot
      if (parseInt(selectedRole) >= 4) return false;
      return true;
    }

    return false;
  };

  // Elérhető szerepkörök a felhasználó jogosultsága alapján
  const getAvailableRoles = () => {
    if (currentUserRoleId === 5) {
      return Object.entries(roleNames);
    }
    if (currentUserRoleId === 4) {
      return Object.entries(roleNames).filter(([id]) => parseInt(id) < 4);
    }
    return [];
  };

  const handleSave = async () => {
    if (!user || !canEditRole()) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          roleId: parseInt(selectedRole),
        }),
      });

      if (!response.ok) throw new Error('Failed to update user role');
      
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const availableRoles = getAvailableRoles();
  const isEditable = canEditRole();

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="dialog-root">
      <DialogOverlay className="dialog-overlay" />
      <DialogContent className="user-edit-dialog">
        <div className="dialog-content">
          <DialogHeader className="dialog-header">
            <DialogTitle className="dialog-title">
              <span className="dialog-emoji">👤</span>
              Felhasználó Szerkesztése
            </DialogTitle>
          </DialogHeader>
          
          <div className="user-info">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar-placeholder">
                👤
              </div>
            )}
            <div className="user-details">
              <div className="user-name">{user.name || 'Névtelen felhasználó'}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>

          <div className="role-select">
            <label htmlFor="role" className="text-sm font-medium flex items-center gap-2 mb-2">
              <span className="dialog-emoji">🎭</span>
              Szerepkör
            </label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
              disabled={!isEditable}
            >
              <SelectTrigger className="select-trigger">
                <SelectValue>
                  <span className="role-select-item">
                    <span className="emoji">{roleEmojis[selectedRole as keyof typeof roleEmojis]}</span>
                    {roleNames[selectedRole as keyof typeof roleNames]}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="select-content" position="popper" sideOffset={5} portal>
                {availableRoles.map(([id, name]) => (
                  <SelectItem key={id} value={id} className="select-item">
                    <span className="role-select-item">
                      <span className="emoji">{roleEmojis[id as keyof typeof roleEmojis]}</span>
                      {name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isEditable && (
              <div className="text-sm text-red-500 mt-2">
                {session?.user?.id === user.id 
                  ? "Nem módosíthatod a saját szerepkörödet"
                  : "Nincs jogosultságod módosítani ezt a felhasználót"}
              </div>
            )}
          </div>

          <div className="button-container">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2"
            >
              <span className="emoji">❌</span>
              Mégse
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !isEditable}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="emoji animate-spin">⌛</span>
                  Mentés...
                </>
              ) : (
                <>
                  <span className="emoji">💾</span>
                  Mentés
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
