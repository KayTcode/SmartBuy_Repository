import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { useLocale } from '../i18n/LocaleContext.jsx';
import { formatVND } from '../utils/currency.js';
import {
  IconArrowLeft,
  IconCart,
  IconCheckCircle,
  IconHeart,
  IconShare,
  IconStar
} from '../components/icons.jsx';

function ProductDetail({ product, relatedProducts = [], onBack, onProductClick }) {
  const { t } = useLocale();
  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    setSelectedImage(product?.image);
  }, [product]);

  useEffect(() => {
    setActiveTab('description');
  }, [product]);

  const gallery = useMemo(() => {
    if (product?.gallery?.length) {
      return product.gallery;
    }
    return [product?.image, product?.image, product?.image].filter(Boolean);
  }, [product]);

  const descriptionText = useMemo(() => {
    if (!product) return '';
    return t('productDetail.defaultDescription', { name: product.name });
  }, [product, t]);

  const categoryLabel = useMemo(() => {
    if (!product?.category) return '';
    const translated = t(`categories.${product.category}`);
    return typeof translated === 'string' ? translated : product.category;
  }, [product, t]);

  const tagLabels = useMemo(() => {
    if (!product?.tags?.length) return '';
    return product.tags
      .map((tag) => {
        const translated = t(`tags.${tag}`);
        return typeof translated === 'string' ? translated : tag;
      })
      .join(', ');
  }, [product, t]);

  const tabsContent = useMemo(() => {
    if (!product) {
      return [];
    }
    const tabCopy = t('productDetail.tabs');
    return [
      {
        key: 'description',
        label: t('productDetail.descriptionTab'),
        body: tabCopy.description?.replaceAll?.('${name}', product.name) ?? descriptionText
      },
      {
        key: 'additional',
        label: t('productDetail.additionalTab'),
        body: tabCopy.additional ?? ''
      },
      {
        key: 'feedback',
        label: t('productDetail.feedbackTab'),
        body: tabCopy.feedback ?? ''
      }
    ];
  }, [product, t, descriptionText]);

  const infoRows = useMemo(() => {
    if (!product) return [];
    const infoCopy = t('productDetail.info');
    return infoCopy.map((item, index) => ({
      label: item.label,
      value:
        product[item.key] ??
        (Array.isArray(item.fallback)
          ? item.fallback[index % item.fallback.length]
          : item.fallback)
    }));
  }, [product, t]);

  const features = t('productDetail.features') ?? [];
  const shippingCopy = t('productDetail.shipping') ?? {};

  if (!product) {
    return null;
  }

  const activeTabContent =
    tabsContent.find((item) => item.key === activeTab) ?? tabsContent[0] ?? null;

  return (
    <div className="space-y-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pt-6">
        <nav className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                <IconArrowLeft className="h-4 w-4" />
                {t('header.nav.shop')}
              </button>
            </li>
            <li className="text-slate-400">/</li>
            <li>{t('common.categoriesBreadcrumb')}</li>
            <li className="text-slate-400">/</li>
            <li>{categoryLabel || product.category}</li>
            <li className="text-slate-400">/</li>
            <li className="font-semibold text-slate-700">{product.name}</li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-96 w-full rounded-[24px] object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  className={`overflow-hidden rounded-2xl border transition ${
                    selectedImage === image
                      ? 'border-primary ring-2 ring-primary/40'
                      : 'border-transparent hover:border-primary/40'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900">{product.name}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1 text-amber-500">
                  <IconStar className="h-4 w-4" />
                  <span className="font-semibold text-amber-600">
                    {product.rating?.toFixed(1)}
                  </span>
                </span>
                <span className="text-xs text-slate-400">({product.reviews || 0} reviews)</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {t('productDetail.stockStatus')}
                </span>
              </div>
            </div>

            <div className="flex items-end gap-3">
              <p className="text-3xl font-semibold text-primary">
                {formatVND(product.price)}
              </p>
              {product.oldPrice ? (
                <span className="text-sm text-slate-400 line-through">
                  {formatVND(product.oldPrice)}
                </span>
              ) : null}
              {product.status === 'discount' && product.oldPrice ? (
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-500">
                  -
                  {Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) * 100
                  )}
                  %
                </span>
              ) : null}
            </div>

            <p className="text-sm leading-relaxed text-slate-600">{descriptionText}</p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                <IconCart className="h-5 w-5" />
                {t('productDetail.addToCart')}
              </button>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-primary hover:text-primary"
              >
                <IconHeart className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-primary hover:text-primary"
              >
                <IconShare className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">
                    {t('productDetail.category')}:
                  </span>
                  <span>{categoryLabel || product.category}</span>
                </li>
                {tagLabels ? (
                  <li className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">
                      {t('productDetail.tags')}:
                    </span>
                    <span>{tagLabels}</span>
                  </li>
                ) : null}
                {infoRows.map((row) => (
                  <li key={row.label} className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{row.label}:</span>
                    <span>{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-4">
        <div className="flex flex-wrap items-center gap-2">
          {tabsContent.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTabContent ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm leading-relaxed text-slate-600">{activeTabContent.body}</p>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              {t('productDetail.descriptionTab')}
            </h3>
            <p className="mt-3 text-sm text-slate-600">{descriptionText}</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 text-primary">
                    <IconCheckCircle className="h-5 w-5" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                {shippingCopy.discountTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{shippingCopy.discountSubtitle}</p>
              <div className="my-4 h-px w-full bg-slate-200" />
              <h3 className="text-lg font-semibold text-slate-900">
                {shippingCopy.organicTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{shippingCopy.organicSubtitle}</p>
            </div>
            <div className="overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80"
                alt="Organic delivery"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl space-y-6 px-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-slate-900">
            {t('productDetail.relatedTitle')}
          </h3>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onClick={onProductClick ? () => onProductClick(item) : undefined}
            />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
        >
          <IconArrowLeft className="h-4 w-4" />
          {t('productDetail.back')}
        </button>
      </div>

      <Newsletter />
    </div>
  );
}

export default ProductDetail;
