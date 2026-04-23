'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { TOOLS } from '@/lib/constants';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/dashboard/history', label: 'History', icon: '📋' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r flex flex-col bg-background fixed left-0 top-0">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🔁</span>
          <span className="font-bold text-lg">RepurposeAI</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1 mb-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Tools
          </p>
          <div className="space-y-1">
            {TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={`/dashboard/tools/${tool.id}`}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                  pathname === `/dashboard/tools/${tool.id}`
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  tool.locked && 'opacity-60'
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{tool.icon}</span>
                  {tool.name}
                </span>
                {tool.locked && <span className="text-xs">🔒</span>}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={() => {
            localStorage.removeItem('userId');
            window.location.href = '/login';
          }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors"
        >
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
