import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaTelegramPlane, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useTranslation, type Language } from '@/lib/i18n';
import type { ProductWithCategory } from '@shared/schema';

interface ProductProps {
  id: string;
  language: Language;
}

export default function Product({ id, language }: ProductProps) {
  const { t } = useTranslation(language);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<ProductWithCategory>({
    queryKey: ['/api/products', id],
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock !== null && product.stock !== undefined && product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${getLocalizedName()} has been added to your cart`,
    });
  };

  const getLocalizedName = () => {
    if (!product) return '';
    switch (language) {
      case 'ru':
        return product.nameRu || product.name;
      case 'he':
        return product.nameHe || product.name;
      default:
        return product.name;
    }
  };

  const getLocalizedDescription = () => {
    if (!product) return '';
    switch (language) {
      case 'ru':
        return product.descriptionRu || product.description;
      case 'he':
        return product.descriptionHe || product.description;
      default:
        return product.description;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-16" data-testid="page-product-loading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="w-full h-96 bg-muted rounded-xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
              <div className="h-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background py-16" data-testid="page-product-error">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/catalog">
              <Button className="bg-primary text-primary-foreground" data-testid="button-back-to-catalog">
                <FaArrowLeft className="mr-2" />
                Back to Catalog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock !== null && product.stock !== undefined && product.stock <= 0;

  return (
    <div className="min-h-screen bg-background py-16" data-testid="page-product">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8" data-testid="breadcrumb">
          <Link href="/" className="hover:text-foreground transition-colors" data-testid="link-home">
            Home
          </Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-foreground transition-colors" data-testid="link-catalog">
            Catalog
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link 
                href={`/catalog?category=${product.category.slug}`} 
                className="hover:text-foreground transition-colors"
                data-testid={`link-category-${product.category.slug}`}
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground" data-testid="text-current-product">
            {getLocalizedName()}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={getLocalizedName()}
                  className="w-full h-96 object-cover rounded-xl"
                  data-testid="img-product-main"
                />
              ) : (
                <div className="w-full h-96 bg-muted rounded-xl flex items-center justify-center">
                  <span className="text-muted-foreground text-lg" data-testid="placeholder-no-image">
                    No Image Available
                  </span>
                </div>
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2" data-testid="badge-out-of-stock">
                    {t('outOfStock')}
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Additional Images */}
            {product.imageUrls && product.imageUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-2" data-testid="gallery-additional-images">
                {product.imageUrls.slice(0, 4).map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`${getLocalizedName()} ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    data-testid={`img-product-additional-${index}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="text-product-title">
                {getLocalizedName()}
              </h1>
              {product.brand && (
                <p className="text-muted-foreground" data-testid="text-product-brand">
                  by {product.brand}
                </p>
              )}
              {product.category && (
                <Badge variant="outline" className="mt-2" data-testid="badge-product-category">
                  {product.category.name}
                </Badge>
              )}
            </div>

            <div className="text-4xl font-bold text-primary" data-testid="text-product-price">
              ₪{parseFloat(product.price).toFixed(2)}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-product-description">
                {getLocalizedDescription()}
              </p>
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div className="flex items-center space-x-2">
                <span className="font-medium">Stock:</span>
                <span 
                  className={`${isOutOfStock ? 'text-destructive' : 'text-green-500'}`}
                  data-testid="text-stock-status"
                >
                  {isOutOfStock ? 'Out of Stock' : `${product.stock} available`}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-primary text-primary-foreground py-3 text-lg font-semibold hover:opacity-90 transition-opacity"
                data-testid="button-add-to-cart"
              >
                <FaShoppingCart className="mr-2" />
                {t('addToCart')}
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Link href="/cart">
                  <Button variant="outline" className="w-full" data-testid="button-view-cart">
                    View Cart
                  </Button>
                </Link>
                <a href="https://t.me/Dark090111" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full" data-testid="button-contact-telegram">
                    <FaTelegramPlane className="mr-2" />
                    Contact Manager
                  </Button>
                </a>
              </div>
            </div>

            {/* Payment Info */}
            <Card className="bg-primary/10 border border-primary/20" data-testid="card-payment-info">
              <CardContent className="p-4">
                <h4 className="font-medium text-primary mb-2">Payment & Delivery</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Cash payment on delivery</li>
                  <li>• Free delivery across Israel</li>
                  <li>• Manager confirmation via Telegram</li>
                  <li>• 18+ age verification required</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back to Catalog */}
        <div className="mt-12 text-center">
          <Link href="/catalog">
            <Button variant="outline" className="px-8 py-3" data-testid="button-back-to-catalog-bottom">
              <FaArrowLeft className="mr-2" />
              Back to Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
