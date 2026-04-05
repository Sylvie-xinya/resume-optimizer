'use client';

import React, { useState } from 'react';

interface TranslateResult {
  original?: string;
  translated?: string;
  notes?: string[];
  raw?: string;
  error?: string;
}

export default function TranslateForm() {
  const [content, setContent] = useState('');
  const [direction, setDirection] = useState<'zh-to-en' | 'en-to-zh'>('zh-to-en');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslateResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, direction }),
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
        <h2 className="text-2xl font-bold text-gray-800">中英翻译</h2>
        <p className="text-gray-500 mt-1">双向翻译简历，适配国内或北美求职风格</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            翻译方向
          </label>
          <div className="flex gap-4">
            <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${
              direction === 'zh-to-en' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="direction"
                value="zh-to-en"
                checked={direction === 'zh-to-en'}
                onChange={() => setDirection('zh-to-en')}
                className="sr-only"
              />
              <div className="text-center">
                <span className="text-2xl">🇨🇳 → 🇺🇸</span>
                <p className="mt-1 text-sm font-medium text-gray-700">中文 → 英文</p>
                <p className="text-xs text-gray-500">北美简历风格</p>
              </div>
            </label>
            <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${
              direction === 'en-to-zh' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="direction"
                value="en-to-zh"
                checked={direction === 'en-to-zh'}
                onChange={() => setDirection('en-to-zh')}
                className="sr-only"
              />
              <div className="text-center">
                <span className="text-2xl">🇺🇸 → 🇨🇳</span>
                <p className="mt-1 text-sm font-medium text-gray-700">英文 → 中文</p>
                <p className="text-xs text-gray-500">国内简历风格</p>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            需要翻译的内容
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={direction === 'zh-to-en' 
              ? '请输入中文简历内容...' 
              : '请输入英文简历内容...'}
            className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-gray-700 placeholder-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '翻译中...' : '开始翻译'}
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
              {/* 翻译结果 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">🌐 翻译结果</h3>
                  {result.translated && (
                    <button
                      onClick={() => copyToClipboard(result.translated!)}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      📋 复制
                    </button>
                  )}
                </div>
                <div className="p-6">
                  <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                    <p className="text-gray-800 whitespace-pre-wrap">{result.translated}</p>
                  </div>
                </div>
              </div>

              {/* 翻译说明 */}
              {result.notes && result.notes.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-800">📝 翻译说明</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-2">
                      {result.notes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary-500 mt-1">•</span>
                          <span className="text-gray-700">{note}</span>
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

      {result && result.raw && !result.translated && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">⚠️ 解析异常，原始输出：</p>
          <pre className="mt-2 text-xs text-yellow-700 whitespace-pre-wrap">{result.raw}</pre>
        </div>
      )}
    </div>
  );
}