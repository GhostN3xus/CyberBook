module.exports = {
  debug: false,
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en']
  },
  defaultNS: 'common',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  localePath: './public/locales'
};
