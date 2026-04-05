'use client';

import React, { useState } from 'react';
import ResultCard from './ResultCard';

interface DiagnoseResult {
  scores?: {
    basicInfo?: number;
    experienceQuality?: number;
    skillsClarity?: number;
    achievementQuantification?: number;
    structureReadability?: number;
  };
  overallScore?: number;
  missingInfo?: string[];
  problems?: string[];
  suggestions?: string[];
  summary?: string;
  raw?: string;
  error?: string;
}

export default function DiagnoseForm() {
  const [resume, setResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: '请求失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  const scores = result && result.scores ? [
    { label: '基本信息完整性', score: result.scores.basicInfo || 0 },
    { label: '经历描述专业性', score: result.scores.experienceQuality || 0 },
    { label: '技能展示清晰度', score: result.scores.skillsClarity || 0 },
    { label: '成就与结果量化', score: result.scores.achievementQuantification || 0 },
    { label: '整体结构与可读性', score: result.scores.structureReadability || 0 },
  ] : [];

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">简历诊断</h2>
        <p className="text-gray-500 mt-1">输入你的简历内容，获取专业的诊断分析</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            简历内容
          </label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="请粘贴你的简历内容（建议包含：基本信息、教育背景、实习/项目经历、技能等）..."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-gray-700 placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !resume.trim()}
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '分析中...' : '开始诊断'}
        </button>
      </form>

      {result && (
        <div className="mt-8">
          {result.error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {result.error}
            </div>
          ) : (
            <ResultCard
              title="诊断结果"
              scores={scores}
              overallScore={result.overallScore}
              missingInfo={result.missingInfo}
              problems={result.problems}
              suggestions={result.suggestions}
              summary={result.summary}
            />
          )}
        </div>
      )}

      {result && result.raw && !result.overallScore && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">⚠️ 解析异常，原始输出：</p>
          <pre className="mt-2 text-xs text-yellow-700 whitespace-pre-wrap">{result.raw}</pre>
        </div>
      )}
    </div>
  );
}