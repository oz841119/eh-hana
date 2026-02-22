import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  locales: ['zh-TW', 'en-US'],
  defaultLocale: 'zh-TW',
  localePrefix: {
    mode: 'always',
    prefixes: {
      'en-US': '/us',
      'zh-TW': '/tw'
    }
  }
});

