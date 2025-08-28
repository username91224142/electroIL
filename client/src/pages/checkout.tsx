import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FaMoneyBillWave } from 'react-icons/fa';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useTranslation, type Language } from '@/lib/i18n';
import { apiRequest } from '@/lib/queryClient';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(10, 'Full address is required'),
  notes: z.string().optional(),
  terms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutProps {
  language: Language;
}

const israelCities = [
  { value: 'tel-aviv', label: 'Tel Aviv' },
  { value: 'jerusalem', label: 'Jerusalem' },
  { value: 'haifa', label: 'Haifa' },
  { value: 'beer-sheva', label: 'Beer Sheva' },
  { value: 'rishon-lezion', label: 'Rishon LeZion' },
  { value: 'ashdod', label: 'Ashdod' },
  { value: 'netanya', label: 'Netanya' },
  { value: 'holon', label: 'Holon' },
  { value: 'bnei-brak', label: 'Bnei Brak' },
  { value: 'rehovot', label: 'Rehovot' },
];

export default function Checkout({ language }: CheckoutProps) {
  const { t } = useTranslation(language);
  const [, setLocation] = useLocation();
  const { items, clearCart, getTotalPrice } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      city: '',
      address: '',
      notes: '',
      terms: false,
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      const subtotal = getTotalPrice();
      const deliveryFee = 25;
      const total = subtotal + deliveryFee;

      const orderData = {
        order: {
          customerName: `${data.firstName} ${data.lastName}`,
          customerPhone: data.phone,
          customerCity: data.city,
          customerAddress: data.address,
          notes: data.notes || '',
          status: 'pending',
          totalAmount: total.toFixed(2),
        },
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      const response = await apiRequest('POST', '/api/orders', orderData);
      return response.json();
    },
    onSuccess: (order) => {
      clearCart();
      toast({
        title: 'Order Placed Successfully!',
        description: `Order #${order.id.slice(0, 8)} has been created. Our manager will contact you via Telegram.`,
      });
      setLocation('/');
    },
    onError: (error) => {
      console.error('Order creation error:', error);
      toast({
        title: 'Order Failed',
        description: 'There was an error creating your order. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: CheckoutFormData) => {
    createOrderMutation.mutate(data);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16" data-testid="page-checkout-empty">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">{t('checkout')}</h2>
            <p className="text-muted-foreground mb-8">Your cart is empty</p>
            <Button onClick={() => setLocation('/catalog')} className="bg-primary text-primary-foreground px-8 py-3 font-semibold" data-testid="button-back-to-catalog">
              Back to Catalog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const deliveryFee = 25;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-background py-16" data-testid="page-checkout">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8" data-testid="text-checkout-title">{t('checkout')}</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <Card className="bg-card p-6 rounded-xl" data-testid="card-checkout-form">
                  <CardContent className="p-0">
                    <h3 className="font-semibold mb-6">{t('deliveryInfo')}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel data-testid="label-first-name">{t('firstName')} *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-first-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel data-testid="label-last-name">{t('lastName')} *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-last-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel data-testid="label-phone">{t('phone')} *</FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" placeholder="+972..." data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel data-testid="label-city">{t('city')} *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} data-testid="select-city">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select city..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {israelCities.map((city) => (
                                <SelectItem key={city.value} value={city.value} data-testid={`option-city-${city.value}`}>
                                  {city.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel data-testid="label-address">{t('address')} *</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              placeholder="Street address, apartment number, etc."
                              data-testid="textarea-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel data-testid="label-notes">{t('notes')}</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={2}
                              placeholder="Special delivery instructions..."
                              data-testid="textarea-notes"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-terms"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm cursor-pointer" data-testid="label-terms">
                              {t('terms')} *
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-card p-6 rounded-xl sticky top-24" data-testid="card-order-summary">
                  <CardContent className="p-0">
                    <h3 className="font-semibold mb-4">Order Summary</h3>
                    
                    {/* Order Items */}
                    <div className="space-y-2 mb-4 border-b border-border pb-4" data-testid="section-order-items">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <span data-testid={`text-order-item-${item.product.id}`}>
                            {item.product.name} x{item.quantity}
                          </span>
                          <span data-testid={`text-order-item-price-${item.product.id}`}>
                            ₪{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span data-testid="text-checkout-subtotal-label">{t('subtotal')}</span>
                        <span data-testid="text-checkout-subtotal-amount">₪{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span data-testid="text-checkout-delivery-label">{t('delivery')}</span>
                        <span data-testid="text-checkout-delivery-amount">₪{deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between font-semibold text-lg">
                          <span data-testid="text-checkout-total-label">{t('total')}</span>
                          <span className="text-primary" data-testid="text-checkout-total-amount">₪{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Card className="bg-primary/10 p-4 rounded-lg mb-6" data-testid="card-payment-method">
                      <CardContent className="p-0">
                        <h4 className="font-medium text-primary mb-2">Cash Payment</h4>
                        <p className="text-sm text-muted-foreground">
                          Pay cash upon delivery. Our manager will contact you via Telegram to confirm your order.
                        </p>
                      </CardContent>
                    </Card>

                    <Button
                      type="submit"
                      disabled={createOrderMutation.isPending}
                      className="w-full bg-primary text-primary-foreground py-3 font-semibold hover:opacity-90 transition-opacity"
                      data-testid="button-place-order"
                    >
                      {createOrderMutation.isPending ? 'Placing Order...' : t('placeOrder')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
