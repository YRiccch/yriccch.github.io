/**
 * 英文 UI 文案。
 * 只放"框架级"界面文字——按钮、section 标题等。
 * 个人内容（姓名 / 时间线 / 论文等）在 src/data/*.ts 里。
 */
export default {
  nav: {
    home: 'Home',
    about: 'About',
    timeline: 'Timeline',
    publications: 'Publications',
    life: 'Life',
    gadgets: 'Gadgets',
  },
  actions: {
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
    switchLanguage: 'Switch language',
    backToTop: 'Back to top',
  },
  about: {
    title: "Hi, I'm Ruiqi.",
    interestsLabel: 'Interests',
  },
  timeline: {
    title: 'Timeline',
  },
  pubs: {
    title: 'Publications',
    underReview: 'Under Review',
    links: {
      journal: 'Journal',
      paper: 'Paper',
      arxiv: 'arXiv',
      project: 'Project',
    },
  },
  life: {
    title: 'Life',
    desc: 'Moments from travel, campus, friends, and everyday life.',
    filterLabel: 'Filter by category',
    empty: 'No photos yet — drop images into src/assets/gallery/<category>/ to see them here.',
    close: 'Close',
    all: 'All',
  },
  gadgets: {
    title: 'Gadgets',
    desc: 'Small apps and tools I designed and built — feel free to grab one.',
    download: 'Download',
    tryItNow: 'Try it now',
    opensInNewTab: 'opens in a new tab',
  },
  footer: {
    rights: 'All rights reserved.',
  },
} as const
