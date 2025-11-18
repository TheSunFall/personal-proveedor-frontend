'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Users, Building2, Briefcase, CreditCard, LayoutDashboard } from 'lucide-react';
import PasswordProtectedDialog from '@/components/dialogs/passwordPagos-dialog';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, protected: false },
    { href: '/personal', label: 'Personal', icon: Users, protected: false },
    { href: '/proveedores', label: 'Proveedores', icon: Building2, protected: false },
    { href: '/proyectos', label: 'Proyectos', icon: Briefcase, protected: false },
    { href: '/pagos', label: 'Pagos', icon: CreditCard, protected: true },
  ];

  const handleLinkClick = (e: React.MouseEvent, href: string, isProtected: boolean) => {
    if (isProtected) {
      e.preventDefault();
      setShowPasswordDialog(true);
    }
  };

  const handlePasswordSuccess = () => {
    router.push('/pagos');
  };

  return (
    <>
      <nav className="h-100vh flex flex-col bg-sidebar text-foreground shadow-lg border-r border-muted">
        <div className="mx-auto px-8 py-4">
          <div className="flex flex-col items-between justify-start">
            <div className="flex flex-col items-center gap-2 py-6">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold">Constructora</span>
            </div>
            <div className="hidden md:flex flex-col justify-start gap-4">
              {links.map(({ href, label, icon: Icon, protected: isProtected }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={(e) => handleLinkClick(e, href, isProtected)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    pathname === href
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-foreground/15'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <PasswordProtectedDialog
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSuccess={handlePasswordSuccess}
      />
    </>
  );
}