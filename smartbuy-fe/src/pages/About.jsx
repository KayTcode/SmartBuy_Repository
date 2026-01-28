import { useLocale } from '../i18n/LocaleContext.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { IconCheckCircle, IconStar } from '../components/icons.jsx';

const heroImage =
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg';
const trustImage =
  'https://images.pexels.com/photos/5726794/pexels-photo-5726794.jpeg';
const deliveryImage =
  'https://images.pexels.com/photos/7563654/pexels-photo-7563654.jpeg';
const courierImage =
  'https://images.pexels.com/photos/5025669/pexels-photo-5025669.jpeg';

const benefitIcons = ['✅', '🎧', '💳', '🎁', '😊', '📍'];

// Mapping team member names to their images
const teamImageMap = {
  'Phạm Thanh Thảo': '/assets/img_team_founder/ptt.jpg',
  'Khuất Thị Kim Dung': '/assets/img_team_founder/ktkd.jpg',
  'Chử Hữu Thành': '/assets/img_team_founder/unnamed.png',
  'Nguyễn Chí Tùng Dương': '/assets/img_team_founder/nctd.jpg',
  'Đặng Ngọc Thành': '/assets/img_team_founder/dnt.jpg',
  'Trần Thái Lâm': '/assets/img_team_founder/ttl.jpg'
};

const testimonialAvatars = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
];

function About() {
  const { t } = useLocale();

  const hero = t('about.hero');
  const trust = t('about.trust');
  const benefits = t('about.benefits');
  const delivery = t('about.delivery');
  const team = t('about.team');
  const testimonials = t('about.testimonials');
  const partners = t('about.partners');

  return (
    <div className="space-y-16">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {hero.eyebrow}
          </span>
          <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">{hero.title}</h1>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">{hero.description}</p>
          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            {hero.cta}
          </button>
        </div>
        <div className="overflow-hidden rounded-[40px] shadow-soft">
          <img src={heroImage} alt={hero.title} className="h-full w-full object-cover" />
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-[40px]">
            <img src={trustImage} alt={trust.title} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold text-slate-900">{trust.title}</h2>
            <p className="text-base leading-relaxed text-slate-600">{trust.description}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {trust.stats?.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm"
                >
                  <p className="text-3xl font-semibold text-primary">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-[40px]">
          <img src={deliveryImage} alt={benefits.title} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-semibold text-slate-900">{benefits.title}</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {benefits.items?.map((item, index) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="text-2xl">{benefitIcons[index % benefitIcons.length]}</span>
                <div className="space-y-2 text-sm">
                  <h3 className="text-base font-semibold text-slate-800">{item.title}</h3>
                  <p className="text-slate-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-slate-900">{delivery.title}</h2>
            <p className="text-base leading-relaxed text-slate-600">{delivery.description}</p>
            <ul className="space-y-3 text-sm text-slate-600">
              {delivery.bullets?.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-1 text-primary">
                    <IconCheckCircle className="h-5 w-5" />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              {delivery.cta}
            </button>
          </div>
          <div className="overflow-hidden rounded-[40px] shadow-soft">
            <img src={courierImage} alt={delivery.title} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-4">
        <div className="flex flex-col gap-3 md:w-2/3">
          <h2 className="text-3xl font-semibold text-slate-900">{team.title}</h2>
          <p className="text-sm text-slate-500">{team.subtitle}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-4 lg:grid-cols-6">
          {team.members?.map((member) => (
            <div
              key={member.name}
              className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm"
            >
              <img
                src={teamImageMap[member.name] || '/assets/img_team_founder/unnamed.png'}
                alt={member.name}
                className="h-64 w-full object-cover"
              />
              <div className="space-y-1 px-6 py-4 text-sm">
                <p className="text-base font-semibold text-slate-800">{member.name}</p>
                <p className="text-slate-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl space-y-8 px-4">
          <div className="flex flex-col gap-3 md:w-2/3">
            <h2 className="text-3xl font-semibold text-slate-900">{testimonials.title}</h2>
            <p className="text-sm text-slate-500">{testimonials.subtitle}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.items?.map((item, index) => (
              <div
                key={item.name}
                className="flex h-full flex-col gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm italic leading-relaxed text-slate-600">“{item.quote}”</p>
                <div className="mt-auto flex items-center gap-3">
                  <img
                    src={testimonialAvatars[index % testimonialAvatars.length]}
                    alt={item.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <IconStar
                      key={`testimonial-star-${item.name}-${starIndex}`}
                      className={`h-4 w-4 ${
                        item.rating >= starIndex + 1 ? 'text-amber-500' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-4 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm sm:grid-cols-3">
          {partners?.map((partner) => (
            <div
              key={partner}
              className="flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-slate-400"
            >
              {partner}
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
    </div>
  );
}

export default About;
