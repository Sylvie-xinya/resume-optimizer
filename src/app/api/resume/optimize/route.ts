import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { bullet, targetRole } = await request.json();

    if (!bullet) {
      return NextResponse.json({ error: '经历描述不能为空' }, { status: 400 });
    }

    const targetInfo = targetRole ? `目标岗位：${targetRole}` : '';

    const prompt = `请优化以下工作/项目经历描述。${targetInfo}

原始描述：${bullet}

请以JSON格式输出优化结果：
{
  "optimized": "优化后的描述（使用STAR法则，包含量化数据）",
  "star_format": "STAR格式拆分（S-T-A-R）",
  "quantification_suggestion": "可量化的指标建议",
  "keywords_added": ["植入的关键词1", "关键词2"],
  "action_verbs": ["建议的动作词1", "动作词2"]
}

要求：
1. optimized 使用 STAR 法则（Situation-Task-Action-Result）
2. 结果要量化（数据化表达）
3. 植入与目标岗位相关的关键词
4. 开头使用强动作词

请直接输出JSON，不要其他内容。`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    // 解析 JSON 响应
    let result;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = { optimized: responseText };
      }
    } catch {
      result = { optimized: responseText };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Resume optimization error:', error);
    return NextResponse.json(
      { error: '优化失败，请稍后重试' },
      { status: 500 }
    );
  }
}