'use client';

import React from 'react';

interface ScoreItem {
  label: string;
  score: number;
  maxScore?: number;
}

interface ResultCardProps {
  title?: string;
  scores?: ScoreItem[];
  overallScore?: number;
  missingInfo?: string[];
  problems?: string[];
  suggestions?: string[];
  summary?: string;
  children?: React.ReactNode;
}

function ScoreBar({ label, score, maxScore = 10 }: ScoreItem) {
  const percentage = (score / maxScore) * 100;
  const getColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-700">{score}/{maxScore}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getColor(score)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ListItem({ items, type = 'default' }: { items?: string[]; type?: 'default' | 'success' | 'warning' | 'error' }) {
  if (!items || items.length === 0) return null;

  const getColor = () => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className={`px-3 py-2 rounded ${getColor()} text-sm`}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function ResultCard({
  title,
  scores,
  overallScore,
  missingInfo,
  problems,
  suggestions,
  summary,
  children,
}: ResultCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      
      <div className="p-6">
        {overallScore !== undefined && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-3xl font-bold">
              {overallScore}
            </div>
            <p className="mt-2 text-sm text-gray-500">综合评分</p>
          </div>
        )}

        {scores && scores.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">维度评分</h4>
            {scores.map((item, index) => (
              <ScoreBar key={index} {...item} />
            ))}
          </div>
        )}

        {summary && (
          <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
            <p className="text-sm text-primary-800">{summary}</p>
          </div>
        )}

        {missingInfo && missingInfo.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">📌 缺失信息</h4>
            <ListItem items={missingInfo} type="error" />
          </div>
        )}

        {problems && problems.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">⚠️ 需要改进</h4>
            <ListItem items={problems} type="warning" />
          </div>
        )}

        {suggestions && suggestions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">💡 优化建议</h4>
            <ListItem items={suggestions} type="success" />
          </div>
        )}

        {children}
      </div>
    </div>
  );
}