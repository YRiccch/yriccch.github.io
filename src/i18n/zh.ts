/**
 * 中文 UI 文案。结构必须与 en.ts 对应。
 */
export default {
  nav: {
    home: '主页',
    about: '关于我',
    timeline: '时间线',
    publications: '发表论文',
    life: '生活',
    gadgets: '小玩意儿',
  },
  actions: {
    switchToLight: '切换到浅色模式',
    switchToDark: '切换到深色模式',
    switchLanguage: '切换语言',
    backToTop: '回到顶部',
  },
  about: {
    title: '你好，我是虞瑞麒。',
    interestsLabel: '兴趣',
  },
  timeline: {
    title: '我的时间线',
  },
  pubs: {
    title: '相关论文',
    underReview: 'Under Review',
    links: {
      journal: '期刊',
      paper: '论文',
      arxiv: 'arXiv',
      project: '项目页',
    },
  },
  life: {
    title: '生活',
    desc: '旅行、校园、朋友和那些值得被记住的日常。',
    filterLabel: '按分类筛选',
    empty: '还没有图片。把照片放进 src/assets/gallery/<分类>/ 下就会自动出现。',
    close: '关闭',
    all: '全部',
  },
  gadgets: {
    title: '小玩意儿',
    desc: '我自己设计的一些小程序与小工具，欢迎下载把玩。',
    download: '下载',
    tryItNow: 'Try it now',
    opensInNewTab: '在新标签页打开',
  },
  footer: {
    rights: '保留所有权利。',
  },
} as const
