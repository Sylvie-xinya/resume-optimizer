# 简历优化工具 · 需求文档 v1.0

## 📋 项目概述

- **项目名称**：ResumeOptimizer - 简历优化助手
- **产品定位**：帮助留学生/求职者快速诊断、优化中英文简历，提升求职竞争力
- **核心价值**：用AI替代人工简历修改，低成本、高效率、标准化输出

---

## 🎯 目标用户

| 用户群体 | 痛点 |
|----------|------|
| 海归留学生 | 不了解国内简历偏好，中文表达弱 |
| 应届生 | 简历苍白，无量化数据 |
| 转行者 | 不知道如何包装跨行业经历 |

---

## 🧩 核心功能模块

### 模块1：简历诊断

**输入**：用户粘贴简历原文（粘贴文本 或 上传文件）

**输出**：
- 结构评分（5维度：基本信息、教育背景、实习/项目、技能、格式）
- 关键词缺失检测（针对目标岗位）
- 问题清单（TOP 5问题及改进建议）

**提示词模板**：
```
请诊断以下简历，目标岗位是【XXX】：

【简历内容】

输出JSON格式：
{
  "score": 85,
  "structure_issues": ["问题1", "问题2"],
  "missing_keywords": ["关键词1", "关键词2"],
  "top5_problems": [
    {"problem": "描述", "suggestion": "改进建议", "priority": "高/中/低"}
  ]
}
```

---

### 模块2：单条经历优化

**输入**：
- 原始bullet point（一条工作/项目描述）
- 目标岗位（可选）

**输出**：
- STAR法则改写版
- 量化数据补充建议
- 关键词植入
- 动作词优化

**示例**：

| 输入 | 输出 |
|------|------|
| 在公司做了数据分析 | **负责**业务数据分析，**建立**自动化报表体系，**提升**数据处理效率 **300%**，支持**10+**业务部门决策 |

---

### 模块3：简历翻译（英/中双向）

**输入**：中文或英文简历

**输出**：
- 地道目标语言版本
- 北美/国内求职习惯适配
- 专有名词准确翻译
- 文化差异调整（如 GPA 换算、学位名称）

---

### 模块4：岗位匹配度分析

**输入**：
- 简历内容
- 目标岗位JD

**输出**：
- 匹配度评分（百分比）
- 匹配点/不匹配点清单
- 简历调整建议（如何靠近JD要求）

---

### 模块5：简历生成（可选）

**输入**：
- 用户提供关键信息（经历、数据、成果）
- 选择简历模板风格

**输出**：
- 结构完整的简历初稿（Markdown/PDF）

---

## 📖 用户流程

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  选择功能   │ ──▶ │  输入简历   │ ──▶ │  AI处理    │ ──▶ │  查看结果   │
│             │     │  /JD/岗位   │     │  (3-10秒)   │     │  + 导出    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘

功能选择：
1. 简历诊断（免费试玩）
2. 单条优化（免费试玩）
3. 翻译润色（VIP）
4. 匹配度分析（VIP）
5. 完整简历生成（VIP）
```

---

## 🛠️ 技术方案

### 技术栈建议

| 层级 | 技术选择 |
|------|----------|
| 前端 | Next.js + React + Tailwind |
| 后端 | Next.js API Routes |
| AI | Claude API（长文本处理强） |
| 存储 | 本地 / 文件上传 |
| 部署 | Vercel / Cloudflare Pages |

### 接口设计

```typescript
// POST /api/resume/diagnose
interface Request {
  content: string;
  targetRole?: string;
}

interface Response {
  score: number;
  structure_issues: string[];
  missing_keywords: string[];
  top5_problems: Problem[];
}

// POST /api/resume/optimize
interface Request {
  bullet: string;
  targetRole?: string;
}

interface Response {
  optimized: string;
  star_format: string;
  quantification_suggestion: string;
  keywords_added: string[];
}

// POST /api/resume/translate
interface Request {
  content: string;
  from: 'zh' | 'en';
  to: 'zh' | 'en';
  region: 'cn' | 'us'; // 中国/北美求职习惯
}

interface Response {
  translated: string;
  cultural_notes: string[];
}

// POST /api/resume/match
interface Request {
  resume: string;
  jobDescription: string;
}

interface Response {
  match_score: number;
  matched_points: string[];
  missing_points: string[];
  suggestions: string[];
}
```

---

## 📊 MVP 功能优先级

| 优先级 | 功能 | 预计开发 |
|--------|------|----------|
| P0 | 单条经历优化 | 第1天 |
| P0 | 简历诊断 | 第1天 |
| P1 | 中英翻译 | 第2天 |
| P1 | 岗位匹配度 | 第2天 |
| P2 | 完整简历生成 | 第3天 |

---

## 💰 商业模式（可选）

| 模式 | 说明 |
|------|------|
| 免费版 | 每天3次诊断 + 5条优化 |
| 付费版 | ¥29/月，无限次 |
| 按次 | ¥9.9/次（完整简历） |
| B端 | 机构版，按人数收费 |

---

## ⚠️ 风险与边界

- **不保证offer**：工具是辅助，不能替代真实能力
- **隐私**：用户上传的简历不存储、不用于训练
- **误用提醒**：简历必须真实，不能过度夸大
- **版权**：不直接使用他人简历作为模板

---

## 📎 待补充

- [ ] 简历模板设计（Markdown样式）
- [ ] 用户登录/历史记录
- [ ] 支付对接
- [ ] 数据统计后台

---

**版本**：v1.0  
**日期**：2026-04-05  
**状态**：初稿待确认