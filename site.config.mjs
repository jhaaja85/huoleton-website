// Site-wide, language-independent settings.
export const site = {
  origin: 'https://huoleton.org',
  defaultLocale: 'fi',
  // false: store buttons are replaced with a "coming soon" notice. Set true on release day.
  launched: false,
  // Google Analytics 4 measurement ID (G-XXXXXXXXXX). null = no analytics and no cookie banner.
  analytics: { gaId: null },
  // Add a locale here and enable it once src/content/<code>.json is complete.
  locales: {
    fi: { enabled: true, label: 'Suomi', ogLocale: 'fi_FI' },
    en: { enabled: false, label: 'English', ogLocale: 'en_GB' },
  },
  links: {
    googlePlay: 'https://play.google.com/store/apps/details?id=com.bcheadholding.huoltokirja',
    appStore: null, // set to the App Store URL when an iOS version exists
    privacy: 'https://www.bcheadholding.com/huoleton-privacy-policy',
    deletion: 'https://www.bcheadholding.com/data-deletion',
    support: 'mailto:juha.haaja@gmail.com',
  },
};
