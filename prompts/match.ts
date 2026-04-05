export const MATCH_SYSTEM_PROMPT = `你是一个专业的简历JD匹配分析师，擅长分析简历与岗位要求的匹配程度。请严格按照JSON格式输出，不要包含任何markdown代码块标记。`;

export const MATCH_USER_PROMPT = (resume: string, jobDescription: string) => `请分析以下简历与岗位JD的匹配程度。

简历内容：
${resume}

岗位描述（JD）：
${jobDescription}

请从以下维度分析：
1. 技能匹配度（硬技能、软技能）
2. 经验匹配度（相关工作经验、项目经验）
3. 教育背景匹配度
4. 整体匹配度评估

请返回以下JSON格式的结果：
{
  "overallScore": 1-100,
  "skillMatch": {
    "score": 1-100,
    "matched": ["匹配的技能列表"],
    "missing": ["缺失的技能列表"],
    "partial": ["部分匹配的技能列表"]
  },
  "experienceMatch": {
    "score": 1-100,
    "matched": ["匹配的经验描述"],
    "gaps": ["经验差距"]
  },
  "educationMatch": {
    "score": 1-100,
    "status": "匹配/部分匹配/不匹配",
    "notes": "教育背景说明"
  },
  "recommendations": ["提升匹配度的具体建议"],
  "summary": "总体评估（150字以内）"
}`;