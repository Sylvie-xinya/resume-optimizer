export const DIAGNOSE_SYSTEM_PROMPT = `你是一个专业的简历诊断专家，擅长分析简历的结构、内容的完整性和专业性。请严格按照JSON格式输出，不要包含任何markdown代码块标记。`;

export const DIAGNOSE_USER_PROMPT = (resume: string) => `请分析以下简历，从以下5个维度进行评分（每个维度1-10分）：

1. 基本信息完整性（姓名、联系方式、学历、专业等）
2. 经历描述专业性（实习、项目、比赛等描述质量）
3. 技能展示清晰度（技术技能、专业能力等）
4. 成就与结果量化程度（是否量化、有数据支撑）
5. 整体结构与可读性（排版、逻辑、层次）

同时识别：
- 缺失的关键信息
- 需要改进的问题
- 建议补充的内容

简历内容：
${resume}

请返回以下JSON格式的结果：
{
  "scores": {
    "basicInfo": 1-10,
    "experienceQuality": 1-10,
    "skillsClarity": 1-10,
    "achievementQuantification": 1-10,
    "structureReadability": 1-10
  },
  "overallScore": 1-10,
  "missingInfo": ["缺失的关键信息列表"],
  "problems": ["需要改进的问题列表"],
  "suggestions": ["建议补充的内容列表"],
  "summary": "总体评估摘要（100字以内）"
}`;