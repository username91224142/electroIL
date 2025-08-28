import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { ProductWithCategory, Category } from '@shared/schema';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  nameRu: z.string().optional(),
  nameHe: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  descriptionRu: z.string().optional(),
  descriptionHe: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  categoryId: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  imageUrl: z.string().optional(),
  stock: z.string().optional(),
  isActive: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminProducts() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products, isLoading: productsLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      nameRu: '',
      nameHe: '',
      description: '',
      descriptionRu: '',
      descriptionHe: '',
      price: '',
      categoryId: '',
      brand: '',
      imageUrl: '',
      stock: '',
      isActive: true,
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const productData = {
        ...data,
        price: data.price,
        stock: data.stock ? parseInt(data.stock) : undefined,
      };
      const response = await apiRequest('POST', '/api/products', productData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product Created',
        description: 'Product has been created successfully',
      });
      setIsFormOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast({
        title: 'Creation Failed',
        description: 'Failed to create product',
        variant: 'destructive',
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      const productData = {
        ...data,
        price: data.price,
        stock: data.stock ? parseInt(data.stock) : undefined,
      };
      const response = await apiRequest('PUT', `/api/products/${id}`, productData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product Updated',
        description: 'Product has been updated successfully',
      });
      setIsFormOpen(false);
      setEditingProduct(null);
      form.reset();
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/products/${id}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product Deleted',
        description: 'Product has been deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleEdit = (product: ProductWithCategory) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      nameRu: product.nameRu || '',
      nameHe: product.nameHe || '',
      description: product.description,
      descriptionRu: product.descriptionRu || '',
      descriptionHe: product.descriptionHe || '',
      price: product.price,
      categoryId: product.categoryId || '',
      brand: product.brand || '',
      imageUrl: product.imageUrl || '',
      stock: product.stock?.toString() || '',
      isActive: product.isActive ?? true,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (product: ProductWithCategory) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProductMutation.mutate(product.id);
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    form.reset();
    setIsFormOpen(true);
  };

  return (
    <div className="flex" data-testid="page-admin-products">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" data-testid="text-products-title">Products Management</h1>
          <Button onClick={handleAddNew} className="bg-primary text-primary-foreground" data-testid="button-add-product">
            <FaPlus className="mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Products Table */}
        <Card data-testid="card-products-table">
          <CardHeader>
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : !products || products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground" data-testid="text-no-products">No products found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Image</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Brand</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr key={product.id} data-testid={`row-product-${product.id}`}>
                        <td className="px-4 py-4">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                              data-testid={`img-product-${product.id}`}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">No Image</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 font-medium" data-testid={`text-product-name-${product.id}`}>
                          {product.name}
                        </td>
                        <td className="px-4 py-4 text-sm" data-testid={`text-product-category-${product.id}`}>
                          {product.category?.name || 'Uncategorized'}
                        </td>
                        <td className="px-4 py-4 text-sm" data-testid={`text-product-brand-${product.id}`}>
                          {product.brand || '-'}
                        </td>
                        <td className="px-4 py-4 font-medium" data-testid={`text-product-price-${product.id}`}>
                          ₪{parseFloat(product.price).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-sm" data-testid={`text-product-stock-${product.id}`}>
                          {product.stock ?? 'N/A'}
                        </td>
                        <td className="px-4 py-4">
                          <Badge 
                            variant={product.isActive ? 'default' : 'secondary'}
                            data-testid={`badge-product-status-${product.id}`}
                          >
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="text-primary hover:text-primary/80"
                              data-testid={`button-edit-product-${product.id}`}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product)}
                              className="text-destructive hover:text-destructive/80"
                              data-testid={`button-delete-product-${product.id}`}
                            >
                              <FaTrash />
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

        {/* Product Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="dialog-product-form">
            <DialogHeader>
              <DialogTitle data-testid="text-form-title">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Basic Information</h4>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name (EN) *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-product-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nameRu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name (RU)</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-product-name-ru" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nameHe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name (HE)</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-product-name-he" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-product-brand" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Product Details</h4>
                    
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} data-testid="select-product-category">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.id} data-testid={`option-category-${category.slug}`}>
                                  {category.name}
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
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₪) *</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" data-testid="input-product-price" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Quantity</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" data-testid="input-product-stock" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-product-image" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Descriptions</h4>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (EN) *</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} data-testid="textarea-product-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descriptionRu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (RU)</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} data-testid="textarea-product-description-ru" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descriptionHe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (HE)</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} data-testid="textarea-product-description-he" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                    data-testid="button-cancel-form"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createProductMutation.isPending || updateProductMutation.isPending}
                    className="bg-primary text-primary-foreground"
                    data-testid="button-save-product"
                  >
                    {createProductMutation.isPending || updateProductMutation.isPending
                      ? 'Saving...'
                      : editingProduct
                      ? 'Update Product'
                      : 'Create Product'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
