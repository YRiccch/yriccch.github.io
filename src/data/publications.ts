/**
 * 论文数据。
 * 论文的标题 / 作者 / 会议名按学术惯例保留原貌（中文论文用中文、英文论文用英文），
 * 不做翻译。只有 Link 按钮的标签走 i18n（journal / paper / arxiv / project）。
 */
export type PubLink = {
  kind: 'journal' | 'paper' | 'arxiv' | 'project'
  url: string
}

export type Publication = {
  id: string
  title: string
  /** 允许 <b> 标签来高亮本人姓名 */
  authorsHtml: string
  venue: string
  /** 缩略图路径（可选）；约定放在 public/pubs/<id>.png。
   *  没有 thumbnail 字段时，组件按 `/pubs/<id>.png` 自动找；图片缺失时显示占位 */
  thumbnail?: string
  links: PubLink[]
}

export const publications: Publication[] = [
  {
    id: 'multi-network-graph-sampling',
    title: '表征学习驱动的多重网络图采样',
    authorsHtml: '<b>虞瑞麒</b>，刘玉华，沈禧龙，翟如钰，张翔，周志光',
    venue: 'Journal of Zhejiang University – SCIENCE (2022)',
    links: [
      {
        kind: 'journal',
        url: 'https://www.academax.com/ZDXBLXB/doi/10.3785/j.issn.1008-9497.2022.03.002',
      },
    ],
  },
  {
    id: 'electricity-forecasting',
    title:
      'A Hierarchical Electricity Consumption Forecasting Visualization System based on Multi-scale LSTM-KAN Model',
    authorsHtml:
      'Hang Yin, Yize Li, Ning Xu, <b>Ruiqi Yu</b>, Ningxin Li, Wei Xu, Xiangyang Wu, Jie Xu, Yongheng Wang, Zhiguang Zhou',
    venue: 'ChinaVis 2025',
    links: [
      {
        kind: 'paper',
        url: 'https://chinavis.org/2025/papers/A%20Hierarchical%20Electricity%20Consumption%20Forecasting%20Visualization%20System%20Based%20on%20Multi-scale%20LSTM-KAN%20Model.pdf',
      },
    ],
  },
  {
    id: 'hypermooc',
    title: 'HyperMOOC: Augmenting MOOC Videos with Concept-based Embedded Visualizations',
    authorsHtml:
      'Li Ye, Lei Wang, Lihong Cai, <b>Ruiqi Yu</b>, Yong Wang, Yigang Wang, Wei Chen, Zhiguang Zhou',
    venue: 'ACM CHI',
    links: [
      { kind: 'arxiv', url: 'https://arxiv.org/pdf/2509.08404' },
      { kind: 'project', url: 'https://hypermooc.github.io/HyperMOOC/' },
    ],
  },
]
