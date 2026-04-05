import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { resume, jobDescription } = await request.json();

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: '简历和JD都不能为空' },
        { status: 400 }
      );
    }

    const prompt = `请分析以下简历与岗位JD的匹配度。

简历内容：
${resume}

岗位JD：
${jobDescription}

请以JSON格式输出：
{
  "match_score": 75,
  "matched_points": ["匹配点1", "匹配点2"],
  "missing_points": ["缺失点1", "缺失点2"],
  "suggestions": ["改进建议1", "建议2"]
}

要求：
1. match_score 为 0-100 的百分比
2. matched_points 列出简历中符合JD要求的点
3. missing_points 列出简历中缺失的JD要求
4. suggestions 提供具体的简历调整建议

请直接输出JSON，不要其他内容。`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
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
        result = { raw: responseText };
      }
    } catch {
      result = { raw: responseText };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Resume matching error:', error);
    return NextResponse.json(
      { error: '匹配分析失败，请稍后重试' },
      { status: 500 }
    );
  }
}