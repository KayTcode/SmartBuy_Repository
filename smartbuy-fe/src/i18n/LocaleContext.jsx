import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from './translations.js';

const LocaleContext = createContext({
  locale: 'vi',
  setLocale: () => {},
  t: (key, vars) => translate(key, 'vi', vars)
});

function translate(key, locale, vars) {
  const dictionary = translations[locale] ?? {};
  const segments = key.split('.');
  let result = segments.reduce(
    (accumulator, segment) => (accumulator && accumulator[segment] !== undefined ? accumulator[segment] : undefined),
    dictionary
  );

  if (result === undefined) {
    // fallback to english
    const fallback = translations.en ?? {};
    result = segments.reduce(
      (accumulator, segment) =>
        accumulator && accumulator[segment] !== undefined ? accumulator[segment] : undefined,
      fallback
    );
  }

  if (typeof result === 'string' && vars) {
    return Object.entries(vars).reduce(
      (acc, [token, value]) => acc.replaceAll(`\${${token}}`, value),
      result
    );
  }

  return result ?? key;
}

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('vi');

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => translate(key, locale, vars)
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}
