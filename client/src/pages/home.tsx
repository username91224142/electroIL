import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/product-card';
import { FaSmokingBan, FaLeaf, FaTools, FaTelegramPlane, FaBox } from 'react-icons/fa';
import { useTranslation, type Language } from '@/lib/i18n';
import type { ProductWithCategory, Category } from '@shared/schema';

interface HomeProps {
  language: Language;
}

export default function Home({ language }: HomeProps) {
  const { t } = useTranslation(language);

  const { data: featuredProducts, isLoading: productsLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ['/api/products/featured'],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const categoryIcons = {
    vapes: FaSmokingBan,
    tobacco: FaLeaf,
    accessories: FaTools,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-muted to-background py-20" data-testid="section-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
              Premium <span className="gradient-text">Vape</span> Experience
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/catalog">
                <Button className="bg-primary text-primary-foreground px-8 py-3 text-lg font-semibold hover:opacity-90 transition-opacity" data-testid="button-shop-now">
                  {t('shopNow')}
                </Button>
              </Link>
              <a href="https://t.me/Dark090111" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="bg-transparent border-border text-foreground px-8 py-3 text-lg font-semibold hover:bg-accent transition-colors" data-testid="button-contact-manager">
                  <FaTelegramPlane className="mr-2" />
                  {t('contactManager')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16" data-testid="section-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="text-categories-title">
            {t('shopByCategory')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories?.slice(0, 3).map((category, index) => {
              const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || FaBox;
              
              return (
                <Card key={category.id} className="bg-card rounded-xl p-8 text-center hover-lift" data-testid={`card-category-${category.slug}`}>
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="text-2xl text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3" data-testid={`text-category-name-${category.slug}`}>
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-4" data-testid={`text-category-description-${category.slug}`}>
                      {category.description}
                    </p>
                    <Link href={`/catalog?category=${category.slug}`}>
                      <Button variant="link" className="text-primary font-semibold hover:underline" data-testid={`button-category-${category.slug}`}>
                        {t('shopNow')} →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/20" data-testid="section-featured">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold" data-testid="text-featured-title">
              {t('featuredProducts')}
            </h2>
            <Link href="/catalog">
              <Button variant="link" className="text-primary font-semibold hover:underline" data-testid="button-view-all">
                {t('viewAll')} →
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  language={language}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
