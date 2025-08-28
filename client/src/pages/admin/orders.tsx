import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FaEye, FaEdit, FaDownload } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { OrderWithItems } from '@shared/schema';

const statusColors = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const statusLabels = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ['/api/orders'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await apiRequest('PATCH', `/api/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'Order Updated',
        description: 'Order status has been updated successfully',
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const viewOrderDetails = (order: OrderWithItems) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const exportOrders = () => {
    if (!orders) return;
    
    const csvContent = [
      ['Order ID', 'Customer', 'Phone', 'City', 'Total', 'Status', 'Date'].join(','),
      ...orders.map(order => [
        order.id.slice(0, 8),
        order.customerName,
        order.customerPhone,
        order.customerCity,
        `₪${order.totalAmount}`,
        order.status,
        order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex" data-testid="page-admin-orders">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" data-testid="text-orders-title">Orders Management</h1>
          <Button onClick={exportOrders} className="bg-primary text-primary-foreground" data-testid="button-export-orders">
            <FaDownload className="mr-2" />
            Export Orders
          </Button>
        </div>

        {/* Orders Table */}
        <Card data-testid="card-orders-table">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : !orders || orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground" data-testid="text-no-orders">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">City</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Items</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order) => (
                      <tr key={order.id} data-testid={`row-order-${order.id}`}>
                        <td className="px-4 py-4 text-sm font-mono" data-testid={`text-order-id-${order.id}`}>
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-4 text-sm" data-testid={`text-customer-name-${order.id}`}>
                          {order.customerName}
                        </td>
                        <td className="px-4 py-4 text-sm" data-testid={`text-customer-phone-${order.id}`}>
                          {order.customerPhone}
                        </td>
                        <td className="px-4 py-4 text-sm" data-testid={`text-customer-city-${order.id}`}>
                          {order.customerCity}
                        </td>
                        <td className="px-4 py-4 text-sm" data-testid={`text-items-count-${order.id}`}>
                          {order.items.length} items
                        </td>
                        <td className="px-4 py-4 text-sm font-medium" data-testid={`text-order-total-${order.id}`}>
                          ₪{parseFloat(order.totalAmount).toFixed(2)}
                        </td>
                        <td className="px-4 py-4">
                          <Select
                            value={order.status}
                            onValueChange={(status) => handleStatusChange(order.id, status)}
                            data-testid={`select-status-${order.id}`}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue>
                                <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                                  {statusLabels[order.status as keyof typeof statusLabels]}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value} data-testid={`option-status-${value}`}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground" data-testid={`text-order-date-${order.id}`}>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewOrderDetails(order)}
                              className="text-primary hover:text-primary/80"
                              data-testid={`button-view-order-${order.id}`}
                            >
                              <FaEye />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl" data-testid="dialog-order-details">
            <DialogHeader>
              <DialogTitle data-testid="text-dialog-title">
                Order Details #{selectedOrder?.id.slice(0, 8)}
              </DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6" data-testid="section-order-details">
                {/* Customer Information */}
                <div>
                  <h4 className="font-semibold mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>
                      <p data-testid="text-detail-customer-name">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p data-testid="text-detail-customer-phone">{selectedOrder.customerPhone}</p>
                    </div>
                    <div>
                      <span className="font-medium">City:</span>
                      <p data-testid="text-detail-customer-city">{selectedOrder.customerCity}</p>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge className={statusColors[selectedOrder.status as keyof typeof statusColors]} data-testid="badge-detail-status">
                        {statusLabels[selectedOrder.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="font-medium">Address:</span>
                    <p className="text-sm" data-testid="text-detail-address">{selectedOrder.customerAddress}</p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="mt-4">
                      <span className="font-medium">Notes:</span>
                      <p className="text-sm" data-testid="text-detail-notes">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-2" data-testid="section-order-items">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded" data-testid={`item-detail-${index}`}>
                        <div>
                          <p className="font-medium" data-testid={`text-item-name-${index}`}>{item.product.name}</p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-item-quantity-${index}`}>
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium" data-testid={`text-item-price-${index}`}>
                            ₪{(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ₪{parseFloat(item.price).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-lg font-bold text-primary" data-testid="text-detail-total">
                      ₪{parseFloat(selectedOrder.totalAmount).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2" data-testid="text-detail-date">
                    Ordered on: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}
                  </p>
                  {selectedOrder.telegramSent && (
                    <p className="text-sm text-green-500 mt-1">
                      ✓ Telegram notification sent
                    </p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
