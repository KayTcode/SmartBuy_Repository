import { useMemo } from 'react';
import ProductCard from './ProductCard.jsx';
import { useLocale } from '../i18n/LocaleContext.jsx';

function ProductGrid({
  products,
  totalCount,
  categoryLabel,
  sortOption,
  onSortChange,
  loading,
  onProductClick
}) {
  const { t } = useLocale();

  const sortOptions = useMemo(
    () => [
      { value: 'latest', label: t('common.sortLatest') },
      { value: 'price-asc', label: t('common.sortPriceAsc') },
      { value: 'price-desc', label: t('common.sortPriceDesc') },
      { value: 'rating-desc', label: t('common.sortRatingDesc') }
    ],
    [t]
  );

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {t('common.categoriesBreadcrumb')}
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">{categoryLabel}</h2>
          <p className="text-sm text-slate-500">
            {t('common.resultsFound', { count: totalCount })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span>{t('common.sortBy')}:</span>
            <select
              value={sortOption}
              onChange={(event) => onSortChange(event.target.value)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : products.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onProductClick ? () => onProductClick(product) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          {t('common.noProducts')}
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
