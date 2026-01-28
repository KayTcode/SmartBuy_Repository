import { useEffect, useMemo, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext.jsx';
import { IconArrowRight } from './icons.jsx';

const NEWSLETTER_IMAGE = '/assets/smartbuy.jpg';

function NewsletterModal({ open, onClose }) {
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [dismiss, setDismiss] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const highlight = t('common.newsletterModal.highlight');
  const description = t('common.newsletterModal.description');
  const descriptionParts = useMemo(() => description.split(highlight), [description, highlight]);

  useEffect(() => {
    if (open) {
      setEmail('');
      setError('');
      setDismiss(false);
      setCompleted(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setError(t('common.requiredEmail'));
      return;
    }
    if (!validateEmail(email)) {
      setError(t('common.invalidEmail'));
      return;
    }

    setError('');
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setCompleted(true);
      onClose({ email, dismiss });
    }, 600);
  };

  const handleClose = () => {
    onClose({ dismiss });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8">
      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[1.1fr_1fr]">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow hover:text-slate-700"
        >
          &times;
        </button>
        <div className="hidden bg-slate-100 md:block">
          <img
            src={NEWSLETTER_IMAGE}
            alt="Fresh grocery basket"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-6 px-6 py-10 sm:px-10">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
              smartbuy
            </p>
            <h3 className="text-3xl font-semibold text-slate-900">
              {t('common.newsletterModal.title')}
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {descriptionParts.map((part, index) => (
                <span key={`desc-${index}`}>
                  {part}
                  {index < descriptionParts.length - 1 ? (
                    <span className="font-semibold text-primary">{highlight}</span>
                  ) : null}
                </span>
              ))}
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('common.newsletterModal.inputPlaceholder')}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {error ? <p className="text-xs font-semibold text-rose-500">{error}</p> : null}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {t('common.newsletterModal.cta')}
                  <IconArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <label className="flex items-center gap-2 text-sm text-slate-500">
              <input
                type="checkbox"
                checked={dismiss}
                onChange={(event) => setDismiss(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              {t('common.newsletterModal.dismissLabel')}
            </label>
            {completed ? (
              <p className="rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                {t('common.newsletterModal.success')}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewsletterModal;
