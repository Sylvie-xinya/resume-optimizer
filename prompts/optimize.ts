export const OPTIMIZE_SYSTEM_PROMPT = `你是一个专业的简历优化专家，擅长使用STAR法则改写经历描述，量化工作成果，并植入相关关键词。请严格按照JSON格式输出，不要包含任何markdown代码块标记。`;

export const OPTIMIZE_USER_PROMPT = (experience: string, targetRole?: string) => `请优化以下经历描述，使用STAR法则（Situation、Task、Action、Result）进行改写，并确保：
1. 突出工作成果和价值
2. 量化具体数据（人数、金额、百分比、时间等）
3. 植入与目标岗位相关的关键词
4. 保持简洁专业，不超过200字

原始描述：
${experience}

${targetRole ? `目标岗位：${targetRole}` : ''}

请返回以下JSON格式的结果：
{
  "original": "原始描述（保留）",
  "optimized": "优化后的描述（使用STAR法则，不超过200字）",
  "starBreakdown": {
    "situation": " Situation 部分",
    "task": " Task 部分",
    "action": " Action 部分",
    "result": " Result 部分（突出量化结果）"
  },
  "quantification": ["建议添加的具体数据/量化指标"],
  "keywords": ["建议植入的关键词"],
  "tips": ["优化建议"]
}`;