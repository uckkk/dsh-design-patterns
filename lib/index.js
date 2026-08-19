// dsh-design-patterns — UI 设计模式：常见界面组件模式与适用场景（纯 Node 知识库）。
import { defineTool } from "@deepseek-ai/dsh-tools";

const name = "UI 设计模式";
const inject = ["tools"];

const PATTERNS = [
  { id: "tab", name: "标签页", en: "Tabs", category: "导航", desc: "并列切换同类内容，用户清楚当前所在，适合少量固定分类。", tips: "标签 ≤ 5 个，标签名简短，勿嵌套标签页。" },
  { id: "breadcrumb", name: "面包屑", en: "Breadcrumb", category: "导航", desc: "层级路径导航，显示当前位置并可回溯，适合深层级网站。", tips: "层级清晰，当前页不可点，用分隔符区分层级。" },
  { id: "drawer", name: "抽屉", en: "Drawer", category: "导航", desc: "从侧边滑出的面板，承载次要操作或详情，不打断主流程。", tips: "适合移动端与详情侧栏，可配遮罩。" },
  { id: "form", name: "表单", en: "Form", category: "输入", desc: "结构化采集信息，标签 + 输入 + 校验 + 提交。", tips: "标签在上或左对齐，必填标注，即时校验。" },
  { id: "search", name: "搜索", en: "Search", category: "输入", desc: "关键词检索，含输入框、搜索按钮、结果列表。", tips: "提供占位提示与自动补全，支持清空与无结果态。" },
  { id: "autocomplete", name: "自动补全", en: "Autocomplete", category: "输入", desc: "输入时实时联想候选，减少输入成本与错误。", tips: "候选 ≤ 10 条，键盘可上下选择，高亮匹配。" },
  { id: "toast", name: "轻提示", en: "Toast", category: "反馈", desc: "短暂出现的非阻断反馈，用于操作成功/失败，自动消失。", tips: "1 条不堆叠，2-4 秒消失，可带操作按钮。" },
  { id: "modal", name: "模态弹窗", en: "Modal", category: "反馈", desc: "阻断式对话框，强制用户处理重要信息或确认操作。", tips: "标题+说明+动作按钮，ESC/遮罩可关闭，勿滥用。" },
  { id: "skeleton", name: "骨架屏", en: "Skeleton", category: "反馈", desc: "内容加载时的占位图形，模拟真实布局，降低等待焦虑。", tips: "形状贴近真实内容，配合渐变动画。" },
  { id: "card", name: "卡片", en: "Card", category: "数据", desc: "把相关信息聚合为一个可点单元，便于扫读与组合。", tips: "标题+摘要+操作，统一圆角与阴影。" },
  { id: "table", name: "表格", en: "Table", category: "数据", desc: "结构化展示大量数据，支持排序、筛选、分页。", tips: "表头固定，列对齐，密集时用斑马纹。" },
  { id: "pagination", name: "分页", en: "Pagination", category: "数据", desc: "把长列表拆成多页，降低加载与阅读负担。", tips: "显示总数与当前页，提供上一页/下一页。" },
];

async function apply(ctx, _config) {
  ctx.tools.register(defineTool({
    name: "list_design_patterns",
    description: "列出常见 UI 设计模式（导航/输入/反馈/数据四类：标签页、面包屑、抽屉、表单、搜索、自动补全、轻提示、模态、骨架屏、卡片、表格、分页），含说明与使用要点。",
    parameters: {},
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: {
          count: { type: "integer", required: true },
          patterns: { type: "array", required: true, items: { type: "object", additionalProperties: false, properties: { id: { type: "string", required: true }, name: { type: "string", required: true }, en: { type: "string", required: true }, category: { type: "string", required: true }, desc: { type: "string", required: true } } } },
        },
      },
      render: (_a, v) => [{ type: "text", text: v.patterns.map((p) => `- [${p.category}] ${p.name}（${p.en}）：${p.desc}`).join("\n") }],
    },
    execute: async () => ({ count: PATTERNS.length, patterns: PATTERNS.map(({ id, name, en, category, desc }) => ({ id, name, en, category, desc })) }),
  }));

  ctx.tools.register(defineTool({
    name: "get_design_pattern",
    description: "查询某 UI 设计模式的说明与使用要点。`id` 传模式 id（如 modal、toast、skeleton、pagination）。",
    parameters: { id: { type: "string", required: true, description: "模式 id 或名称子串。" } },
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: { name: { type: "string", required: true }, en: { type: "string", required: true }, category: { type: "string", required: true }, desc: { type: "string", required: true }, tips: { type: "string", required: true } },
      },
      render: (_a, v) => [{ type: "text", text: `【${v.category}】${v.name}（${v.en}）\n${v.desc}\n使用要点：${v.tips}` }],
    },
    execute: async (args) => {
      const p = PATTERNS.find((x) => x.id === args.id || x.name.includes(args.id) || x.en.toLowerCase().includes(String(args.id).toLowerCase()));
      if (!p) throw new Error(`未找到 UI 设计模式：${args.id}`);
      return { name: p.name, en: p.en, category: p.category, desc: p.desc, tips: p.tips };
    },
  }));
}

export { apply, inject, name };
