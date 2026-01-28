import { useLocale } from '../i18n/LocaleContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const footerColumns = [
  {
    titleKey: 'common.footerColumnTitles.account',
    links: [
      { key: 'common.footerLinks.myAccount', pageKey: 'login' },
      { key: 'common.footerLinks.orderHistory', pageKey: 'my-orders' },
      { key: 'common.footerLinks.shoppingCart', pageKey: 'cart' }
    ]
  },
  {
    titleKey: 'common.footerColumnTitles.help',
    links: [
      { key: 'common.footerLinks.contact', pageKey: 'contact' },
      { key: 'common.footerLinks.faqs', pageKey: null }, // No page yet
      { key: 'common.footerLinks.terms', pageKey: null } // No page yet
    ]
  },
  {
    titleKey: 'common.footerColumnTitles.information',
    links: [
      { key: 'common.footerLinks.about', pageKey: 'about' },
      { key: 'common.footerLinks.shop', pageKey: 'shop' },
      { key: 'common.footerLinks.product', pageKey: 'shop' }
    ]
  },
  {
    titleKey: 'common.footerColumnTitles.categories',
    links: [
      { key: 'common.footerLinks.fruitVeg', pageKey: 'shop', category: 'fresh-fruit' },
      { key: 'common.footerLinks.meatFish', pageKey: 'shop' }, // No specific category for meat-fish
      { key: 'common.footerLinks.breadBakery', pageKey: 'shop', category: 'bread-bakery' }
    ]
  }
];

function AppFooter({ onNavigate = () => {} }) {
  const { t } = useLocale();
  const { isAuthenticated } = useAuth();
  const year = new Date().getFullYear();

  const handleLinkClick = (link, e) => {
    if (!link.pageKey) {
      // For links without pages (faqs, terms), prevent default and do nothing
      e.preventDefault();
      return;
    }

    e.preventDefault();
    
    // Special handling for my-account: go to my-orders if logged in, otherwise login
    if (link.key === 'common.footerLinks.myAccount') {
      onNavigate(isAuthenticated ? 'my-orders' : 'login');
      return;
    }

    // For category links, navigate to shop
    // Note: Category filtering would need to be handled in Shop component
    onNavigate(link.pageKey);
  };

  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-8 md:grid-cols-[minmax(200px,280px)_repeat(4,minmax(140px,1fr))]">
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-semibold text-primary">Smart Buy</div>
            <p className="text-sm leading-relaxed text-slate-400">
              {t('common.footerDescription')}
            </p>
          </div>
          {footerColumns.map((column) => (
            <div key={column.titleKey} className="flex flex-col gap-3">
              <h5 className="text-sm font-semibold uppercase tracking-wide text-white">
                {t(column.titleKey)}
              </h5>
              <nav>
                {column.links.map((link) => (
                  <a
                    href={link.pageKey ? `#${link.pageKey}` : '#'}
                    key={link.key}
                    onClick={(e) => handleLinkClick(link, e)}
                    className="block py-1 text-sm text-slate-400 transition hover:text-primary cursor-pointer"
                  >
                    {t(link.key)}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-10 h-px bg-slate-800" />

        <div className="mt-8 flex flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>{t('common.footerBottom', { year })}</span>
          <div className="flex flex-wrap items-center gap-4">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); }}
              className="transition hover:text-primary cursor-pointer"
            >
              {t('common.footerPolicies.privacy')}
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); }}
              className="transition hover:text-primary cursor-pointer"
            >
              {t('common.footerPolicies.terms')}
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); }}
              className="transition hover:text-primary cursor-pointer"
            >
              {t('common.footerPolicies.sitemap')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
