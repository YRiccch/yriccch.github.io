我将为您在 Design Gallery 中创建一个新的 Project 用于新手问卷调研。

### 实施计划

1.  **创建新问卷组件 (`FreshmanSurvey.vue`)**
    *   基于现有的 `AniMaster.vue` 复制代码，创建 `src/views/designs/FreshmanSurvey.vue`。
    *   **数据源切换**：将数据导入路径修改为 `src/data/questionnares/freshman.json`。
    *   **适配调整**：
        *   保留原有的交互逻辑（Slider, Multi-choice 等），因为 `freshman.json` 使用了相同的题目结构。
        *   保留结果页的“映射分析”功能，它将自动汇总用户的“痛点”标签（因为数据中包含了 `mapping` 和 `dimension` 字段）。
        *   微调界面文案（如标题），使其更符合“新手痛点调研”的主题。

2.  **配置路由 (`router/index.js`)**
    *   注册新路由 `/designs/freshman`，指向新建的 `FreshmanSurvey.vue` 组件。

3.  **更新项目列表 (`stores/project.js`)**
    *   在 Design Gallery 中添加新卡片：
        *   **名称**：`AniMaster: 新手痛点调研`
        *   **描述**：`挖掘普通用户在 AI 视频生成中的真实痛点与需求。`
        *   **颜色**：使用区分于专家问卷的颜色（如淡蓝色 `#74b9ff`）。

确认后，我将立即执行上述更改。