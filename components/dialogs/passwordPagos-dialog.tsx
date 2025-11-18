'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, AlertCircle } from 'lucide-react';

interface PasswordProtectedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PasswordProtectedDialog({ isOpen, onClose, onSuccess }: PasswordProtectedDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const CORRECT_PASSWORD = 'artentoxkbrito';

  const handleSubmit = () => {
    setIsLoading(true);
    setError('');

    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        setPassword('');
        setError('');
        onSuccess();
        onClose();
      } else {
        setError('Contraseña incorrecta. Intente nuevamente.');
        setPassword('');
      }
      setIsLoading(false);
    }, 300);
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && password) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">Acceso Restringido</DialogTitle>
          <DialogDescription className="text-center">
            Esta sección requiere autenticación. Por favor, ingrese la contraseña.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingrese la contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !password}
          >
            {isLoading ? 'Verificando...' : 'Acceder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}