import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { content, targetRole } = await request.json();

    if (!content) {
      return NextResponse.json({ error: '简历内容不能为空' }, { status: 400 });
    }

    const targetInfo = targetRole ? `目标岗位：${targetRole}` : '';

    const prompt = `请诊断以下简历。${targetInfo}

简历内容：
${content}

请以JSON格式输出诊断结果：
{
  "score": 85,
  "structure_issues": ["问题1", "问题2"],
  "missing_keywords": ["关键词1", "关键词2"],
  "top5_problems": [
    {"problem": "问题描述", "suggestion": "改进建议", "priority": "高/中/低"}
  ]
}

评分维度：基本信息完整性、教育背景清晰度、实习/项目经历描述、技能与岗位匹配度、格式与表达专业度

请直接输出JSON，不要其他内容。`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
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
        result = { raw: responseText };
      }
    } catch {
      result = { raw: responseText };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Resume diagnosis error:', error);
    return NextResponse.json(
      { error: '诊断失败，请稍后重试' },
      { status: 500 }
    );
  }
}