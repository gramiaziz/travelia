'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Globe, LayoutDashboard, MapPin, Package, ClipboardList,
  MessageSquare, Menu, X, LogOut, ChevronRight, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const navItems = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/destinations', label: 'Destinations', icon: MapPin },
  { href: '/admin/offres', label: 'Offres', icon: Package },
  { href: '/admin/reservations', label: 'Réservations', icon: ClipboardList },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin';

  useEffect(() => {
    if (isLoginPage) return;

    let active = true;

    async function validateSession() {
      const { data, error } = await supabase.auth.getUser();
      const user = data.user;

      if (!active) return;

      if (error || !user) {
        setIsAuthenticated(false);
        router.replace('/admin');
        return;
      }

      setUserEmail(user.email ?? 'Administrateur');
      setIsAuthenticated(true);
    }

    void validateSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setIsAuthenticated(false);
        setUserEmail('');
        router.replace('/admin');
        return;
      }

      setUserEmail(session.user.email ?? 'Administrateur');
      setIsAuthenticated(true);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    setIsAuthenticated(false);
    await supabase.auth.signOut();
    router.replace('/admin');
    router.refresh();
  };

  if (isLoginPage) return <>{children}</>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Vérification de la session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Travelia Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
          >
            <Globe className="w-5 h-5" />
            Voir le site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-900/40 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen((current) => !current)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Ouvrir le menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {userEmail || 'Administrateur'}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
