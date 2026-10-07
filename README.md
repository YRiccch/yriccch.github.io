# 个人主页

Ruiqi Yu 的个人主页，使用 React、TypeScript 和 Vite 构建，通过 GitHub Pages 发布。

## 本地开发

```sh
npm ci
npm run dev
```

主页使用 `/`，子页面使用已有的 hash 路由。主页内容位于 `src/data/`，组件和页面位于 `src/components/` 与 `src/views/`，静态资源位于 `public/`。

## 检查与发布

```sh
npm run lint
npm run build
```

构建依次完成图片处理、相册校验、TypeScript 检查和 Vite 构建，输出到 `dist/`。`dist/` 与自动生成的图片资源不提交。

`.github/workflows/deploy-pages.yml` 在 `main` 推送后构建并发布整个 `dist/`。提交和推送后，需要确认 GitHub Actions 的构建与部署均成功。

## 旅行模板

旅行行程模板、北京实例、图片与原始 HTML 快照已迁往独立私有仓库 [travel-itinerary-template](https://github.com/YRiccch/travel-itinerary-template)。后续旅行在该仓库维护。

个人主页不再包含旅行攻略源码或生成脚本，也不再发布原 `/travel/` 下的攻略页面。
