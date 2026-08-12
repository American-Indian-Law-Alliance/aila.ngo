export const url = process.env.URL || 'http://localhost:8080';
// Extract domain from `url`
export const domain = new URL(url).hostname;
export const siteName = 'American Indian Law Alliance';
export const siteDescription = 'The American Indian Law Alliance - An NGO in consultative status with the United Nations Economic & Social Council (ECOSOC)';
export const siteType = 'Organization'; // schema
export const locale = 'en_EN';
export const lang = 'en';
export const skipContent = 'Skip to content';
// Stores the endpoint url of the Form
export const forms = {
  contactFormUrl: "https://formspree.io/f/mykbnwoa",
  speakerFormUrl: "https://formspree.io/f/mgopnkqe"
}
export const author = {
  name: 'American Indian Law Alliance', // i.e. Lene Saile - page / blog author's name. Must be set.
  avatar: '/icon-512x512.png', // path to the author's avatar. In this case just using a favicon.
  email: 'aila@aila.ngo', // i.e. hola@lenesaile.com - email of the author
  website: 'https://www.aila.ngo', // i.e. https.://www.lenesaile.com - the personal site of the author
};

export const pathToSvgLogo = 'src/assets/images/org/logo/AILA-new-circle-logo2.png'; // used for favicon generation
export const themeColor = '#dd4462'; // used in manifest, for example primary color value
export const themeLight = '#f8f8f8'; // used for meta tag theme-color, if light colors are prefered. best use value set for light bg
export const themeDark = '#2e2e2e'; // used for meta tag theme-color, if dark colors are prefered. best use value set for dark bg
// Coerced to a real boolean: env vars are always strings, so the string
// 'false' read as truthy in templates. That made every post advertise an
// og:image at /assets/og-images/<slug>-preview.jpeg while the SVG-to-JPEG
// step stayed switched off — so every post's social preview 404'd instead of
// falling back to opengraph_default below.
export const OPENGRAPHGEN = process.env.OPENGRAPHGEN === 'true';
export const opengraph_default = '/assets/images/template/opengraph-default.png'; // fallback/default meta image
export const opengraph_default_alt =
  "The American Indian Law Alliance - An NGO in consultative status with the United Nations Economic & Social Council (ECOSOC)"; // alt text for default meta image"
export const blog = {
  // RSS feed
  name: 'American Indian Law Alliance',
  description: 'An NGO in consultative status with the United Nations Economic & Social Council (ECOSOC)',
  // How many recent posts each feed carries. Full post HTML is included per
  // entry, and every entry costs a renderTransforms() pass over that post at
  // build time — emitting all 161 produced a 748 KB feed.xml and a 612 KB
  // feed.json. Readers fetch these on a poll; the archive lives on the site.
  feedLimit: 20,
  // feed links are looped over in the head. You may add more to the array.
  feedLinks: [
    {
      title: 'Atom Feed',
      url: '/feed.xml',
      type: 'application/atom+xml'
    },
    {
      title: 'JSON Feed',
      url: '/feed.json',
      type: 'application/json'
    }
  ],
  // Tags
  tagSingle: 'Tag',
  tagPlural: 'Tags',
  tagMore: 'More tags:',
  // Categories
  categoriesSingle: 'Category',
  categoriesPlural: 'Categories',
  categoriesMore: 'More Categories:',
  // pagination
  paginationLabel: 'Blog',
  paginationPage: 'Page',
  paginationPrevious: 'Previous',
  paginationNext: 'Next',
  paginationNumbers: true
};
export const details = {
  aria: 'section controls',
  expand: 'expand all',
  collapse: 'collapse all'
};
export const dialog = {
  close: 'Close',
  next: 'Next',
  previous: 'Previous'
};
export const navigation = {
  navLabel: 'Menu',
  ariaTop: 'Main',
  ariaBottom: 'Complementary',
  ariaPlatforms: 'Platforms',
  drawerNav: true,
  subMenu: true
};
export const themeSwitch = {
  title: 'Theme',
  light: 'light',
  dark: 'dark'
};

// export const greenweb = {
//   // https://carbontxt.org/
//   disclosures: [
//     {
//       docType: 'sustainability-page',
//       url: `${url}/sustainability/`,
//       domain: domain
//     }
//   ],
//   services: [{domain: 'netlify.com', serviceType: 'cdn'}]
// };

export const tests = {
  pa11y: {
    // keep customPaths empty if you want to test all pages
    customPaths: ['/', '/about/', '/blog/',],
    globalIgnore: []
  }
};