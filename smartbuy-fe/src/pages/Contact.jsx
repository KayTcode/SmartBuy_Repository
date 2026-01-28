import { useEffect, useState } from 'react';
import { useLocale } from '../i18n/LocaleContext.jsx';
import Newsletter from '../components/Newsletter.jsx';

const mapImage =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80';

function Contact() {
  const { t } = useLocale();
  const hero = t('contact.hero');
  const info = t('contact.info');
  const formCopy = t('contact.form');
  const validation = t('contact.validation');
  const mapCopy = t('contact.map');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = validation.nameRequired;
    }
    if (!formData.email.trim()) {
      nextErrors.email = validation.emailRequired;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = validation.emailInvalid;
    }
    if (!formData.message.trim()) {
      nextErrors.message = validation.messageRequired;
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus('');
      return;
    }

    setStatus(formCopy.submit);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="space-y-16">
      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-4 px-4 text-center">
          <h1 className="text-4xl font-semibold md:text-5xl">{hero.title}</h1>
          <p className="text-base text-slate-200 md:text-lg">{hero.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[minmax(240px,0.6fr)_minmax(0,1fr)]">
          <div className="space-y-6 rounded-3xl bg-slate-50 p-6">
            <ContactInfoItem title={info.addressTitle} icon="📍" description={[info.address]} />
            <ContactInfoItem title={info.emailTitle} icon="✉️" description={info.emails ?? []} />
            <ContactInfoItem title={info.phoneTitle} icon="☎️" description={info.phones ?? []} />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-slate-900">{formCopy.title}</h2>
              <p className="text-sm text-slate-500">{formCopy.description}</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  label={formCopy.namePlaceholder}
                  value={formData.name}
                  error={errors.name}
                  onChange={handleChange('name')}
                />
                <FormField
                  label={formCopy.emailPlaceholder}
                  value={formData.email}
                  error={errors.email}
                  onChange={handleChange('email')}
                  type="email"
                />
              </div>
              <FormField
                label={formCopy.subjectPlaceholder}
                value={formData.subject}
                onChange={handleChange('subject')}
              />
              <FormField
                as="textarea"
                label={formCopy.messagePlaceholder}
                value={formData.message}
                error={errors.message}
                onChange={handleChange('message')}
                rows={5}
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                {formCopy.submit}
              </button>
              {status ? (
                <p className="rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  {status}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] px-4">
        <img src={mapImage} alt={mapCopy.caption} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-6 text-center text-sm font-semibold text-white">
          {mapCopy.caption}
        </div>
      </section>

      <Newsletter />
    </div>
  );
}

function ContactInfoItem({ title, icon, description }) {
  return (
    <div className="space-y-1 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-xl">{icon}</span>
        <span className="font-semibold text-slate-700">{title}</span>
      </div>
      {description.map((line) => (
        <p key={line} className="text-slate-500">
          {line}
        </p>
      ))}
    </div>
  );
}

function FormField({ as = 'input', label, value, onChange, error, ...rest }) {
  const FieldComponent = as === 'textarea' ? 'textarea' : 'input';

  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
      {label}
      <FieldComponent
        value={value}
        onChange={onChange}
        className="rounded-3xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        {...rest}
      />
      {error ? <span className="text-xs font-semibold text-rose-500">{error}</span> : null}
    </label>
  );
}

export default Contact;
