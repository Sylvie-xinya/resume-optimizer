'use client';

import React, { useState } from 'react';

interface OptimizeResult {
  original?: string;
  optimized?: string;
  starBreakdown?: {
    situation?: string;
    task?: string;
    action?: string;
    result?: string;
  };
  quantification?: string[];
  keywords?: string[];
  tips?: string[];
  raw?: string;
  error?: string;
}

export default function OptimizeForm() {
  const [experience, setExperience] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experience.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experience, targetRole: targetRole || undefined }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: '请求失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">经历优化</h2>
        <p className="text-gray-500 mt-1">使用 STAR 法则优化你的经历描述，突出成果与价值</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            目标岗位（可选）
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="例如：前端开发工程师、产品经理..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-700 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            经历描述
          </label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="请描述你的实习、项目或比赛经历...
例如：在XX公司实习期间，负责XX功能的开发，通过优化算法使页面加载速度提升50%。"
            className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-gray-700 placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !experience.trim()}
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '优化中...' : '开始优化'}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-6">
          {result.error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {result.error}
            </div>
          ) : (
            <>
              {/* 优化结果 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">✨ 优化后的描述</h3>
                  {result.optimized && (
                    <button
                      onClick={() => copyToClipboard(result.optimized!)}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      📋 复制
                    </button>
                  )}
                </div>
                <div className="p-6">
                  <div className="p-4 bg-accent-50 rounded-lg border border-accent-100">
                    <p className="text-gray-800 whitespace-pre-wrap">{result.optimized}</p>
                  </div>
                </div>
              </div>

              {/* STAR 分解 */}
              {result.starBreakdown && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-800">📊 STAR 法则分解</h3>
                  </div>
                  <div className="p-6 grid gap-4">
                    {result.starBreakdown.situation && (
                      <div>
                        <span className="text-sm font-medium text-primary-600">Situation（背景）</span>
                        <p className="text-gray-700 mt-1">{result.starBreakdown.situation}</p>
                      </div>
                    )}
                    {result.starBreakdown.task && (
                      <div>
                        <span className="text-sm font-medium text-primary-600">Task（任务）</span>
                        <p className="text-gray-700 mt-1">{result.starBreakdown.task}</p>
                      </div>
                    )}
                    {result.starBreakdown.action && (
                      <div>
                        <span className="text-sm font-medium text-primary-600">Action（行动）</span>
                        <p className="text-gray-700 mt-1">{result.starBreakdown.action}</p>
                      </div>
                    )}
                    {result.starBreakdown.result && (
                      <div>
                        <span className="text-sm font-medium text-primary-600">Result（结果）</span>
                        <p className="text-gray-700 mt-1">{result.starBreakdown.result}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 量化建议 */}
              {result.quantification && result.quantification.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-800">📈 量化建议</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-2">
                      {result.quantification.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-accent-500 mt-1">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 关键词建议 */}
              {result.keywords && result.keywords.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-800">🔑 建议植入的关键词</h3>
                  </div>
                  <div className="p-6 flex flex-wrap gap-2">
                    {result.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {result && result.raw && !result.optimized && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">⚠️ 解析异常，原始输出：</p>
          <pre className="mt-2 text-xs text-yellow-700 whitespace-pre-wrap">{result.raw}</pre>
        </div>
      )}
    </div>
  );
}