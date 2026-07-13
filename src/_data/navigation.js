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
          url: '/contact/'
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
          text: "Newsletter",
          url: "/email/"
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
          url: "/request-a-speaker"
        },
        {
          text: "What else can you do?",
          url: "/what-else-can-you-do/"
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
      social: true // pulls in values from _data/organization.yaml
    },
    {
      text: "Give",
      url: "/give/",
      button: true
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
    /*
    NOTE: Can discuss having the Style Guide be public
    {
      text: 'Style guide',
      url: '/styleguide/'
    },
    */
    {
      text: 'Imprint',
      url: '/imprint/'
    },
    {
      text: 'Privacy',
      url: '/privacy-policy/'
    },
  ]
};
