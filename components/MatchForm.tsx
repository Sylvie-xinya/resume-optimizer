'use client';

import React, { useState } from 'react';

interface MatchResult {
  overallScore?: number;
  skillMatch?: {
    score?: number;
    matched?: string[];
    missing?: string[];
    partial?: string[];
  };
  experienceMatch?: {
    score?: number;
    matched?: string[];
    gaps?: string[];
  };
  educationMatch?: {
    score?: number;
    status?: string;
    notes?: string;
  };
  recommendations?: string[];
  summary?: string;
  raw?: string;
  error?: string;
}

export default function MatchForm() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume.trim() || !jobDescription.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: '请求失败，请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case '匹配':
        return 'bg-green-100 text-green-700';
      case '部分匹配':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">JD 匹配度分析</h2>
        <p className="text-gray-500 mt-1">输入简历和岗位描述，分析匹配程度并获取优化建议</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            简历内容
          </label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="请粘贴你的简历内容..."
            className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-gray-700 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            岗位描述（JD）
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="请粘贴目标岗位的JD内容..."
            className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-gray-700 placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !resume.trim() || !jobDescription.trim()}
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '分析中...' : '开始分析'}
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
              {/* 整体评分 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-800">🎯 匹配度评分</h3>
                </div>
                <div className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-4xl font-bold ${getScoreColor(result.overallScore || 0)}`}>
                    {result.overallScore || 0}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">总体匹配度</p>
                  {result.summary && (
                    <p className="mt-4 text-gray-700 max-w-xl mx-auto">{result.summary}</p>
                  )}
                </div>
              </div>

              {/* 技能匹配 */}
              {result.skillMatch && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">💻 技能匹配</h3>
                    <span className={`text-lg font-bold ${getScoreColor(result.skillMatch.score || 0)}`}>
                      {result.skillMatch.score || 0}%
                    </span>
                  </div>
                  <div className="p-6 grid gap-4 md:grid-cols-3">
                    <div>
                      <h4 className="text-sm font-medium text-green-600 mb-2">✅ 匹配技能</h4>
                      <ul className="space-y-1">
                        {result.skillMatch.matched?.map((skill, i) => (
                          <li key={i} className="text-sm text-gray-600">• {skill}</li>
                        ))}
                        {(!result.skillMatch.matched || result.skillMatch.matched.length === 0) && (
                          <li className="text-sm text-gray-400">暂无</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-600 mb-2">🔶 部分匹配</h4>
                      <ul className="space-y-1">
                        {result.skillMatch.partial?.map((skill, i) => (
                          <li key={i} className="text-sm text-gray-600">• {skill}</li>
                        ))}
                        {(!result.skillMatch.partial || result.skillMatch.partial.length === 0) && (
                          <li className="text-sm text-gray-400">暂无</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-red-600 mb-2">❌ 缺失技能</h4>
                      <ul className="space-y-1">
                        {result.skillMatch.missing?.map((skill, i) => (
                          <li key={i} className="text-sm text-gray-600">• {skill}</li>
                        ))}
                        {(!result.skillMatch.missing || result.skillMatch.missing.length === 0) && (
                          <li className="text-sm text-gray-400">暂无</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* 经验匹配 */}
              {result.experienceMatch && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">📊 经验匹配</h3>
                    <span className={`text-lg font-bold ${getScoreColor(result.experienceMatch.score || 0)}`}>
                      {result.experienceMatch.score || 0}%
                    </span>
                  </div>
                  <div className="p-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-green-600 mb-2">✅ 匹配经验</h4>
                      <ul className="space-y-1">
                        {result.experienceMatch.matched?.map((exp, i) => (
                          <li key={i} className="text-sm text-gray-600">• {exp}</li>
                        ))}
                        {(!result.experienceMatch.matched || result.experienceMatch.matched.length === 0) && (
                          <li className="text-sm text-gray-400">暂无</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-red-600 mb-2">⚠️ 经验差距</h4>
                      <ul className="space-y-1">
                        {result.experienceMatch.gaps?.map((gap, i) => (
                          <li key={i} className="text-sm text-gray-600">• {gap}</li>
                        ))}
                        {(!result.experienceMatch.gaps || result.experienceMatch.gaps.length === 0) && (
                          <li className="text-sm text-gray-400">暂无</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* 教育背景匹配 */}
              {result.educationMatch && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">🎓 教育背景</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(result.educationMatch.status)}`}>
                      {result.educationMatch.status || '未知'}
                    </span>
                  </div>
                  <div className="p-6">
                    {result.educationMatch.notes && (
                      <p className="text-gray-700">{result.educationMatch.notes}</p>
                    )}
                  </div>
                </div>
              )}

              {/* 优化建议 */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-800">💡 优化建议</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-accent-50 rounded-lg">
                          <span className="text-accent-500 mt-0.5">→</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
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