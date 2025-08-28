import { Link, useLocation } from 'wouter';
import { FaChartBar, FaShoppingBag, FaBox, FaUsers, FaCog } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: FaChartBar },
  { name: 'Orders', href: '/admin/orders', icon: FaShoppingBag },
  { name: 'Products', href: '/admin/products', icon: FaBox },
  { name: 'Customers', href: '/admin/customers', icon: FaUsers },
  { name: 'Settings', href: '/admin/settings', icon: FaCog },
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 admin-sidebar h-screen sticky top-0" data-testid="sidebar-admin">
      <div className="p-6">
        <div className="text-xl font-bold text-primary mb-8" data-testid="text-admin-title">
          Admin Panel
        </div>
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== '/admin' && location.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent text-foreground"
                  )}
                  data-testid={`link-admin-${item.name.toLowerCase()}`}
                >
                  <Icon />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
