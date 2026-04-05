import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { content, from, to, region } = await request.json();

    if (!content) {
      return NextResponse.json({ error: '简历内容不能为空' }, { status: 400 });
    }

    const regionNote = region === 'cn' 
      ? '请适配中国求职习惯（中文简历风格）' 
      : '请适配北美求职习惯（英文简历风格）';

    const prompt = `请将以下简历从${from === 'en' ? '英文' : '中文'}翻译成${to === 'zh' ? '中文' : '英文'}。${regionNote}

简历内容：
${content}

请以JSON格式输出：
{
  "translated": "翻译后的简历内容",
  "cultural_notes": ["文化适配说明1", "说明2"],
  "terms_explained": {"专业术语": "解释"}
}

要求：
1. 翻译地道、专业
2. 保留关键信息
3. 适配目标地区的简历习惯
4. 专有名词准确翻译

请直接输出JSON，不要其他内容。`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    let result;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = { translated: responseText };
      }
    } catch {
      result = { translated: responseText };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Resume translation error:', error);
    return NextResponse.json(
      { error: '翻译失败，请稍后重试' },
      { status: 500 }
    );
  }
}