'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Building2, Briefcase, CreditCard, LayoutDashboard } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/personal', label: 'Personal', icon: Users },
    { href: '/proveedores', label: 'Proveedores', icon: Building2 },
    { href: '/proyectos', label: 'Proyectos', icon: Briefcase },
    { href: '/pagos', label: 'Pagos', icon: CreditCard },
  ];

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold">Constructora</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  pathname === href
                    ? 'bg-primary-foreground text-primary'
                    : 'hover:bg-primary-foreground/20'
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
  );
}
