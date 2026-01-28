import { useMemo } from 'react';
import { useLocale } from '../i18n/LocaleContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { formatVND } from '../utils/currency.js';
import { IconCart, IconCompare, IconHeart, IconLock, IconStar } from './icons.jsx';

function ProductCard({ product, layout = 'grid', onClick }) {
  const { t } = useLocale();
  const { addToCart } = useCart();
  const { success } = useToast();
  const { name, price, oldPrice, rating, reviews, image, status, featured } = product;

  const { statusBadge, isOutOfStock } = useMemo(() => {
    if (status === 'out-of-stock') {
      return {
        statusBadge: {
          label: t('common.outOfStock'),
          className: 'bg-slate-900 text-white'
        },
        isOutOfStock: true
      };
    }
    if (status === 'discount') {
      return {
        statusBadge: {
          label: t('common.sale'),
          className: 'bg-rose-500 text-white'
        },
        isOutOfStock: false
      };
    }
    return { statusBadge: null, isOutOfStock: false };
  }, [status, t]);

  const containerClasses = [
    'group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-[0_20px_40px_rgba(59,183,126,0.15)]',
    layout === 'list'
      ? 'gap-6 p-6 md:flex-row md:items-center'
      : 'p-5'
  ].join(' ');

  const imageWrapperClasses = [
    'relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white',
    layout === 'list' ? 'h-56 w-full md:w-60' : 'h-60 w-full'
  ].join(' ');

  const contentClasses =
    layout === 'list'
      ? 'flex flex-1 flex-col justify-between gap-4'
      : 'mt-4 flex flex-1 flex-col gap-3';

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && onClick) {
      onClick();
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
      success(`Đã thêm "${name}" vào giỏ hàng!`);
    }
  };

  return (
    <div
      className={containerClasses}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className={imageWrapperClasses}>
        {statusBadge ? (
          <span
            className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold ${
              statusBadge.className
            }`}
          >
            {statusBadge.label}
          </span>
        ) : null}
        {featured && !statusBadge ? (
          <span className="absolute left-4 top-4 z-10 rounded-full border border-primary/10 bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm">
            Featured
          </span>
        ) : featured && statusBadge ? (
          <span className="absolute left-4 top-14 z-10 rounded-full border border-primary/10 bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm">
            Featured
          </span>
        ) : null}
        <div className="absolute right-4 top-4 z-10 flex flex-col items-center gap-2 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-primary hover:text-primary"
            aria-label={t('common.addToWishlist')}
          >
            <IconHeart className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-primary hover:text-primary"
            aria-label={t('common.compare')}
          >
            <IconCompare className="h-4 w-4" />
          </button>
        </div>

        <div className="relative h-full w-full">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/assets/smartbuy.jpg';
            }}
          />
        </div>
        {isOutOfStock ? (
          <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-[2px]" />
        ) : null}
      </div>

      <div className={contentClasses}>
        <div className="flex flex-col gap-2">
          <h4 className="line-clamp-2 text-base font-semibold leading-tight text-slate-900 transition-colors group-hover:text-primary">
            {name}
          </h4>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">{formatVND(price)}</span>
            {oldPrice ? (
              <span className="text-sm font-medium text-slate-400 line-through">
                {formatVND(oldPrice)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <IconStar
                key={`${product.id}-star-${index}`}
                className={`h-3.5 w-3.5 ${
                  rating >= index + 1 ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="font-semibold text-slate-600">{rating.toFixed(1)}</span>
          <span className="text-slate-400">({reviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <span className="text-xs font-medium text-slate-500">{t('common.inStock') ?? 'In stock'}</span>
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              isOutOfStock
                ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'
                : 'bg-primary text-white shadow-sm hover:scale-110 hover:bg-primary-dark hover:shadow-md'
            }`}
            aria-label={t('common.addToCart')}
          >
            {isOutOfStock ? <IconLock className="h-4 w-4" /> : <IconCart className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
