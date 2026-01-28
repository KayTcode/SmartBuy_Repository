import { useEffect, useMemo, useState } from 'react';
import FilterSidebar from '../components/FilterSidebar.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { categories, ratings, tags as tagOptions } from '../data/products.js';
import { useLocale } from '../i18n/LocaleContext.jsx';
import { productsAPI } from '../services/api.js';

function Shop({ products: initialProducts, loading: initialLoading, error: initialError, onViewProduct }) {
  const { t } = useLocale();
  const [sortOption, setSortOption] = useState('latest');
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(initialLoading || false);
  const [error, setError] = useState(initialError || null);
  const [filters, setFilters] = useState({
    category: 'all',
    price: [0, 0],
    ratings: [],
    tags: []
  });

  // Fetch products from API when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiFilters = {
          category: filters.category !== 'all' ? filters.category : undefined,
          minPrice: filters.price[0] > 0 ? filters.price[0] : undefined,
          maxPrice: filters.price[1] > 0 ? filters.price[1] : undefined,
          minRating: filters.ratings.length > 0 ? Math.max(...filters.ratings) : undefined,
          tags: filters.tags.length > 0 ? filters.tags : undefined,
          sort: sortOption === 'price-asc' ? 'price' : 
                sortOption === 'price-desc' ? '-price' :
                sortOption === 'rating-desc' ? '-rating' : '-createdAt'
        };

        const data = await productsAPI.getAll(apiFilters);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to load products');
        // Fallback to initial products if API fails
        if (initialProducts) {
          setProducts(initialProducts);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, sortOption, initialProducts]);

  const priceBounds = useMemo(() => {
    if (!products.length) {
      return [0, 0];
    }
    const prices = products.map((product) => product.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));
    return [minPrice, maxPrice];
  }, [products]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      price: [...priceBounds]
    }));
  }, [priceBounds[0], priceBounds[1]]);

  const categoryFilters = useMemo(() => {
    const counts = products.reduce(
      (accumulator, product) => {
        accumulator.all = (accumulator.all || 0) + 1;
        accumulator[product.category] = (accumulator[product.category] || 0) + 1;
        return accumulator;
      },
      { all: products.length }
    );

    return [
      { key: 'all', labelKey: 'common.categoryAll', count: counts.all || 0 },
      ...categories.map((category) => ({
        ...category,
        count: counts[category.key] || 0
      }))
    ];
  }, [products]);

  const saleProducts = useMemo(
    () =>
      products
        .filter((product) => product.oldPrice || product.status === 'discount')
        .slice(0, 3),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.category !== 'all') {
      result = result.filter((product) => product.category === filters.category);
    }

    const [min, max] = filters.price;
    result = result.filter((product) => product.price >= min && product.price <= max);

    if (filters.ratings.length) {
      const minimum = Math.max(...filters.ratings);
      result = result.filter((product) => product.rating >= minimum);
    }

    if (filters.tags.length) {
      result = result.filter((product) =>
        filters.tags.every((tag) => product.tags?.includes(tag))
      );
    }

    return result;
  }, [products, filters]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return sorted;
  }, [filteredProducts, sortOption]);

  const activeCategoryLabel = useMemo(() => {
    if (filters.category === 'all') {
      return t('common.categoryAll');
    }
    const match = categories.find((category) => category.key === filters.category);
    return match ? t(match.labelKey) : t('common.categoryAll');
  }, [filters.category, t]);

  const handleCategorySelect = (key) => {
    setFilters((prev) => ({
      ...prev,
      category: key
    }));
  };

  const handlePriceChange = (range) => {
    setFilters((prev) => ({
      ...prev,
      price: range
    }));
  };

  const handleRatingToggle = (value, checked) => {
    setFilters((prev) => {
      const next = new Set(prev.ratings);
      if (checked) {
        next.add(value);
      } else {
        next.delete(value);
      }
      return {
        ...prev,
        ratings: Array.from(next)
      };
    });
  };

  const handleTagToggle = (tag, checked) => {
    setFilters((prev) => {
      const next = new Set(prev.tags);
      if (checked) {
        next.add(tag);
      } else {
        next.delete(tag);
      }
      return {
        ...prev,
        tags: Array.from(next)
      };
    });
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      price: [...priceBounds],
      ratings: [],
      tags: []
    });
  };

  return (
    <div className="mx-auto flex min-h-full max-w-7xl flex-col gap-10 px-4 py-10">
      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm">
          <p className="text-base font-semibold text-rose-600">{t('common.alertErrorTitle')}</p>
          <p className="mt-2 text-rose-500">{error}</p>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="min-w-0">
          <FilterSidebar
            categories={categoryFilters}
            selectedCategory={filters.category}
            onCategorySelect={handleCategorySelect}
            priceRange={filters.price}
            priceBounds={priceBounds}
            onPriceChange={handlePriceChange}
            ratingOptions={ratings}
            selectedRatings={filters.ratings}
            onRatingToggle={handleRatingToggle}
            tags={tagOptions}
            selectedTags={filters.tags}
            onTagToggle={handleTagToggle}
            onReset={handleResetFilters}
            saleProducts={saleProducts}
          />
        </div>
        <div className="min-w-0 space-y-8">
          <ProductGrid
            products={sortedProducts}
            totalCount={filteredProducts.length}
            categoryLabel={activeCategoryLabel}
            sortOption={sortOption}
            onSortChange={setSortOption}
            loading={loading}
            onProductClick={onViewProduct}
          />
        </div>
      </div>

      <Newsletter />
    </div>
  );
}

export default Shop;
