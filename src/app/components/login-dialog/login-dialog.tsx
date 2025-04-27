'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface LoginDialogProps {
  trigger: React.ReactNode;
}

export default function LoginDialog({ trigger }: LoginDialogProps) {
  return (
    <Dialog.Root>
      {/* ... a komponens többi része változatlan ... */}
    </Dialog.Root>
  );
} 