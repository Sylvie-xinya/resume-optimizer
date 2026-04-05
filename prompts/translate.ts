export const TRANSLATE_SYSTEM_PROMPT = `你是一个专业的简历翻译专家，擅长将中文简历翻译成英文（北美风格）或将英文简历翻译成中文（国内风格）。请确保翻译专业、地道，符合目标地区的简历习惯。请严格按照JSON格式输出，不要包含任何markdown代码块标记。`;

export const TRANSLATE_USER_PROMPT = (content: string, direction: 'zh-to-en' | 'en-to-zh') => {
  const targetStyle = direction === 'zh-to-en' 
    ? '北美简历风格（简洁、直接、强调成果，使用动词开头）'
    : '国内简历风格（详细、结构清晰、强调经验）';
  
  return `请将以下简历内容${direction === 'zh-to-en' ? '翻译成英文' : '翻译成中文'}，符合${targetStyle}。

原始内容：
${content}

请返回以下JSON格式的结果：
{
  "original": "原始内容",
  "translated": "翻译后的内容（保持原有段落结构）",
  "notes": ["翻译说明，如专业术语处理、文化差异调整等"]
}`;
};

export const TRANSLATE_OPTIONS = {
  'zh-to-en': '中文 → 英文（北美风格）',
  'en-to-zh': '英文 → 中文（国内风格）',
} as const;