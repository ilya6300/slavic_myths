import { observer } from 'mobx-react-lite';
import { createContext, useContext, type ReactNode } from 'react';
import { gameStore } from '../store/GameStore';
import type { Locale } from './types';

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const LocaleProviderInner = observer(function LocaleProviderInner({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider
      value={{
        locale: gameStore.language,
        setLocale: (locale) => gameStore.setLocale(locale),
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  return <LocaleProviderInner>{children}</LocaleProviderInner>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}

export { gameStore };
