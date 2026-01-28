import { useLocale } from '../i18n/LocaleContext.jsx';
import { formatVND } from '../utils/currency.js';
import { IconArrowRight, IconFilter, IconInfo } from './icons.jsx';

function FilterSidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  priceRange,
  priceBounds,
  onPriceChange,
  ratingOptions,
  selectedRatings,
  onRatingToggle,
  tags,
  selectedTags,
  onTagToggle,
  onReset,
  saleProducts
}) {
  const { t } = useLocale();
  const [minPrice, maxPrice] = priceBounds;
  const [currentMin, currentMax] = priceRange;

  const handlePriceInputChange = (index, value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return;
    }
    const next = [...priceRange];
    next[index] = numeric;
    onPriceChange(next);
  };

  return (
    <aside className="flex flex-col gap-5">
      <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <IconFilter className="h-5 w-5" />
          </span>
          {t('common.filter')}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold uppercase tracking-wide text-primary transition hover:text-primary-dark"
        >
          {t('common.reset')}
        </button>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          {t('common.categoryAll')}
        </h3>
        <div className="mt-4 space-y-2">
          {categories.map((category) => (
            <button
              type="button"
              key={category.key}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                selectedCategory === category.key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50'
              }`}
              onClick={() => onCategorySelect(category.key)}
            >
              <span>{category.labelKey ? t(category.labelKey) : category.label}</span>
              <span className="text-xs font-semibold text-slate-400">
                {category.count ?? 0}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          {t('common.price')}
        </h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <label className="flex flex-1 flex-col gap-1 text-xs font-semibold text-slate-500">
              Min
              <input
                type="number"
                value={currentMin ?? minPrice}
                min={minPrice}
                max={currentMax ?? maxPrice}
                onChange={(event) => handlePriceInputChange(0, event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-xs font-semibold text-slate-500">
              Max
              <input
                type="number"
                value={currentMax ?? maxPrice}
                min={currentMin ?? minPrice}
                max={maxPrice}
                onChange={(event) => handlePriceInputChange(1, event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>
          <p className="text-sm text-slate-500">
            {t('common.priceRange', {
              min: (currentMin ?? minPrice).toFixed(2),
              max: (currentMax ?? maxPrice).toFixed(2)
            })}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          {t('common.rating')}
        </h3>
        <div className="mt-4 space-y-3">
          {ratingOptions.map((rating) => (
            <label key={rating.value} className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                checked={selectedRatings.includes(rating.value)}
                onChange={(event) => onRatingToggle(rating.value, event.target.checked)}
              />
              <span>{rating.labelKey ? t(rating.labelKey) : rating.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          {t('common.popularTag')}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => {
            const value = tag.value ?? tag;
            const isActive = selectedTags.includes(value);
            return (
              <button
                type="button"
                key={value}
                onClick={() => onTagToggle(value, !isActive)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-200 text-slate-500 hover:border-primary hover:text-primary'
                }`}
              >
                {tag.labelKey ? t(tag.labelKey) : tag.label ?? value}
              </button>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-lg">
        <div className="relative z-10 space-y-3">
          <h3 className="text-lg font-semibold">{t('common.sidebarDiscountTitle')}</h3>
          <p className="text-sm text-white/80">{t('common.sidebarDiscountSubtitle')}</p>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary transition hover:bg-slate-100"
          >
            {t('common.sidebarDiscountCta')}
            <IconArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full border border-white/40" />
        <div className="absolute -right-20 bottom-0 h-40 w-40 rounded-full border border-white/20" />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            {t('common.saleProducts')}
          </h3>
          <span className="text-xs font-semibold text-primary">{saleProducts.length}</span>
        </div>
        <ul className="mt-4 space-y-4">
          {saleProducts.map((product) => (
            <li key={product.id} className="flex items-center gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 text-sm">
                <a href={`#${product.id}`} className="font-semibold text-slate-700 hover:text-primary">
                  {product.name}
                </a>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary">{formatVND(product.price)}</span>
                  {product.oldPrice ? (
                    <span className="text-xs text-slate-400 line-through">
                      {formatVND(product.oldPrice)}
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {!saleProducts.length ? (
          <p className="text-sm text-slate-500">{t('common.noSaleProducts')}</p>
        ) : null}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            {t('common.dailyGoal')}
          </h3>
          <IconInfo className="h-4 w-4 text-slate-400" />
        </div>
        <div className="mt-4">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="absolute inset-y-0 left-0 w-[72%] rounded-full bg-primary" />
          </div>
          <p className="mt-3 text-sm text-slate-500">72% completed</p>
        </div>
      </section>
    </aside>
  );
}

export default FilterSidebar;
