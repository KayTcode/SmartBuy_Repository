import { useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import Newsletter from '../components/Newsletter.jsx';
import NewsletterModal from '../components/NewsletterModal.jsx';
import { useLocale } from '../i18n/LocaleContext.jsx';
import { formatVND } from '../utils/currency.js';
import { IconArrowLeft, IconArrowRight, IconStar } from '../components/icons.jsx';

const heroSlides = [
  {
    id: 'slide-1',
    image:
      'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/sieu_thi_mini_0d7c4b1988.png',
    highlights: [
      { icon: '🌿', titleKey: 'home.hero.highlights.organic', descriptionKey: 'home.hero.highlights.organicDesc' },
      { icon: '⚡', titleKey: 'home.hero.highlights.delivery', descriptionKey: 'home.hero.highlights.deliveryDesc' },
      { icon: '🎁', titleKey: 'home.hero.highlights.discount', descriptionKey: 'home.hero.highlights.discountDesc' }
    ]
  },
  {
    id: 'slide-2',
    image:
      '/assets/khu-vuc-sieu-thi-tai-tang-tret-cua-aeon-binh-tan.jpg',
    highlights: [
      { icon: '🌿', titleKey: 'home.hero.highlights.organic', descriptionKey: 'home.hero.highlights.organicDesc' },
      { icon: '🎁', titleKey: 'home.hero.highlights.discount', descriptionKey: 'home.hero.highlights.discountDesc' }
    ]
  },
  {
    id: 'slide-3',
    image:
      '/assets/sieu-thi2.jpg',
    highlights: [
      { icon: '⚡', titleKey: 'home.hero.highlights.delivery', descriptionKey: 'home.hero.highlights.deliveryDesc' },
      { icon: '🎁', titleKey: 'home.hero.highlights.discount', descriptionKey: 'home.hero.highlights.discountDesc' }
    ]
  }
];

const categoryMeta = [
  { key: 'fresh-fruit', icon: '🍎' },
  { key: 'vegetables', icon: '🥬' },
  { key: 'beverages', icon: '🥤' },
  { key: 'snacks', icon: '🥟' },
  { key: 'beauty-health', icon: '💊' }
];

const newsMeta = [
  {
    id: 'news-1',
    image:
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'news-2',
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'news-3',
    image:
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80'
  }
];

const testimonialMeta = [
  {
    id: 'testimonial-1',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80'
  },
  {
    id: 'testimonial-2',
    rating: 4.5,
    avatar:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=160&q=80'
  },
  {
    id: 'testimonial-3',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80'
  }
];

const contactIcons = ['📍', '☎️', '✉️', '🕑'];

const NEWSLETTER_STORAGE_KEY = 'smartbuy_newsletter_dismissed';

function Home({ products, loading, errorMessage, onExploreShop, onNavigate }) {
  const { t } = useLocale();
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const slidesRef = useRef(heroSlides);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slidesRef.current.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const heroContent = t('home.hero') ?? {};

  const featuredProducts = useMemo(() => {
    if (!products.length) {
      return [];
    }

    const featured = products.filter((product) => product.featured);
    if (featured.length >= 3) {
      return featured.slice(0, 3);
    }
    return products.slice(0, 3);
  }, [products]);

  const bestSellerProducts = useMemo(() => {
    if (!products.length) {
      return [];
    }
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  }, [products]);

  const categoriesContent = t('home.categories') ?? {};
  const categoryCards = categoryMeta.map(({ key, icon }) => ({
    key,
    icon,
    title: categoriesContent.items?.[key]?.title ?? '',
    description: categoriesContent.items?.[key]?.description ?? ''
  }));

  const statsHighlights = t('home.stats') ?? [];

  const newsContent = t('home.news') ?? {};
  const newsPosts = (newsContent.posts ?? []).map((post, index) => ({
    ...post,
    ...(newsMeta[index] ?? {}),
    id: newsMeta[index]?.id ?? `news-${index}`
  }));

  const testimonialsContent = t('home.testimonials') ?? {};
  const testimonials = (testimonialsContent.items ?? []).map((item, index) => ({
    ...item,
    ...(testimonialMeta[index] ?? {}),
    id: testimonialMeta[index]?.id ?? `testimonial-${index}`
  }));

  const contactContent = t('home.contact') ?? [];
  const contactCards = contactContent.map((item, index) => ({
    ...item,
    icon: contactIcons[index] ?? '🌱'
  }));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const dismissed = window.localStorage.getItem(NEWSLETTER_STORAGE_KEY);
    if (dismissed) {
      return;
    }
    const timer = window.setTimeout(() => {
      setIsNewsletterOpen(true);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, []);

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slidesRef.current.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slidesRef.current.length) % slidesRef.current.length);
  };

  return (
    <div className="space-y-16">
      <section className="relative mx-auto mt-4 max-w-7xl overflow-hidden rounded-[40px] bg-slate-900 text-white">
        <div className="absolute inset-0">
          <img
            src={heroSlides[activeSlide].image}
            alt={heroContent.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>
        <div className="relative z-10 grid gap-10 px-6 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-12 md:py-16">
          <div className="flex flex-col gap-6">
            {heroContent.badge ? (
              <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                {heroContent.badge}
              </span>
            ) : null}
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              {heroContent.title}
            </h1>
            <p className="max-w-xl text-base text-slate-200 md:text-lg">{heroContent.subtitle}</p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onExploreShop}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                {heroContent.primaryCta ?? t('home.hero.primaryCta', 'Shop now')}
                <IconArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => onExploreShop?.()}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                {heroContent.secondaryCta ?? t('home.hero.secondaryCta', 'Learn more')}
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {heroSlides[activeSlide].highlights.map((item) => (
                <div
                  key={item.titleKey}
                  className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white">{t(item.titleKey)}</h4>
                      <p className="text-sm text-slate-200">{t(item.descriptionKey)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 translate-x-8 rounded-3xl bg-primary/20 blur-3xl" />
            <div className="relative flex h-full w-full items-center justify-center rounded-[32px] bg-white/10 backdrop-blur">
              <img
                src={heroSlides[activeSlide].image}
                alt={heroContent.title}
                className="h-full w-full rounded-[32px] object-cover"
              />
            </div>
          </div>
        </div>

        <div className="absolute left-6 top-1/2 flex -translate-y-1/2 flex-col gap-3 md:left-10">
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Previous slide"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Next slide"
          >
            <IconArrowRight className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {heroSlides.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              className={`h-2 rounded-full transition ${
                activeSlide === index ? 'w-10 bg-white' : 'w-4 bg-white/40'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{t('home.featured.title')}</h2>
            <p className="text-sm text-slate-500">{t('home.categories.description')}</p>
          </div>
          <button
            type="button"
            onClick={onExploreShop}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
          >
            {t('home.featured.viewAll')}
            <IconArrowRight className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : errorMessage ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-600">
            {errorMessage}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-48 overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                  <p className="text-sm text-slate-500">
                    {formatVND(product.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onExploreShop}
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                  {t('common.addToCart')}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4">
        <div className="flex flex-col gap-3 md:w-2/3">
          <h2 className="text-2xl font-semibold text-slate-900">{t('home.categories.title')}</h2>
          <p className="text-sm text-slate-500">{t('home.categories.description')}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categoryCards.map(({ key, icon, title, description }) => (
            <div
              key={key}
              className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 text-sm shadow-sm transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                {icon}
              </span>
              <h3 className="text-base font-semibold text-slate-800">{title}</h3>
              <p className="text-sm text-slate-500">{description}</p>
              <button
                type="button"
                onClick={onExploreShop}
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-dark"
              >
                {t('home.categories.explore')}
                <IconArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsHighlights.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-semibold text-primary">{item.value}</p>
              <p className="mt-2 text-sm font-medium text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-slate-900">{t('home.bestSeller.title')}</h2>
            <p className="text-sm text-slate-500">{t('home.bestSeller.description') || 'Những sản phẩm được yêu thích nhất'}</p>
          </div>
          <button
            type="button"
            onClick={onExploreShop}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-primary hover:bg-primary hover:text-white"
          >
            {t('home.bestSeller.viewMore')}
            <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-10">
        <div className="flex flex-col gap-3 md:w-2/3">
          <h2 className="text-2xl font-semibold text-slate-900">{t('home.news.title')}</h2>
          <p className="text-sm text-slate-500">{t('home.news.description')}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsPosts.map((post) => (
            <article
              key={post.id}
              className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-[0_20px_40px_rgba(59,183,126,0.15)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                    <span className="text-4xl">📰</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm">
                  {post.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex flex-col gap-2">
                  <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-slate-900 transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {post.excerpt}
                  </p>
                </div>
                {post.date && (
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>{post.date}</span>
                    {post.readTime && <span className="before:content-['•']">{post.readTime}</span>}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('blog');
                    }
                  }}
                  className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary hover:text-white"
                >
                  {t('home.news.readMore')}
                  <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4">
        <div className="flex flex-col gap-3 md:w-2/3">
          <h2 className="text-2xl font-semibold text-slate-900">{testimonialsContent.title}</h2>
          <p className="text-sm text-slate-500">{testimonialsContent.description}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <IconStar
                    key={`star-${testimonial.id}-${index}`}
                    className={`h-4 w-4 ${
                      testimonial.rating >= index + 1 ? 'text-amber-500' : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-slate-500">
                  {testimonial.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm italic text-slate-600">“{testimonial.quote}”</p>
              <div className="mt-auto flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <Newsletter />

      {loading ? null : (
        <NewsletterModal
          open={isNewsletterOpen}
          onClose={({ dismiss }) => {
            setIsNewsletterOpen(false);
            if (dismiss && typeof window !== 'undefined') {
              window.localStorage.setItem(NEWSLETTER_STORAGE_KEY, 'true');
            }
          }}
        />
      )}
    </div>
  );
}

export default Home;
