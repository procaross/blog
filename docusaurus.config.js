// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Proca的个人博客',
  tagline: '这里是Proca的个人博客，分享一些实用的博文～',
  url: 'http://proca.icu',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ProcaRoss', // Usually your GitHub org/user name.
  projectName: 'blog', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      'en': {
        htmlLang: 'en-GB',
        label: 'English',
        direction: 'ltr',
      },  
      'zh-Hans': {
        label: '简体中文',
        direction: 'ltr',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // docs: {
        //   sidebarPath: require.resolve('./sidebars.js'),
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        gtag: {
          trackingID: 'G-27SWHJ9YZG',
          anonymizeIP: true,
        },
        sitemap: {
          priority: 0.5,          
          filename: 'sitemap.xml',
        },
        blog: {
          path: "./blog",
          routeBasePath: "/blog",
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  baseUrlIssueBanner: false,
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {name: 'keywords', content: '技术, blog, Javascript'},
        {name: 'description', content: '这里是Proca的个人博客～会分享一些个人学习过程中写的博文'},
        {
          property: 'og:title', content: 'Proca的个人博客'
        }
    ],
      navbar: {
        title: 'Proca的个人博客',
        logo: {
          alt: 'Logo',
          src: 'img/logo.svg',
        },
        items: [
          // {
          //   type: 'doc',
          //   docId: 'intro',
          //   position: 'left',
          //   label: 'Tutorial',
          // },
          {to: '/blog', label: '技术博文', position: 'left'},
          {
            type:'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/ProcaRoss',
            label: '我的Github',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '全站导航',
            items: [
              {
                label: '技术博文',
                to: '/blog',
              },
            ],
          },
          {
            title: '社区',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/',
              },

              {
                label: 'Github',
                href: 'https://github.com'
              }
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '可链',
                href: 'https://co.link/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Proca, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
