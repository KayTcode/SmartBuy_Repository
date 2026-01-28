import { useLocale } from '../i18n/LocaleContext.jsx';

function Newsletter() {
  const { t } = useLocale();

  return (
    <section className="mx-auto mt-16 max-w-7xl rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-white px-6 py-12 shadow-sm sm:px-10 lg:px-16">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Newsletter
          </p>
          <h3 className="text-3xl font-semibold text-slate-900">
            {t('common.newsletterTitle')}
          </h3>
          <p className="text-base text-slate-600">
            {t('common.newsletterDescription')}
          </p>
        </div>
        <form className="flex w-full max-w-lg flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder={t('common.newsletterPlaceholder')}
            className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            {t('common.newsletterButton')}
          </button>
        </form>
      </div>
      <div className="mt-8 inline-flex items-center gap-2 text-sm text-slate-500">
        {['f', 't', 'p'].map((social) => (
          <span
            key={social}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white font-semibold text-slate-500"
          >
            {social.toUpperCase()}
          </span>
        ))}
      </div>
    </section>
  );
}

export default Newsletter;
