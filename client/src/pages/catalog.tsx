import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductCard } from '@/components/product-card';
import { useTranslation, type Language } from '@/lib/i18n';
import type { ProductWithCategory, Category } from '@shared/schema';

interface CatalogProps {
  language: Language;
}

export default function Catalog({ language }: CatalogProps) {
  const { t } = useTranslation(language);
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');

  // Get category from URL params
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryFromUrl = urlParams.get('category');

  const { data: products, isLoading: productsLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ['/api/products', { search: searchTerm }],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Filter by category from URL or selected categories
    if (categoryFromUrl) {
      const category = categories?.find(c => c.slug === categoryFromUrl);
      if (category) {
        filtered = filtered.filter(p => p.categoryId === category.id);
      }
    } else if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => 
        selectedCategories.includes(p.categoryId || '')
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(p => parseFloat(p.price) >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(p => parseFloat(p.price) <= parseFloat(priceRange.max));
    }

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [products, categories, categoryFromUrl, selectedCategories, searchTerm, priceRange, sortBy]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  return (
    <div className="py-16" data-testid="page-catalog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="bg-card p-6 rounded-xl" data-testid="card-filters">
              <h3 className="font-semibold mb-4">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
                  data-testid="input-search"
                />
              </div>

              {/* Categories */}
              {!categoryFromUrl && categories && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => 
                            handleCategoryChange(category.id, checked as boolean)
                          }
                          data-testid={`checkbox-category-${category.slug}`}
                        />
                        <label 
                          htmlFor={category.id} 
                          className="text-sm cursor-pointer"
                          data-testid={`label-category-${category.slug}`}
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range (₪)</h4>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-1/2"
                    data-testid="input-price-min"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-1/2"
                    data-testid="input-price-max"
                  />
                </div>
              </div>

              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategories([]);
                  setPriceRange({ min: '', max: '' });
                  setSortBy('name');
                }}
                variant="outline"
                className="w-full"
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted-foreground" data-testid="text-results-count">
                Showing {filteredProducts.length} products
              </span>
              <Select value={sortBy} onValueChange={setSortBy} data-testid="select-sort">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name" data-testid="option-sort-name">Sort by Name</SelectItem>
                  <SelectItem value="price-asc" data-testid="option-sort-price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc" data-testid="option-sort-price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Card key={i} className="bg-card rounded-xl overflow-hidden">
                    <div className="w-full h-48 bg-muted animate-pulse" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg" data-testid="text-no-products">
                  No products found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-products">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    language={language}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
