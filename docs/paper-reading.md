# 中文论文阅读页

在线地址：https://yriccch.github.io/paper-reading/

阅读页沿用北京攻略的静态发布方式：`public/paper-reading/` 随 Vite 构建复制到 `dist/paper-reading/`，推送 `main` 后由现有 GitHub Pages workflow 发布。主页论文区有阅读入口。无需另设服务器、部署账户或修改 CI。

## 更新内容

先在 PaperReading 项目完成全文与图片更新，重新生成其 `中文全文阅读/index.html`，然后在本仓库运行：

```sh
node scripts/sync-paper-reading.mjs --source '/你的路径/PaperReading/个人论文阅读与研究总结/中文全文阅读'
npm run build
git diff --check
```

使用本地 HTTP 预览检查阅读页，提交 `public/paper-reading/` 的变化并推送 `main`，确认 GitHub Actions 的 build 和 deploy 均成功后，再检查在线页面。

同步脚本仅复制 HTML 实际引用的图片（含放大图片），以及 HyperMOOC CHI 正式稿、电力 ChinaVis 2025 公开稿、采样论文的三个原文 PDF。三个 arXiv 原文链接固定到翻译对应版本。内部研究准备资料、离线核对目录和个人笔记不进入发布包；两条依赖这些本地目录的辅助 Markdown 链接在发布版中移除，正文的版本说明保留。

输入的总结保存在当前浏览器的 localStorage 中，不会上传到 GitHub 或服务器。原先 localhost 的笔记不会自动出现在在线地址；可用“导出笔记”保留副本。

`bundle-manifest.json` 记录源 HTML 与发布 HTML 的 SHA-256、资源清单和原文链接。同步脚本遇到缺失图片、含笔记文本的 HTML、未处理的本地链接或意外文件会停止，需人工核对后继续。
