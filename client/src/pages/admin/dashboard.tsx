import { useQuery } from '@tanstack/react-query';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaShoppingBag, FaDollarSign, FaBox, FaClock } from 'react-icons/fa';

interface AdminStats {
  total: number;
  pending: number;
  revenue: string;
  products: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
  });

  return (
    <div className="flex" data-testid="page-admin-dashboard">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="text-dashboard-title">Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-stat-orders">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <FaShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-orders">
                {isLoading ? '...' : stats?.total || 0}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-revenue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <FaDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-revenue">
                {isLoading ? '...' : `₪${parseFloat(stats?.revenue || '0').toFixed(2)}`}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-products">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <FaBox className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-products">
                {isLoading ? '...' : stats?.products || 0}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-pending">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <FaClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary" data-testid="text-pending-orders">
                {isLoading ? '...' : stats?.pending || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card data-testid="card-quick-actions">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Use the sidebar to navigate to different sections:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• View and manage orders</li>
                <li>• Add, edit, or remove products</li>
                <li>• Track customer information</li>
                <li>• Configure system settings</li>
              </ul>
            </CardContent>
          </Card>

          <Card data-testid="card-system-info">
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Telegram Integration:</span> Active</p>
                <p><span className="font-medium">Payment Method:</span> Cash on Delivery</p>
                <p><span className="font-medium">Status:</span> Operational</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
