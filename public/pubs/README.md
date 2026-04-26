# Publication Thumbnails

This folder holds the teaser thumbnails for each paper listed in
`src/data/publications.ts`. The component looks up images by the paper's
`id` field, so **the filename (without extension) must match the id**.

## Required files

Drop these three PNGs into this folder. The blog will pick them up
automatically — no code change needed.

| Filename | Paper |
| --- | --- |
| `multi-network-graph-sampling.png` | 表征学习驱动的多重网络图采样 (Journal of Zhejiang University, 2022) |
| `electricity-forecasting.png` | A Hierarchical Electricity Consumption Forecasting Visualization System (ChinaVis 2025) |
| `hypermooc.png` | HyperMOOC: Augmenting MOOC Videos with Concept-based Embedded Visualizations (ACM CHI) |

## Specs

- **Aspect ratio**: 4:3 (e.g. 480 × 360 px). The component renders at
  120 px wide so 480 px is plenty for retina screens.
- **Format**: PNG (default). JPG also works if you set the `thumbnail`
  field on the publication entry. Aim for 100–300 KB after compression
  (squoosh.app does well for both formats).
- **Content**: the teaser figure from the paper's first page is the
  most informative choice. System screenshots, method diagrams, or
  cover images all work.

## Custom paths

If you ever want to use a different filename or extension, set the
`thumbnail` field on the publication entry:

```ts
{
  id: 'hypermooc',
  thumbnail: '/pubs/hypermooc-custom.jpg',  // overrides the default
  ...
}
```

## Fallback

If a thumbnail file is missing, the component shows a small placeholder
icon. The page won't break — you can add images one at a time at your
own pace.
