export default {
  top: [
    {
      text: "About",
      url: "/about/",
      submenu: [
        {
          text: 'Purpose And Vision',
          url: '/about/mission-vision-goals/'
        },
        {
          text: 'Our History',
          url: '/about/our-history/',
          submenu: [
            {
              text: 'In Memoriam: Tonya Gonnella Frichner',
              url: '/about/our-history/in-memoriam-tonya-gonnella-frichner/'
            },
            {
              text: 'League of Nations/United Nations Participation',
              url: '/about/our-history/league-of-nations-united-nations-participation/'
            }
          ]
        },
        {
          text: 'Staff and Board',
          url: '/staff-and-board/'
        },
        {
          text: 'Partnerships and Alliances',
          url: '/about/partnerships-and-alliances/'
        },
        {
          text: 'Contact',
          url: '/contact/',
          submenu: [
            {
              text: 'Request a Speaker',
              url: 'https://forms.gle/1RCkLGfSyBnnmLBr5'
            },
            {
              text: 'Join our email list',
              url: '/email/'
            },
            {
              text: 'Support Us',
              url: '/support-us/'
            }
          ]
        },
      ]
    },
    {
      text: "Services",
      url: "/services/",
      submenu: [
        {
          text: "Cultural Renewal & Mutual Aid",
          url: "/programs/cultural-renewal/"
        },
        {
          text: "Missing and Murdered Indigenous Relatives",
          url: "/programs/mmiw/"
        }
      ]
    },
    {
      text: "Programs",
      url: "/programs/",
      submenu: [
        {
          text: "Lakeback",
          url: "/programs/lakeback/"
        },
        {
          text: "Public Education",
          url: "/programs/public-education/"
        },
        {
          text: "United Nations Programming",
          url: "/programs/united-nations-events/"
        },
      ]
    },
    {
      text: "Engage",
      url: "/programs/united-nations-events/",
      submenu: [
        {
          text: "Blog",
          url: "/blog/"
        },
        {
          text: "Events",
          url: "/category/events/"
        },
        {
          text: "Issues",
          url: "/issues/"
        },
        {
          text: "Resources",
          url: "/links/"
        },
        {
          text: "Request a Speaker",
          url: "https://forms.gle/1RCkLGfSyBnnmLBr5"
        },
        {
          text: "What else can you do?",
          url: "http://aila.ngo/what-else-can-you-do/"
        }
      ]
    },
    {
      text: "News",
      url: "/blog/"
    },
    {
      text: "Store",
      url: "https://store.aila.ngo/"
    },
    {
      text: "Give",
      url: "/give/",
      button: true
    },
    {
      social: [
        {
          text: "Facebook",
          icon: "fa-brands fa-facebook",
          url: "https://www.facebook.com/americanindianlawalliance"
        },
        {
          text: "Instagram",
          icon: "fa-brands fa-instagram",
          url: "https://www.instagram.com/americanindianlawalliance"
        }
      ]
    },
    {
      text: "Search",
      icon: "fa-solid fa-magnifying-glass",
      url: "/search/",
      button: {
        variant: "secondary"
    }
    }
  ],
  bottom: [
    {
      text: 'Style guide',
      url: '/styleguide/'
    },
    {
      text: 'Imprint',
      url: '/imprint/'
    },
    {
      text: 'Privacy',
      url: '/privacy/'
    },
    {
      text: 'Accessibility',
      url: '/accessibility/'
    }
  ]
};
